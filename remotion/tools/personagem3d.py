"""
Prepara um personagem do Tripo para animar: boca articulada + esqueleto + ações.
(A textura do Tripo é mantida como veio.)

Uso (dentro de remotion/):
    python3 tools/personagem3d.py lauro public/3d/tripo/lauro_tripo.glb public/3d/tripo/lauro_anim.glb

As medidas de cada personagem (boca e ossos) ficam em tools/spec3d/personagens.json.
Saída: .glb com
  - 8 morph targets de boca: abrir, largo, redondo, apertar, fv, sorriso, labio_cima, labio_baixo
  - esqueleto de 19 ossos
  - ações: parado, falar, ouvir, bah
"""
import sys, math, json
import bpy, bmesh
import numpy as np
from mathutils import Vector, Quaternion
from scipy.spatial import cKDTree

nome, src, dst = sys.argv[-3], sys.argv[-2], sys.argv[-1]
cfg = json.load(open('tools/spec3d/personagens.json'))[nome]
XC, ZC, HW, CURV = cfg['boca']['xc'], cfg['boca']['zc'], cfg['boca']['hw'], cfg['boca']['curva']
K = HW / 0.046  # escala das medidas da boca (o Lauro antigo tinha meia largura 0,046)
NECK = cfg['pescoco_z']
FPS = 30


def zc(x):
    t = np.clip((np.asarray(x, dtype=float) - XC) / HW, -1.0, 1.0)
    return ZC + CURV * t * t


def sstep(a, b, t):
    t = np.clip((np.asarray(t, dtype=float) - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


# ------------------------------------------------------------ importa
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in scene.objects if o.type == 'MESH']
for o in scene.objects:
    o.select_set(o in meshes)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()
body = bpy.context.view_layer.objects.active
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in list(scene.objects):
    if o.type == 'EMPTY':
        bpy.data.objects.remove(o)
body.name = nome

bm = bmesh.new()
bm.from_mesh(body.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=2e-4)  # une peças soltas encostadas (ex.: emenda no rosto)

# frente do rosto na linha da boca
cand = [v.co.y for v in bm.verts if abs(v.co.x - XC) < 0.006 and ZC - 0.004 < v.co.z < ZC + 0.002]
YF = min(cand)
print(nome, 'frente da boca Y =', round(YF, 4), 'K =', round(K, 3))


def in_mouth_box(c):
    return abs(c.x - XC) < HW * 2.0 and abs(c.z - ZC) < HW * 1.4 and c.y < YF + 0.03 * K


edges = set()
for f in bm.faces:
    if in_mouth_box(f.calc_center_median()):
        edges.update(f.edges)
bmesh.ops.subdivide_edges(bm, edges=list(edges), cuts=1, use_grid_fill=True)
bmesh.ops.triangulate(bm, faces=[f for f in bm.faces if len(f.verts) > 4])


def face_side(f):
    c = f.calc_center_median()
    if abs(c.x - XC) > HW or c.y > YF + 0.02 * K or abs(c.z - float(zc(c.x))) > 0.012 * K:
        return 0
    return 1 if c.z > float(zc(c.x)) else -1


side = {f: face_side(f) for f in bm.faces}
cut = []
for e in bm.edges:
    if len(e.link_faces) != 2:
        continue
    a, b = e.link_faces
    if side[a] * side[b] == -1:
        mid = (e.verts[0].co + e.verts[1].co) / 2
        if abs(mid.x - XC) < HW - 0.003 * K:
            cut.append(e)
cut_pos = np.array([tuple(v.co) for e in cut for v in e.verts]) if cut else np.zeros((0, 3))
bmesh.ops.split_edges(bm, edges=cut)
cut_tree = cKDTree(cut_pos) if len(cut_pos) else None
upper, lower = set(), set()
for v in bm.verts:
    if not v.is_boundary or abs(v.co.x - XC) > HW or abs(v.co.z - float(zc(v.co.x))) > 0.012 * K:
        continue
    if cut_tree is None or cut_tree.query(tuple(v.co))[0] > 1e-7:
        continue  # borda de outra peça (bigode, etc.): não é lábio
    s = sum(side.get(f, 0) for f in v.link_faces)
    if s == 0:
        continue
    v.co.z = float(zc(v.co.x))
    (upper if s > 0 else lower).add(v)
bm.verts.index_update()
UPPER = [v.index for v in upper]
LOWER = [v.index for v in lower]
YL = float(np.median([v.co.y for v in (upper | lower)])) if (upper or lower) else YF  # profundidade real dos lábios
print('profundidade dos lábios YL =', round(YL, 4))
print('linha da boca: arestas', len(cut), '| lábio de cima', len(UPPER), '| de baixo', len(LOWER))
bm.to_mesh(body.data)
bm.free()


# ------------------------------------------------------------ interior da boca
def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def material(name, color, rough):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    return m


parts = []


def ellipsoid(name, center, radii, mat, bend=0.0):
    me2 = bpy.data.meshes.new(name)
    b2 = bmesh.new()
    bmesh.ops.create_uvsphere(b2, u_segments=24, v_segments=12, radius=1.0)
    for v in b2.verts:
        x, y, z = v.co.x * radii[0], v.co.y * radii[1], v.co.z * radii[2]
        y += bend * x * x
        v.co = Vector((center[0] + x, center[1] + y, center[2] + z))
    b2.to_mesh(me2); b2.free()
    ob = bpy.data.objects.new(name, me2)
    scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    for p in ob.data.polygons:
        p.use_smooth = True
    parts.append(ob)


ellipsoid('boca_fundo', (XC, YL + 0.032 * K, ZC - 0.006 * K), (HW * 0.88, 0.024 * K, 0.024 * K), material('boca', srgb('3A1512'), 0.9))
ellipsoid('dentes_cima', (XC, YL + 0.0075 * K, float(zc(XC)) + 0.0032 * K), (HW * 0.7, 0.0028 * K, 0.0038 * K), material('dentes', srgb('EEE7DA'), 0.35), bend=6.0 / K)
ellipsoid('dentes_baixo', (XC, YL + 0.009 * K, float(zc(XC)) - 0.0042 * K), (HW * 0.64, 0.0026 * K, 0.0034 * K), bpy.data.materials['dentes'], bend=6.0 / K)
ellipsoid('lingua', (XC, YL + 0.026 * K, ZC - 0.012 * K), (HW * 0.6, 0.02 * K, 0.006 * K), material('lingua', srgb('B4535A'), 0.6))

# peças sempre atrás da pele
bc = np.zeros(len(body.data.vertices) * 3); body.data.vertices.foreach_get('co', bc); bc = bc.reshape(-1, 3)
bn = np.zeros(len(body.data.vertices) * 3); body.data.vertex_normals.foreach_get('vector', bn); bn = bn.reshape(-1, 3)
sel = (np.abs(bc[:, 0] - XC) < HW * 2.6) & (np.abs(bc[:, 2] - ZC) < HW * 2.2) & (bn[:, 1] < -0.2)
tree = cKDTree(bc[sel][:, [0, 2]]); sy = bc[sel][:, 1]
MARGIN = {'boca_fundo': 0.006, 'lingua': 0.006}  # os dentes ficam fixos atrás dos lábios (sem empurrar ponto a ponto)
for ob in [o for o in parts if o.name in MARGIN]:
    pc = np.zeros(len(ob.data.vertices) * 3); ob.data.vertices.foreach_get('co', pc); pc = pc.reshape(-1, 3)
    for kk, ids in enumerate(tree.query_ball_point(pc[:, [0, 2]], 0.006 * K)):
        if ids:
            lim = sy[ids].min() + MARGIN[ob.name] * K
            if pc[kk, 1] < lim:
                pc[kk, 1] = lim
    ob.data.vertices.foreach_set('co', pc.ravel())

n_body = len(body.data.vertices)
ranges = {}
start = n_body
for ob in parts:
    ranges[ob.name] = (start, start + len(ob.data.vertices))
    start += len(ob.data.vertices)
bpy.ops.object.select_all(action='DESELECT')
for ob in parts:
    ob.select_set(True)
body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.object.join()
body = bpy.context.view_layer.objects.active

# ------------------------------------------------------------ formas de boca (shape keys)
co = np.zeros(len(body.data.vertices) * 3); body.data.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
x, y, z = co[:, 0], co[:, 1], co[:, 2]
isbody = np.arange(len(co)) < n_body
lx = np.abs(x - XC)
zl = zc(x)
below = z < zl - 1e-6
above = ~below
wj = isbody * below * (1 - sstep(0.06 * K, 0.118 * K, lx)) * sstep(ZC - 0.0875 * K, ZC - 0.06 * K, z) * (1 - sstep(YF + 0.105 * K, YF + 0.165 * K, y))
cl = np.array([XC - HW, float(zc(XC - HW))]); cr = np.array([XC + HW, float(zc(XC + HW))])
dL = np.hypot(x - cl[0], z - cl[1]); dR = np.hypot(x - cr[0], z - cr[1])
front_ok = (y < YF + 0.022 * K) & isbody
corner = np.maximum(1 - sstep(0, 0.022 * K, dL), 1 - sstep(0, 0.022 * K, dR)) * (y < YF + 0.035 * K) * isbody
wj = np.maximum(wj, above * corner * 0.25 * isbody)
wj[LOWER] = 1.0
for nm in ('dentes_baixo', 'lingua'):
    a0, a1 = ranges[nm]; wj[a0:a1] = 1.0
a0, a1 = ranges['boca_fundo']
wj[a0:a1] = sstep(ZC - 0.004 * K, ZC - 0.024 * K, z[a0:a1])
w_up = above * front_ok * (1 - sstep(0, 0.012 * K, z - zl)) * (1 - sstep(HW - 0.01 * K, HW + 0.006 * K, lx))
w_lo = below * front_ok * (1 - sstep(0, 0.014 * K, zl - z)) * (1 - sstep(HW - 0.01 * K, HW + 0.006 * K, lx))
w_up[UPPER] = 1.0; w_lo[LOWER] = 1.0
sideX = np.sign(x - XC)
wC = np.maximum(1 - sstep(0, 0.024 * K, dL), 1 - sstep(0, 0.024 * K, dR)) * front_ok
PIV = np.array([0.0, YF + 0.15 * K, ZC + 0.0325 * K])


def rot_x(P, ang):
    c, s = np.cos(ang), np.sin(ang)
    d = P - PIV
    return np.c_[P[:, 0], d[:, 1] * c - d[:, 2] * s + PIV[1], d[:, 1] * s + d[:, 2] * c + PIV[2]]


def add_key(name, newco):
    if body.data.shape_keys is None:
        body.shape_key_add(name='Basis')
    kk = body.shape_key_add(name=name)
    kk.data.foreach_set('co', newco.astype(np.float64).ravel())


tq = np.clip((x - XC) / HW, -1, 1)
oval = 1 - 0.85 * tq * tq * np.maximum(w_lo, 0)
J = rot_x(co, cfg['boca'].get('abrir_ang', 0.15) * wj * oval)
J[LOWER, 1] += 0.002 * K
J[:, 2] += 0.0022 * K * (1 - tq * tq) * w_up
add_key('abrir', np.where((wj[:, None] > 0) | (w_up[:, None] > 0), J, co))
Q = co.copy(); Q[:, 0] += sideX * 0.008 * K * wC; Q[:, 1] += 0.003 * K * wC; Q[:, 2] += 0.0009 * K * (w_lo - w_up)
add_key('largo', Q)
Q = co.copy(); Q[:, 0] -= sideX * 0.013 * K * wC; Q[:, 1] -= 0.007 * K * np.maximum(w_up, w_lo); Q[:, 2] += 0.0025 * K * w_up - 0.0035 * K * w_lo
add_key('redondo', Q)
Q = co.copy(); Q[:, 1] -= 0.002 * K * np.maximum(w_up, w_lo); Q[:, 2] += 0.0012 * K * w_lo - 0.0008 * K * w_up
add_key('apertar', Q)
Q = co.copy(); Q[:, 2] += 0.0035 * K * w_lo; Q[:, 1] += 0.0065 * K * w_lo
add_key('fv', Q)
Q = co.copy(); Q[:, 2] += 0.006 * K * wC; Q[:, 0] += sideX * 0.004 * K * wC; Q[:, 1] += 0.003 * K * wC
add_key('sorriso', Q)
Q = co.copy(); Q[:, 2] += 0.0045 * K * w_up; Q[:, 1] -= 0.001 * K * w_up
add_key('labio_cima', Q)
Q = co.copy(); Q[:, 2] -= 0.0055 * K * w_lo; Q[:, 1] -= 0.0015 * K * w_lo
add_key('labio_baixo', Q)

# ------------------------------------------------------------ olhos e sobrancelhas (shape keys)
RO = cfg['rosto']
face_ok = isbody & (y < YF + 0.05) & (y > YF - 0.03)  # pele da frente do rosto (sem a aba do chapéu)
_bn = np.zeros(len(body.data.vertices) * 3); body.data.vertex_normals.foreach_get('vector', _bn); _bn = _bn.reshape(-1, 3)
face_ok &= _bn[:, 1] < -0.05


def zona(c, sx, sz, a=0.75, b=1.3):
    cx, cz, hw, hh = c
    e = np.sqrt(((x - cx) / (hw * sx)) ** 2 + ((z - cz) / (hh * sz)) ** 2)
    return (1 - sstep(a, b, e)) * face_ok


def piscar(c, sob):
    """fecha o olho: a pálpebra de cima desce até a linha do olho; a pele acima estica até a sobrancelha (que fica parada)"""
    cx, cz, hw, hh = c
    zl = cz - 0.5 * hh               # onde as pálpebras se encontram
    zt = cz + hh                     # topo do olho
    zb = sob[1] - sob[3] * 1.2       # base da sobrancelha
    lat = (1 - sstep(1.0, 1.35, np.abs(x - cx) / hw)) * face_ok
    dz = np.zeros(len(co))
    eye = (z > zl) & (z <= zt + 0.2 * hh)
    dz[eye] = (zl + (z[eye] - zl) * 0.05) - z[eye]
    up = (z > zt + 0.2 * hh) & (z < zb)
    k = 1 - (z[up] - zt) / max(zb - zt, 1e-4)
    dz[up] = -(zt - zl) * 0.95 * np.clip(k, 0, 1) ** 1.6
    low = (z <= zl) & (z > cz - 1.6 * hh)
    dz[low] = (zl + (z[low] - zl) * 0.7) - z[low]
    Q = co.copy(); Q[:, 2] += lat * dz; Q[:, 1] -= 0.0012 * lat * (dz < 0)
    return Q


def sobrancelha(c, dz, dx_in=0.0, inner_only=0.0, sgn=1):
    cx, cz, hw, hh = c
    w = zona((cx, cz, hw, hh), 1.5, 3.2, 0.6, 1.4)
    inner = np.clip(1 - (x - cx) * sgn / hw * 0.8, 0.2, 1.8) / 1.8 if inner_only else 1.0  # 1 na ponta de dentro
    Q = co.copy()
    Q[:, 2] += dz * w * (inner if inner_only else 1.0)
    Q[:, 0] += dx_in * w * (-sgn)
    return Q


oD, oE, sD, sE = RO['olhoD'], RO['olhoE'], RO['sobrD'], RO['sobrE']
hh = (oD[3] + oE[3]) / 2
add_key('piscar_d', piscar(oD, sD))
add_key('piscar_e', piscar(oE, sE))
add_key('sobr_sobe_d', sobrancelha(sD, 0.7 * hh))
add_key('sobr_sobe_e', sobrancelha(sE, 0.7 * hh))
Q = sobrancelha(sD, -0.8 * hh, 0.2 * sD[2], 1, sgn=-1); Q2 = sobrancelha(sE, -0.8 * hh, 0.2 * sE[2], 1, sgn=1)
add_key('sobr_franze', np.where((x < 0)[:, None], Q, Q2))
Q = sobrancelha(sD, 1.1 * hh, 0, 1, sgn=-1); Q2 = sobrancelha(sE, 1.1 * hh, 0, 1, sgn=1)
add_key('sobr_triste', np.where((x < 0)[:, None], Q, Q2))
Q = co.copy()
for c in (oD, oE):
    w = zona(c, 1.25, 1.9) * (z > c[1] - 0.2 * c[3])
    Q[:, 2] += 0.35 * c[3] * w
add_key('arregalar', Q)
Q = co.copy()
for c in (oD, oE):
    w = zona(c, 1.3, 2.0) * (z < c[1])
    Q[:, 2] += 0.45 * c[3] * w * np.clip((c[1] - z) / c[3], 0, 1.5)
add_key('olhos_apertar', Q)
print('formas do rosto:', [k.name for k in body.data.shape_keys.key_blocks][9:], '| pele do rosto', int(face_ok.sum()))

# ------------------------------------------------------------ esqueleto
arm_data = bpy.data.armatures.new('Esqueleto_' + nome)
arm = bpy.data.objects.new('Esqueleto_' + nome, arm_data)
scene.collection.objects.link(arm)
bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = arm
arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for name, h, t, parent in cfg['ossos']:
    b = arm_data.edit_bones.new(name)
    b.head, b.tail = Vector(h), Vector(t)
    b.roll = 0
    if parent:
        b.parent = arm_data.edit_bones[parent]
        b.use_connect = (Vector(h) - arm_data.edit_bones[parent].tail).length < 1e-4
MAOS = cfg.get('maos', {})
for sd, hd in MAOS.items():
    nos, ponta = Vector(hd['nos']), Vector(hd['ponta'])
    mid = (nos + ponta) / 2
    for name, h, t, parent in [('dedos1.' + sd, nos, mid, 'mao.' + sd), ('dedos2.' + sd, mid, ponta, 'dedos1.' + sd),
                               ('polegar.' + sd, Vector(hd['pol_base']), Vector(hd['pol_ponta']), 'mao.' + sd)]:
        b = arm_data.edit_bones.new(name)
        b.head, b.tail = h, t
        b.roll = 0
        b.parent = arm_data.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type='ARMATURE_NAME')  # grupos vazios; os pesos vêm abaixo
# A malha do Tripo é feita de várias peças soltas e o "peso automático" do Blender falha nela.
# Pesos pela distância de cada vértice ao segmento de cada osso (1/d^4, no máximo 3 ossos).
bones = [(b[0], np.array(b[1], float), np.array(b[2], float)) for b in cfg['ossos']]
vg_names = [g.name for g in body.vertex_groups]
D = np.full((len(co), len(vg_names)), 9.0)
DRAW = np.full((len(co), len(vg_names)), 9.0)
for name, h, t in bones:
    seg = t - h; L2 = max(seg @ seg, 1e-9)
    tt = np.clip(((co - h) @ seg) / L2, 0, 1)
    d = np.linalg.norm(co - (h + tt[:, None] * seg), axis=1)
    # distância "relativa à grossura" do osso: coxa grossa ganha da mão fina na mesma distância
    RAD = {'cabeca': 0.09, 'pescoco': 0.05, 'peito': 0.11, 'coluna': 0.11, 'quadril': 0.11, 'ombro': 0.06,
           'braco': 0.035, 'antebraco': 0.03, 'mao': 0.025, 'coxa': 0.075, 'canela': 0.055, 'pe': 0.04}
    D[:, vg_names.index(name)] = d / RAD[name.split('.')[0]] * 0.04
    DRAW[:, vg_names.index(name)] = d
SIDE = {n: (1 if n.endswith('.L') else -1) for n in vg_names if n.endswith(('.L', '.R'))}
for n, sd in SIDE.items():  # osso de um lado não pega vértice do outro lado
    D[np.sign(co[:, 0]) == -sd, vg_names.index(n)] = 9
hip_z = bones[0][1][2]
for n in vg_names:
    if n.startswith(('coxa', 'canela', 'pe.')):
        D[co[:, 2] > hip_z + 0.03, vg_names.index(n)] = 9  # pernas só abaixo do quadril
W = 1.0 / (D + 0.004) ** 4
top = np.argsort(-W, axis=1)[:, 3:]
np.put_along_axis(W, top, 0, axis=1)
# cabeça: tudo acima do pescoço (chapéu, cabelo, orelhas) e o interior da boca seguem só a cabeça
hi = (co[:, 2] > NECK + 0.004) | (np.arange(len(co)) >= n_body)
ih = vg_names.index('cabeca')
W[hi] = 0; W[hi, ih] = 1
W = W / np.maximum(W.sum(1, keepdims=True), 1e-9)
# braço e mão: o que está mais perto de um osso do braço segue SÓ o braço (a mão fica ao lado da coxa e
# pegava peso da perna/quadril, virando "espinhos" quando o braço se mexia)
ARMB = [vg_names.index(n) for n in vg_names if n.startswith(('braco', 'antebraco', 'mao'))]
OTHER = [i for i in range(len(vg_names)) if i not in ARMB and not vg_names[i].startswith(('dedos', 'polegar'))]
shoulder_z = max(b[1][2] for b in bones if b[0].startswith('braco'))
DARM = D[:, ARMB].min(1)
for sd, hd in cfg.get('maos', {}).items():  # a mão inteira (punho até a ponta dos dedos) conta como braço
    P0, PT = np.array(hd['punho']), np.array(hd['ponta'])
    sgm = PT - P0; L2 = sgm @ sgm
    tt = np.clip(((co - P0) @ sgm) / L2, 0, 1.15)
    dh = np.linalg.norm(co - (P0 + tt[:, None] * sgm), axis=1) / 0.03 * 0.04
    dh[np.sign(co[:, 0]) != (1 if sd == 'L' else -1)] = 9
    DARM = np.minimum(DARM, dh)
arm_dom = (DARM < D[:, OTHER].min(1)) & (co[:, 2] < shoulder_z - 0.1) & isbody
# perto da mão, o que tem COR DE PELE é mão (separa a mão do bolso/bombacha encostados nela)
img = None
for mslot in body.data.materials:
    if mslot and mslot.use_nodes:
        for nd in mslot.node_tree.nodes:
            if nd.type == 'TEX_IMAGE' and nd.image is not None and nd.image.size[0] > 256:
                img = nd.image; break
    if img is not None:
        break
if img is not None and cfg.get('maos'):
    iw, ih_ = img.size
    px = np.zeros(iw * ih_ * 4, np.float32); img.pixels.foreach_get(px); px = px.reshape(ih_, iw, 4)
    uvl = body.data.uv_layers.active.data
    luv = np.zeros(len(uvl) * 2); uvl.foreach_get('uv', luv); luv = luv.reshape(-1, 2)
    lv = np.zeros(len(body.data.loops), np.int64); body.data.loops.foreach_get('vertex_index', lv)
    vuv = np.zeros((len(co), 2)); vuv[lv] = luv
    cx = np.clip((vuv[:, 0] % 1) * iw, 0, iw - 1).astype(int); cy = np.clip((vuv[:, 1] % 1) * ih_, 0, ih_ - 1).astype(int)
    rgb = px[cy, cx, :3] ** (1 / 2.2) * 255  # imagem linear -> sRGB
    skin = (rgb[:, 0] - rgb[:, 2] > 45) & (rgb[:, 0] > rgb[:, 1] + 15) & (rgb[:, 0] > 90)
    for sd, hd in cfg['maos'].items():
        P0, PT = np.array(hd['punho']), np.array(hd['ponta'])
        sgm = PT - P0; L2 = sgm @ sgm
        tt = np.clip(((co - P0) @ sgm) / L2, -0.3, 1.2)
        dd = np.linalg.norm(co - (P0 + tt[:, None] * sgm), axis=1)
        zone = (dd < 0.06) & (np.sign(co[:, 0]) == (1 if sd == 'L' else -1)) & isbody
        arm_dom[zone & skin] = True
        arm_dom[zone & ~skin & (dd > 0.035)] = False
        print('mão', sd, ': pele na zona', int((zone & skin).sum()), '| tecido fora', int((zone & ~skin & (dd > 0.035)).sum()))
W[arm_dom][:, OTHER] = 0
Wa = W[arm_dom]; Wa[:, OTHER] = 0
Wa[Wa.sum(1) < 1e-6, ARMB[0]] = 1
W[arm_dom] = Wa / Wa.sum(1, keepdims=True)
print('braço/mão isolados:', int(arm_dom.sum()))
# roupa larga (bombacha, vestido): o que fica longe do osso da perna segue mais o quadril
LEG = [vg_names.index(n) for n in vg_names if n.startswith(('coxa', 'canela', 'pe.'))]
iq = vg_names.index('quadril')
dleg = DRAW[:, LEG].min(1)
fr = np.clip((dleg - 0.07) / 0.05, 0, 1) * 0.7 * (co[:, 2] < hip_z + 0.02) * ~arm_dom
moved = W[:, LEG].sum(1) * fr
W[:, LEG] *= (1 - fr)[:, None]
W[:, iq] += moved
print('roupa larga: vértices aliviados', int((fr > 0.05).sum()))
# mãos: dedos (2 segmentos) e polegar
for sd, hd in MAOS.items():
    sg = 1 if sd == 'L' else -1
    P0, PN, PT = np.array(hd['punho']), np.array(hd['nos']), np.array(hd['ponta'])
    ax = PT - P0; L = np.linalg.norm(ax); ax /= L
    pr = (co - P0) @ ax
    rad = np.linalg.norm((co - P0) - np.outer(pr, ax), axis=1)
    pn = (PN - P0) @ ax; pt = (PT - P0) @ ax; pm = (pn + pt) / 2
    x0, x1, y0, y1, z0, z1 = hd['pol_caixa']
    thumb = (co[:, 0] > x0) & (co[:, 0] < x1) & (co[:, 1] > y0) & (co[:, 1] < y1) & (co[:, 2] > z0) & (co[:, 2] < z1) & isbody
    fd = PT - PN; fl = np.linalg.norm(fd); fd /= fl
    fpr = np.clip((co - PN) @ fd, 0, fl)
    dfin = np.linalg.norm(co - (PN + np.outer(fpr, fd)), axis=1)
    fing = (np.sign(co[:, 0]) == sg) & (pr > pn - 0.008) & (pr < pt + 0.015) & (dfin < hd['raio']) & ~thumb & arm_dom
    im_, i1, i2, ip = (vg_names.index(n + sd) for n in ('mao.', 'dedos1.', 'dedos2.', 'polegar.'))
    a = sstep(pn - 0.006, pn + 0.008, pr[fing]); b = sstep(pm - 0.008, pm + 0.008, pr[fing])
    W[fing] = 0; W[fing, im_] = 1 - a; W[fing, i1] = a * (1 - b); W[fing, i2] = a * b
    tb = np.array(hd['pol_base']); ta = np.array(hd['pol_ponta']) - tb; ta /= np.linalg.norm(ta)
    c = sstep(-0.006, 0.01, (co[thumb] - tb) @ ta)
    W[thumb] = 0; W[thumb, im_] = 1 - c; W[thumb, ip] = c
    print('mão', sd, ': dedos', int(fing.sum()), '| polegar', int(thumb.sum()))
for gi, gname in enumerate(vg_names):
    g = body.vertex_groups[gname]
    nz = np.nonzero(W[:, gi] > 1e-3)[0]
    q = np.round(W[nz, gi], 2)
    for wv in np.unique(q):
        g.add(nz[q == wv].tolist(), float(wv), 'REPLACE')
print('pesos: vértices com osso', int((W.sum(1) > 0).sum()), 'de', len(co))

# ------------------------------------------------------------ ações
rest = {b.name: b.matrix_local.to_quaternion() for b in arm_data.bones}
X, Yax, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)
S = math.sin
TAU = 2 * math.pi
arm.animation_data_create()


def pose(frame, rots, hz=0.0):
    for pb in arm.pose.bones:
        q = Quaternion()
        for axis, deg in rots.get(pb.name, []):
            q = Quaternion(Vector(axis), math.radians(deg)) @ q
        r = rest[pb.name]
        pb.rotation_mode = 'QUATERNION'
        pb.rotation_quaternion = r.inverted() @ q @ r
        pb.keyframe_insert('rotation_quaternion', frame=frame)
        if pb.name == 'quadril':
            pb.location = Vector((0, hz, 0))
            pb.keyframe_insert('location', frame=frame)


def make_action(name, n, fn, step=2):
    act = bpy.data.actions.new(name)
    arm.animation_data.action = act
    for f in range(0, n + 1, step):
        r, hz = fn(f / n)
        pose(f + 1, r, hz)
    act.use_fake_user = True
    tr = arm.animation_data.nla_tracks.new()
    tr.name = name
    tr.strips.new(name, 1, act)
    arm.animation_data.action = None


LAURO = nome == 'lauro'


def dedos(c, sides=None, c_pol=None):
    """dobra os dedos (graus): positivo fecha a mão, negativo abre"""
    r = {}
    for sd in MAOS:
        if sides and sd not in sides:
            continue
        sg = 1 if sd == 'L' else -1
        cc = c[sd] if isinstance(c, dict) else c
        r['dedos1.' + sd] = [(Yax, sg * cc)]
        r['dedos2.' + sd] = [(Yax, sg * cc * 1.3)]
        r['polegar.' + sd] = [(X, 0.55 * (cc if c_pol is None else c_pol))]
    return r


def junta(*ds):
    out = {}
    for d in ds:
        for k, v in d.items():
            out.setdefault(k, []).extend(v)
    return out


def parado(u):
    b = S(u * TAU)
    return ({'peito': [(X, -1.2 * b)], 'cabeca': [(X, 1.0 * S(u * TAU + 1)), (Z, 2 * S(u * TAU * 0.5))],
             'braco.L': [(X, 2 * b)], 'braco.R': [(X, -1 * b)], **dedos(16 + 5 * b)}, 0.002 * b)


def falar(u):
    g = S(u * TAU * 2)
    r = {'cabeca': [(X, 4 * S(u * TAU * 3)), (Z, 5 * S(u * TAU))], 'peito': [(Z, 3 * S(u * TAU)), (X, -1.5)],
         'braco.L': [(X, -22 - 7 * g), (Yax, -8)], 'antebraco.L': [(X, -45 - 18 * g), (Z, 12 * S(u * TAU))], 'mao.L': [(Z, 15 * g)]}
    if not LAURO:  # as crianças gesticulam com as duas mãos
        r['braco.R'] = [(X, -15 + 6 * g), (Yax, 6)]
        r['antebraco.R'] = [(X, -30 + 14 * g)]
    else:
        r['braco.R'] = [(X, -2 * g)]
    # mão que gesticula: abre na ênfase e fecha um pouco entre as frases
    cL = 8 + 30 * (0.5 + 0.5 * S(u * TAU * 2 + 1.2))
    cR = 8 + 30 * (0.5 + 0.5 * S(u * TAU * 2 + 2.6))
    r = junta(r, dedos({'L': cL, 'R': cR}))
    return (r, 0.002 * S(u * TAU * 2))


def ouvir(u):
    return ({'cabeca': [(Yax, 6 * S(u * TAU) + 4), (X, 3 * S(u * TAU * 2))], 'peito': [(X, -1 * S(u * TAU))],
             'braco.L': [(X, 2 * S(u * TAU))], **dedos(20 + 4 * S(u * TAU))}, 0.002 * S(u * TAU))


def bah(u):
    a = min(1, u / 0.15); e = a * a * (3 - 2 * a); back = e * (1 - max(0, (u - 0.7) / 0.3))
    return ({'coluna': [(X, -4 * back)], 'peito': [(X, -7 * back)], 'cabeca': [(X, -10 * back)],
             'braco.L': [(Yax, -30 * back), (X, -15 * back)], 'antebraco.L': [(X, -30 * back)],
             **dedos(18 - 40 * back)}, 0.02 * S(min(1, u / 0.35) * math.pi))


def andar(u):
    a = S(u * TAU)
    k1 = max(0, S(u * TAU + math.pi / 2)); k2 = max(0, S(u * TAU + math.pi * 1.5))
    r = {'coxa.L': [(X, -24 * a)], 'coxa.R': [(X, 24 * a)], 'canela.L': [(X, 35 * k1)], 'canela.R': [(X, 35 * k2)],
         'pe.L': [(X, -10 * k1)], 'pe.R': [(X, -10 * k2)], 'braco.L': [(X, 18 * a)], 'antebraco.L': [(X, -12 - 6 * a)],
         'quadril': [(Z, 4 * a)], 'peito': [(Z, -6 * a), (X, 3)], 'cabeca': [(Z, 3 * a)]}
    if LAURO:
        r['braco.R'] = [(X, -4 * a)]  # a cuia fica firme
    else:
        r['braco.R'] = [(X, -18 * a)]; r['antebraco.R'] = [(X, -12 + 6 * a)]
    r = junta(r, dedos(22 + 6 * a))
    return (r, 0.012 * abs(S(u * TAU)) - 0.01)


def espelha(r):
    """copia a pose do braço esquerdo para o direito (espelhada)"""
    out = dict(r)
    for k, v in r.items():
        if k.endswith('.L') and k[:-2] + '.R' not in r:
            out[k[:-2] + '.R'] = [(ax, -d if ax in (Yax, Z) else d) for ax, d in v]
    return out


def apontar(u):
    b = S(u * TAU)
    return (junta({'braco.L': [(X, -72), (Yax, -18)], 'antebraco.L': [(X, -18 + 3 * b)], 'peito': [(Z, 6), (X, -2)],
                   'cabeca': [(Z, 8), (X, -6)]}, dedos({'L': 6, 'R': 18})), 0.002 * b)


def rir(u):
    k = S(u * TAU * 4)
    r = {'coluna': [(X, -3 - 3 * k)], 'peito': [(X, -4 - 3 * k)], 'cabeca': [(X, -10 - 4 * k), (Z, 4 * S(u * TAU))],
         'braco.L': [(X, -10 + 4 * k), (Yax, -6)], 'antebraco.L': [(X, -40 - 6 * k)]}
    if not LAURO:
        r = espelha(r)
    return (junta(r, dedos(20)), 0.006 * abs(k))


def ombros(u):
    a = min(1, u / 0.25) if u < 0.75 else max(0, (1 - u) / 0.25)
    e = a * a * (3 - 2 * a)
    r = {'ombro.L': [(Yax, -12 * e)], 'braco.L': [(Yax, -18 * e), (X, -8 * e)], 'antebraco.L': [(X, -70 * e), (Yax, -15 * e)],
         'cabeca': [(Yax, 8 * e), (X, 3 * e)], 'peito': [(X, 3 * e)]}
    if not LAURO:
        r = espelha(r)
    else:
        r['ombro.R'] = [(Yax, 12 * e)]
    return (junta(r, dedos(10 - 25 * e)), 0.01 * e)


def tremer(u):
    q = S(u * TAU * 6)
    r = {'quadril': [(Z, 1.5 * q)], 'peito': [(Z, -2 * q), (X, 4)], 'cabeca': [(Z, 3 * q), (X, 5)],
         'ombro.L': [(Yax, -10)], 'braco.L': [(Yax, 10), (X, -20)], 'antebraco.L': [(X, -95), (Yax, 35)]}
    if not LAURO:
        r = espelha(r)
    else:
        r['ombro.R'] = [(Yax, 10)]
    return (junta(r, dedos(45)), -0.008 + 0.002 * q)


def cintura(u):
    b = S(u * TAU)
    r = {'braco.L': [(Yax, -38), (X, 12)], 'antebraco.L': [(Yax, 105), (X, 10)], 'mao.L': [(Yax, 25)],
         'cabeca': [(Yax, -6 + 2 * b), (Z, -5)], 'peito': [(X, -3)]}
    if not LAURO:
        r = espelha(r)
    return (junta(r, dedos(30)), 0.002 * b)


def sermao(u):
    w = S(u * TAU * 2)
    return (junta({'braco.L': [(X, -38), (Yax, -12)], 'antebraco.L': [(X, -92)], 'mao.L': [(Yax, 20 * w)],
                   'cabeca': [(Yax, 4 * w), (X, 4)], 'peito': [(X, 2)]}, dedos({'L': 35, 'R': 18})), 0)


make_action('parado', 60, parado)
make_action('falar', 60, falar)
make_action('ouvir', 90, ouvir)
make_action('bah', 30, bah, 1)
make_action('andar', 32, andar, 1)
make_action('apontar', 60, apontar)
make_action('rir', 40, rir, 1)
make_action('ombros', 60, ombros)
make_action('tremer', 30, tremer, 1)
make_action('cintura', 60, cintura)
make_action('sermao', 40, sermao, 1)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                          export_skins=True, export_morph=True, export_apply=False, export_image_format='JPEG',
                          export_jpeg_quality=92)
print('OK', dst)
