"""
Lauro 3D completo (Blender por script): cor + boca articulada + esqueleto + animações.

Uso (dentro de remotion/):
    python3 tools/lauro3d.py public/3d/lauro_forma.glb public/3d/lauro.glb

Etapas
 1. Importa a malha do Hunyuan3D, junta vértices, apaga a bomba duplicada.
 2. Adensa a malha em volta da boca (2 subdivisões) e CORTA a linha dos lábios.
 3. Mapa UV (smart project) e textura 2048 pintada por projeção das vistas da folha
    de personagem (frente, costas, perfil direito e perfil espelhado), com teste de
    visibilidade (z-buffer) para não pintar o que está escondido.
 4. Interior da boca: fundo escuro, dentes de cima, dentes de baixo e língua.
 5. Shape keys (viram morph targets no glTF):
      abrir, largo, redondo, apertar, fv, sorriso, labio_cima, labio_baixo
 6. Esqueleto (19 ossos), pesos automáticos; interior da boca preso na cabeça.
 7. Ações: parado, andar, acenar, pular, falar, bah, mate.
"""
import sys, math, os
import bpy, bmesh
import numpy as np
from mathutils import Vector, Quaternion
from PIL import Image

src, dst = sys.argv[-2], sys.argv[-1]
IMG = 'public/img/3d/'
TEX_OUT = '../previa/3d/modelos/lauro_textura.png'
FPS = 30
T = 2048  # resolução da textura

# ---------------------------------------------------------------- 1. importa
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
body.name = 'Lauro'

bm = bmesh.new()
bm.from_mesh(body.data)
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=0.0005)
kill = [v for v in bm.verts if v.co.z > 0.335 and v.co.y < -0.255 and v.co.x < -0.1]
bmesh.ops.delete(bm, geom=kill, context='VERTS')
print('bomba extra: apagados', len(kill))

# ---------------------------------------------------------------- 1b. separa os braços do tronco
# A malha do Hunyuan3D vem com o braço FUNDIDO ao tronco entre Z 0,22 e o ombro. Corta a axila com um
# plano inclinado (até o topo da axila) e tampa os dois lados, para o braço poder abrir sem esticar o colete.
AX_Z0, AX_Z1 = 0.200, 0.375


def axila_plane(sd):
    n = Vector((sd * 1.0, 0.0, -0.12)).normalized()
    p = Vector((sd * 0.222, 0.0, 0.215))
    return n, p


def separate_arm(bm, sd):
    n, p = axila_plane(sd)
    faces = [f for f in bm.faces if 0.14 < sd * f.calc_center_median().x < 0.33 and 0.18 < f.calc_center_median().z < 0.40]
    geom = list(set([e for f in faces for e in f.edges] + [v for f in faces for v in f.verts])) + faces
    res = bmesh.ops.bisect_plane(bm, geom=geom, dist=1e-6, plane_co=p, plane_no=n)
    cut = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
    cut = [e for e in cut if AX_Z0 < (e.verts[0].co.z + e.verts[1].co.z) / 2 < AX_Z1 and len(e.link_faces) == 2]
    bmesh.ops.split_edges(bm, edges=cut)
    pd = lambda co: n.dot(co - p)
    bnd = [e for e in bm.edges if e.is_boundary and all(abs(pd(v.co)) < 1e-4 for v in e.verts)
           and AX_Z0 - 0.01 < (e.verts[0].co.z + e.verts[1].co.z) / 2 < AX_Z1 + 0.01]
    made = 0
    for sign in (-1, 1):  # -1 = lado do tronco, +1 = lado do braço
        es = [e for e in bnd if pd(e.link_faces[0].calc_center_median()) * sign > 0]
        if len(es) < 3:
            continue
        adj = {}
        for e in es:
            a, b = e.verts
            adj.setdefault(a, []).append(b); adj.setdefault(b, []).append(a)
        # pode haver mais de uma corrente: tampa cada uma
        seen = set()
        for start0 in adj:
            if start0 in seen:
                continue
            ends = [v for v in adj if len(adj[v]) == 1 and v not in seen]
            start = start0
            # anda até a ponta, se houver
            comp = set(); stack = [start0]
            while stack:
                v = stack.pop()
                if v in comp:
                    continue
                comp.add(v); stack += adj[v]
            ends = [v for v in comp if len(adj[v]) == 1]
            if ends:
                start = ends[0]
            chain = [start]; prev = None; cur = start
            while True:
                nxt = [w for w in adj[cur] if w is not prev and w not in chain]
                if not nxt:
                    break
                prev, cur = cur, nxt[0]; chain.append(cur)
            seen |= comp
            if len(chain) < 3:
                continue
            ctr = sum((v.co for v in chain), Vector()) / len(chain)
            cv = bm.verts.new(ctr - n * (0.004 * sign))  # centro levemente "para dentro" de cada parte
            out = n * (-sign)  # tampa do tronco aponta para o braço e vice-versa
            out = n if sign < 0 else -n
            for i in range(len(chain)):
                a, b = chain[i], chain[(i + 1) % len(chain)]
                try:
                    f = bm.faces.new((cv, a, b))
                except ValueError:
                    continue
                f.normal_update()
                if f.normal.dot(out) < 0:
                    f.normal_flip()
                made += 1
    print('axila', 'E' if sd > 0 else 'D', ': arestas cortadas', len(cut), '| faces de tampa', made)


separate_arm(bm, +1)
separate_arm(bm, -1)
bm.normal_update()

# ---------------------------------------------------------------- 2. boca
XC, HW, ZC = -0.015, 0.046, 0.6525   # centro x, meia largura, altura da linha da boca


def zc(x):
    t = np.clip((np.asarray(x) - XC) / HW, -1.0, 1.0)
    return ZC - 0.003 * t * t


def in_face_box(c):
    return (-0.125 < c.x < 0.095) and (0.565 < c.z < 0.725) and c.y < 0.01


for it in range(2):
    edges = set()
    for f in bm.faces:
        if in_face_box(f.calc_center_median()):
            edges.update(f.edges)
    bmesh.ops.subdivide_edges(bm, edges=list(edges), cuts=1, use_grid_fill=True)
bmesh.ops.triangulate(bm, faces=bm.faces[:])

# frente do rosto na altura da boca
front = [v.co.y for v in bm.verts if abs(v.co.x - XC) < 0.01 and abs(v.co.z - ZC) < 0.006]
YF = min(front)
print('frente da boca Y =', round(YF, 4), 'vértices no rosto:', sum(1 for v in bm.verts if in_face_box(v.co)))


def face_side(f):
    c = f.calc_center_median()
    if abs(c.x - XC) > HW or c.y > YF + 0.025 or abs(c.z - zc(c.x)) > 0.015:
        return 0
    return 1 if c.z > zc(c.x) else -1


side = {f: face_side(f) for f in bm.faces}
cut = []
for e in bm.edges:
    if len(e.link_faces) != 2:
        continue
    a, b = e.link_faces
    if side[a] * side[b] == -1:
        mid = (e.verts[0].co + e.verts[1].co) / 2
        if abs(mid.x - XC) < HW - 0.003:
            cut.append(e)
print('arestas da linha da boca:', len(cut))
bmesh.ops.split_edges(bm, edges=cut)
# alinha os lábios na curva e separa os vértices de cima/baixo
upper_lip, lower_lip = set(), set()
for v in bm.verts:
    if not v.is_boundary or abs(v.co.x - XC) > HW or v.co.y > YF + 0.03 or abs(v.co.z - zc(v.co.x)) > 0.015:
        continue
    s = sum(side.get(f, 0) for f in v.link_faces)
    v.co.z = float(zc(v.co.x))
    (upper_lip if s > 0 else lower_lip).add(v)
bm.verts.index_update()
UPPER = [v.index for v in upper_lip]
LOWER = [v.index for v in lower_lip]
print('lábio de cima:', len(UPPER), 'lábio de baixo:', len(LOWER))
bm.to_mesh(body.data)
bm.free()
for p in body.data.polygons:
    p.use_smooth = True

# ---------------------------------------------------------------- 3. UV + textura projetada
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
bpy.context.view_layer.objects.active = body
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.002)
bpy.ops.object.mode_set(mode='OBJECT')
# rosto: ilha própria, projetada de frente (sem emendas) e bem maior no mapa = mais nitidez
FX0, FX1, FZ0, FZ1 = XC - 0.175, XC + 0.175, 0.535, 0.865


def is_face(c, ny):
    return 0.55 < c[2] < 0.845 and abs(c[0] - XC) < 0.165 and c[1] < 0.12 and ny < -0.15


bmu = bmesh.new(); bmu.from_mesh(body.data); bmu.normal_update()
uvl = bmu.loops.layers.uv.active
nface = 0
for f in bmu.faces:
    if is_face(f.calc_center_median(), f.normal.y):
        nface += 1
        for l in f.loops:
            l[uvl].uv = ((l.vert.co.x - FX0) / (FX1 - FX0) * 0.6, (l.vert.co.z - FZ0) / (FZ1 - FZ0) * 0.6)
bmu.to_mesh(body.data); bmu.free()
bpy.context.scene.tool_settings.use_uv_select_sync = True
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.pack_islands(rotate=False, margin=0.002)
bpy.ops.object.mode_set(mode='OBJECT')
print('faces do rosto com ilha própria:', nface)

me = body.data
me.calc_loop_triangles()
nt = len(me.loop_triangles)
tv = np.zeros(nt * 3, np.int64); me.loop_triangles.foreach_get('vertices', tv); tv = tv.reshape(-1, 3)
tl = np.zeros(nt * 3, np.int64); me.loop_triangles.foreach_get('loops', tl); tl = tl.reshape(-1, 3)
co = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
vn = np.zeros(len(me.vertices) * 3); me.vertex_normals.foreach_get('vector', vn); vn = vn.reshape(-1, 3)
uv = np.zeros(len(me.loops) * 2); me.uv_layers.active.data.foreach_get('uv', uv); uv = uv.reshape(-1, 2)


def raster(p):
    """p: (3,2) em pixels contínuos. devolve x0,y0,máscara e baricêntricas"""
    x0, x1 = int(np.floor(p[:, 0].min())), int(np.ceil(p[:, 0].max()))
    y0, y1 = int(np.floor(p[:, 1].min())), int(np.ceil(p[:, 1].max()))
    xs, ys = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
    (ax, ay), (bx, by), (cx, cy) = p
    d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
    if abs(d) < 1e-12:
        return None
    l1 = ((by - cy) * (xs - cx) + (cx - bx) * (ys - cy)) / d
    l2 = ((cy - ay) * (xs - cx) + (ax - cx) * (ys - cy)) / d
    l3 = 1 - l1 - l2
    m = (l1 >= -0.02) & (l2 >= -0.02) & (l3 >= -0.02)
    return x0, y0, m, l1, l2, l3


# 3a. posição e normal 3D de cada texel
POS = np.zeros((T, T, 3), np.float32)
NOR = np.zeros((T, T, 3), np.float32)
HAS = np.zeros((T, T), bool)
for i in range(nt):
    p = np.c_[uv[tl[i], 0] * T, (1 - uv[tl[i], 1]) * T]
    r = raster(p)
    if r is None:
        continue
    x0, y0, m, l1, l2, l3 = r
    h, w = m.shape
    ys_, xs_ = np.nonzero(m)
    X, Y = xs_ + x0, ys_ + y0
    ok = (X >= 0) & (X < T) & (Y >= 0) & (Y < T)
    X, Y, ys_, xs_ = X[ok], Y[ok], ys_[ok], xs_[ok]
    b = np.stack([l1[ys_, xs_], l2[ys_, xs_], l3[ys_, xs_]], 1)
    v = tv[i]
    POS[Y, X] = b @ co[v]
    NOR[Y, X] = b @ vn[v]
    HAS[Y, X] = True
NOR /= np.linalg.norm(NOR, axis=2, keepdims=True) + 1e-9
print('texels cobertos:', HAS.sum())

# 3b. vistas da folha de personagem
lo, hi = co.min(0), co.max(0)


def load(name, mirror=False):
    im = Image.open(IMG + name).convert('RGBA')
    if mirror:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return np.asarray(im).astype(np.float32)


VIEWS = [
    # nome, imagem, (eixo horizontal, sinal), depth = sinal*eixo, direção da câmera (normal que "olha" para ela), peso
    ('frente', load('lauro_frente.png'), (0, +1), (1, +1), np.array([0, -1, 0]), 1.0),
    ('costas', load('lauro_costas.png'), (0, -1), (1, -1), np.array([0, 1, 0]), 0.85),
    ('perfil_dir', load('lauro_perfil.png'), (1, -1), (0, +1), np.array([-1, 0, 0]), 0.5),
    ('perfil_esq', load('lauro_perfil.png', True), (1, +1), (0, -1), np.array([1, 0, 0]), 0.3),
]


def proj(view, P):
    _, img, (ax, sg), (dax, dsg), _, _ = view
    h, w = img.shape[:2]
    if sg > 0:
        u = (P[..., ax] - lo[ax]) / (hi[ax] - lo[ax]) * w
    else:
        u = (hi[ax] - P[..., ax]) / (hi[ax] - lo[ax]) * w
    vv = (hi[2] - P[..., 2]) / (hi[2] - lo[2]) * h
    depth = dsg * P[..., dax]
    return u, vv, depth


from scipy.ndimage import median_filter, gaussian_filter1d


def _profile(mask):
    h, w = mask.shape
    L = np.full(h, np.nan); R = np.full(h, np.nan); Wd = np.zeros(h)
    for i in range(h):
        xs = np.nonzero(mask[i])[0]
        if len(xs):
            L[i], R[i], Wd[i] = xs[0], xs[-1], len(xs)
    return L, R, Wd


def align_rows(mm, mi, band=120):
    """alinha a silhueta do modelo (mm) com a da imagem (mi), linha por linha (DTW).
    devolve rowmap (linha da imagem para cada linha do modelo) e a, b (x_img = a*x + b)"""
    h, w = mm.shape
    Lm, Rm, Wm = _profile(mm); Li, Ri, Wi = _profile(mi)
    feat = lambda L, R, Wd: np.c_[Wd / w, np.nan_to_num(L, nan=-w) / w, np.nan_to_num(R, nan=-w) / w]
    Fm, Fi = feat(Lm, Rm, Wm), feat(Li, Ri, Wi)
    Dt = np.full((h + 1, h + 1), 1e18); Dt[0, 0] = 0
    for i in range(1, h + 1):
        j0, j1 = max(1, i - band), min(h, i + band)
        c = np.abs(Fi[j0 - 1:j1] - Fm[i - 1]).sum(1)
        for j in range(j0, j1 + 1):
            Dt[i, j] = c[j - j0] + min(Dt[i - 1, j - 1], Dt[i - 1, j] + 0.002, Dt[i, j - 1] + 0.002)
    i, j = h, h; path = {}
    while i > 0 and j > 0:
        path.setdefault(i - 1, []).append(j - 1)
        k = int(np.argmin([Dt[i - 1, j - 1], Dt[i - 1, j], Dt[i, j - 1]]))
        i, j = (i - 1, j - 1) if k == 0 else ((i - 1, j) if k == 1 else (i, j - 1))
    rowmap = np.array([np.mean(path.get(r, [r])) for r in range(h)])
    rowmap = np.maximum.accumulate(gaussian_filter1d(rowmap, 6))
    ri = np.clip(rowmap.round().astype(int), 0, h - 1)
    a = np.ones(h); b = np.zeros(h)
    ok = ~np.isnan(Lm) & ~np.isnan(Li[ri]) & ((Rm - Lm) > 3)
    a[ok] = (Ri[ri][ok] - Li[ri][ok]) / (Rm[ok] - Lm[ok]); b[ok] = Li[ri][ok] - a[ok] * Lm[ok]
    a = gaussian_filter1d(median_filter(np.clip(a, 0.85, 1.15), 41), 8)
    b = gaussian_filter1d(median_filter(b, 41), 8)
    return rowmap, a, b


# região da cuia + mão direita em cada imagem (x0, y0, x1, y1) e na malha (caixa 3D)
CUIA_IMG = {
    'frente': [(148, 360, 200, 475), (18, 470, 198, 656)],
    'perfil_dir': [(345, 360, 390, 465), (330, 455, 475, 640)],
    'perfil_esq': [(84, 360, 129, 465), (0, 455, 144, 640)],  # espelhada: aqui é sempre proibida
}
inbox = HAS & (POS[..., 0] < -0.13) & (POS[..., 0] > -0.34) & (POS[..., 1] < -0.09) & (POS[..., 2] > 0.05) & (POS[..., 2] < 0.52)
print('texels da cuia/mão:', int(inbox.sum()))
FACE = HAS & (POS[..., 2] > 0.55) & (POS[..., 2] < 0.845) & (np.abs(POS[..., 0] - XC) < 0.165) & (POS[..., 1] < 0.12) & (NOR[..., 1] < -0.15)
print('texels do rosto:', int(FACE.sum()))
ACC = np.zeros((T, T, 3), np.float32)
WS = np.zeros((T, T), np.float32)
for view in VIEWS:
    name, img, _, _, cdir, wt = view
    h, w = img.shape[:2]
    # z-buffer da vista
    DM = np.full((h, w), np.inf, np.float32)
    U, Vv, D = proj(view, co)
    for i in range(nt):
        v = tv[i]
        r = raster(np.c_[U[v], Vv[v]])
        if r is None:
            continue
        x0, y0, m, l1, l2, l3 = r
        dd = l1 * D[v[0]] + l2 * D[v[1]] + l3 * D[v[2]]
        ys_, xs_ = np.nonzero(m)
        X, Y = xs_ + x0, ys_ + y0
        ok = (X >= 0) & (X < w) & (Y >= 0) & (Y < h)
        X, Y, z = X[ok], Y[ok], dd[ys_[ok], xs_[ok]]
        np.minimum.at(DM, (Y, X), z)
    rowmap, a_, b_ = align_rows(np.isfinite(DM), img[..., 3] > 128)
    u, vv, d = proj(view, POS)
    ix = np.clip(u.astype(int), 0, w - 1)
    iy = np.clip(vv.astype(int), 0, h - 1)
    vis = HAS & (d <= DM[iy, ix] + 0.008)
    # coordenadas na imagem (corrigidas pelo alinhamento)
    rr = np.clip(vv, 0, h - 1.001)
    r0 = rr.astype(int); fr = rr - r0; r1 = np.minimum(r0 + 1, h - 1)
    v_img = rowmap[r0] * (1 - fr) + rowmap[r1] * fr
    u_img = (a_[r0] * (1 - fr) + a_[r1] * fr) * u + (b_[r0] * (1 - fr) + b_[r1] * fr)
    jx = np.clip(u_img.astype(int), 0, w - 1)
    jy = np.clip(v_img.astype(int), 0, h - 1)
    # leitura bilinear (suave) da imagem
    bx = np.clip(u_img - 0.5, 0, w - 1.001); by = np.clip(v_img - 0.5, 0, h - 1.001)
    x0b = bx.astype(int); y0b = by.astype(int); fx = (bx - x0b)[..., None]; fy = (by - y0b)[..., None]
    col = ((img[y0b, x0b] * (1 - fx) + img[y0b, x0b + 1] * fx) * (1 - fy)
           + (img[y0b + 1, x0b] * (1 - fx) + img[y0b + 1, x0b + 1] * fx) * fy)
    del bx, by, x0b, y0b, fx, fy
    vis &= col[..., 3] > 128
    if name in CUIA_IMG:
        inmask = np.zeros_like(vis)
        for (a0, b0, a1, b1) in CUIA_IMG[name]:
            inmask |= (jx >= a0) & (jx <= a1) & (jy >= b0) & (jy <= b1)
        if name == 'perfil_esq':
            vis &= ~inmask
        else:
            vis &= np.where(inbox, inmask, ~inmask)
    facing = np.clip(NOR @ cdir, 0, 1)  # normal virada para a câmera
    pw = 2 if name in ('frente', 'costas') else 3
    thr = 0.08 if name in ('frente', 'costas') else 0.5  # perfis só pintam o que aponta mesmo para o lado
    wgt = vis * (facing > thr) * facing ** pw * wt
    if name == 'frente':
        wgt = np.where(FACE, vis * facing * wt, wgt)  # rosto: só a frente, mesmo nas laterais
    else:
        wgt = wgt * ~FACE
    ACC += col[..., :3] * wgt[..., None]
    WS += wgt
    print('vista', name, 'texels visíveis:', int(vis.sum()), '| boca do modelo (linha', int((hi[2] - ZC) / (hi[2] - lo[2]) * h), ') -> imagem', round(float(np.interp((hi[2] - ZC) / (hi[2] - lo[2]) * h, np.arange(h), rowmap)), 1))

TEX = np.zeros((T, T, 3), np.float32)
good = WS > 1e-4
TEX[good] = ACC[good] / WS[good, None]
# o que nenhuma vista mostra: cor dos pontos mais próximos no espaço 3D (não no mapa UV)
from scipy.spatial import cKDTree
unseen = HAS & ~good
for grp in (inbox, ~inbox):  # a cuia/mão só empresta cor para a cuia/mão, e o corpo só para o corpo
    src = good & grp
    gy, gx = np.nonzero(src)
    step = max(1, len(gy) // 600000)
    gy, gx = gy[::step], gx[::step]
    tree3 = cKDTree(POS[gy, gx])
    uy, ux = np.nonzero(unseen & grp)
    if len(uy) == 0:
        continue
    dist, idx = tree3.query(POS[uy, ux], k=8)
    wq = 1.0 / (dist + 1e-4)
    TEX[uy, ux] = (TEX[gy[idx], gx[idx]] * wq[..., None]).sum(1) / wq.sum(1)[:, None]
good |= unseen
print('texels sem vista preenchidos em 3D:', int(unseen.sum()))

# 3c. tira o "risco" dos dentes pintado em cima dos lábios (a boca agora abre de verdade)
band = HAS & (np.abs(POS[..., 0] - XC) < HW + 0.004) & (POS[..., 1] < YF + 0.02)
dz = POS[..., 2] - zc(POS[..., 0])
src_lip = band & good & (dz < -0.004) & (dz > -0.009)
if src_lip.any():
    lip = np.median(TEX[src_lip], axis=0)
    k = band & (dz < 0) & (dz > -0.003)
    a = (1 - np.abs(dz[k]) / 0.003)[:, None] * 0.7
    TEX[k] = TEX[k] * (1 - a) + lip * a
    print('cor do lábio', lip.astype(int))

# nitidez leve no rosto
from scipy.ndimage import gaussian_filter
blur = np.stack([gaussian_filter(TEX[..., c], 1.4) for c in range(3)], -1)
TEX[FACE] = np.clip(TEX[FACE] + 0.55 * (TEX[FACE] - blur[FACE]), 0, 255)
del blur
# 3d. preenche buracos e as margens das ilhas (dilatação)
filled = good.copy()
for it in range(40):
    if filled.all():
        break
    acc = np.zeros_like(TEX); cnt = np.zeros((T, T), np.float32)
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
        s = np.roll(np.roll(filled, dy, 0), dx, 1)
        acc += np.roll(np.roll(TEX, dy, 0), dx, 1) * s[..., None]
        cnt += s
    new = (~filled) & (cnt > 0)
    TEX[new] = acc[new] / cnt[new, None]
    filled |= new
os.makedirs(os.path.dirname(TEX_OUT), exist_ok=True)
Image.fromarray(np.clip(TEX, 0, 255).astype(np.uint8)).save(TEX_OUT)
print('textura salva', TEX_OUT)

img = bpy.data.images.load(os.path.abspath(TEX_OUT))
img.pack()


def material(name, color=None, image=None, rough=0.65):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Roughness'].default_value = rough
    if image is not None:
        tex = m.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = image
        m.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    else:
        bsdf.inputs['Base Color'].default_value = (*color, 1)
    return m


def srgb(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


body.data.materials.clear()
body.data.materials.append(material('Lauro_pele', image=img))

# ---------------------------------------------------------------- 4. interior da boca
parts = []


def ellipsoid(name, center, radii, mat, bend=0.0, segs=(24, 12)):
    me2 = bpy.data.meshes.new(name)
    b2 = bmesh.new()
    bmesh.ops.create_uvsphere(b2, u_segments=segs[0], v_segments=segs[1], radius=1.0)
    for v in b2.verts:
        x, y, z = v.co.x * radii[0], v.co.y * radii[1], v.co.z * radii[2]
        y += bend * x * x  # acompanha a curva da arcada
        v.co = Vector((center[0] + x, center[1] + y, center[2] + z))
    b2.to_mesh(me2); b2.free()
    ob = bpy.data.objects.new(name, me2)
    scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    for p in ob.data.polygons:
        p.use_smooth = True
    parts.append(ob)
    return ob


m_boca = material('Lauro_boca', srgb('3A1512'), rough=0.9)
m_dente = material('Lauro_dentes', srgb('EEE7DA'), rough=0.35)
m_lingua = material('Lauro_lingua', srgb('B4535A'), rough=0.6)
ellipsoid('boca_fundo', (XC, YF + 0.036, ZC - 0.006), (HW * 0.9, 0.03, 0.026), m_boca)
ellipsoid('dentes_cima', (XC, YF + 0.0095, ZC + 0.0035), (HW * 0.72, 0.0032, 0.0042), m_dente, bend=7.0)
ellipsoid('dentes_baixo', (XC, YF + 0.012, ZC - 0.0045), (HW * 0.66, 0.003, 0.0038), m_dente, bend=7.0)
ellipsoid('lingua', (XC, YF + 0.028, ZC - 0.012), (HW * 0.62, 0.022, 0.0065), m_lingua)
# empurra as peças para trás da pele (a pele do queixo curva para trás e o fundo furava)
from scipy.spatial import cKDTree
_bc = np.zeros(len(body.data.vertices) * 3); body.data.vertices.foreach_get('co', _bc); _bc = _bc.reshape(-1, 3)
_bn = np.zeros(len(body.data.vertices) * 3); body.data.vertex_normals.foreach_get('vector', _bn); _bn = _bn.reshape(-1, 3)
_sel = (np.abs(_bc[:, 0] - XC) < 0.12) & (_bc[:, 2] > 0.57) & (_bc[:, 2] < 0.72) & (_bn[:, 1] < -0.2)
_tree = cKDTree(_bc[_sel][:, [0, 2]]); _sy = _bc[_sel][:, 1]
MARGIN = {'boca_fundo': 0.006, 'dentes_cima': 0.0025, 'dentes_baixo': 0.0035, 'lingua': 0.006}
for ob in parts:
    pc = np.zeros(len(ob.data.vertices) * 3); ob.data.vertices.foreach_get('co', pc); pc = pc.reshape(-1, 3)
    idx = _tree.query_ball_point(pc[:, [0, 2]], 0.006)
    moved = 0
    for k, ids in enumerate(idx):
        if ids:
            sk = _sy[ids].min() + MARGIN[ob.name]
            if pc[k, 1] < sk:
                pc[k, 1] = sk; moved += 1
    ob.data.vertices.foreach_set('co', pc.ravel())
    print('  ', ob.name, 'vértices empurrados para dentro:', moved)
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
print('partes da boca:', ranges)

# ---------------------------------------------------------------- 5. shape keys
co = np.zeros(len(body.data.vertices) * 3); body.data.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
x, y, z = co[:, 0], co[:, 1], co[:, 2]


def sstep(a, b, t):
    t = np.clip((t - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


isbody = np.arange(len(co)) < n_body
lx = np.abs(x - XC)
zl = zc(x)
below = z < zl - 1e-6
above = ~below
# mandíbula
wj = isbody * below * (1 - sstep(0.06, 0.118, lx)) * sstep(0.565, 0.592, z) * (1 - sstep(0.03, 0.09, y))
cl = np.array([XC - HW, float(zc(XC - HW))]); cr = np.array([XC + HW, float(zc(XC + HW))])
dL = np.hypot(x - cl[0], z - cl[1]); dR = np.hypot(x - cr[0], z - cr[1])
corner = np.maximum(1 - sstep(0, 0.022, dL), 1 - sstep(0, 0.022, dR)) * (y < YF + 0.035) * isbody
wj = np.maximum(wj, above * corner * 0.25 * isbody)
wj[LOWER] = 1.0
for nm in ('dentes_baixo', 'lingua'):
    a0, a1 = ranges[nm]; wj[a0:a1] = 1.0
a0, a1 = ranges['boca_fundo']
wj[a0:a1] = sstep(ZC - 0.004, ZC - 0.024, z[a0:a1])
# lábios
front_ok = (y < YF + 0.022) & isbody
w_up = above * front_ok * (1 - sstep(0, 0.012, z - zl)) * (1 - sstep(HW - 0.01, HW + 0.006, lx))
w_lo = below * front_ok * (1 - sstep(0, 0.014, zl - z)) * (1 - sstep(HW - 0.01, HW + 0.006, lx))
w_up[UPPER] = 1.0; w_lo[LOWER] = 1.0
sideX = np.sign(x - XC)
wC_L = (1 - sstep(0, 0.024, dL)) * front_ok
wC_R = (1 - sstep(0, 0.024, dR)) * front_ok
wC = np.maximum(wC_L, wC_R)

PIV = np.array([0.0, 0.075, 0.685])


def rot_x(P, ang):
    c, s = np.cos(ang), np.sin(ang)
    d = P - PIV
    yy = d[:, 1] * c - d[:, 2] * s
    zz = d[:, 1] * s + d[:, 2] * c
    return np.c_[P[:, 0], yy + PIV[1], zz + PIV[2]]


def add_key(name, newco):
    if body.data.shape_keys is None:
        body.shape_key_add(name='Basis')
    k = body.shape_key_add(name=name)
    k.data.foreach_set('co', newco.astype(np.float64).ravel())


D = co.copy()
tq = np.clip((x - XC) / HW, -1, 1)
oval = 1 - 0.6 * tq * tq * np.maximum(w_lo, 0)  # cantos abrem menos que o meio
J = rot_x(co, 0.19 * wj * oval)
J[LOWER, 1] += 0.002  # o lábio de baixo "enrola" para dentro ao abrir
J[:, 2] += 0.0022 * (1 - tq * tq) * w_up  # o lábio de cima sobe um pouco e mostra os dentes
add_key('abrir', np.where((wj[:, None] > 0) | (w_up[:, None] > 0), J, co))
K = co.copy(); K[:, 0] += sideX * 0.008 * wC; K[:, 1] += 0.003 * wC; K[:, 2] += 0.0015 * (w_lo - w_up) * 0.6
add_key('largo', K)
K = co.copy(); K[:, 0] -= sideX * 0.013 * wC; K[:, 1] -= 0.007 * np.maximum(w_up, w_lo); K[:, 2] += 0.0025 * w_up - 0.0035 * w_lo
add_key('redondo', K)
K = co.copy(); K[:, 1] -= 0.002 * np.maximum(w_up, w_lo); K[:, 2] += 0.0012 * w_lo - 0.0008 * w_up
add_key('apertar', K)
K = co.copy(); K[:, 2] += 0.0035 * w_lo; K[:, 1] += 0.0065 * w_lo
add_key('fv', K)
K = co.copy(); K[:, 2] += 0.006 * wC; K[:, 0] += sideX * 0.004 * wC; K[:, 1] += 0.003 * wC
add_key('sorriso', K)
K = co.copy(); K[:, 2] += 0.0045 * w_up; K[:, 1] -= 0.001 * w_up
add_key('labio_cima', K)
K = co.copy(); K[:, 2] -= 0.0055 * w_lo; K[:, 1] -= 0.0015 * w_lo
add_key('labio_baixo', K)
print('shape keys:', [k.name for k in body.data.shape_keys.key_blocks])

# ---------------------------------------------------------------- 6. esqueleto
Yb = 0.14
BONES = [
    ('quadril', (0, Yb, -0.12), (0, Yb, 0.05), None),
    ('coluna', (0, Yb, 0.05), (0, 0.13, 0.30), 'quadril'),
    ('peito', (0, 0.13, 0.30), (0, 0.12, 0.50), 'coluna'),
    ('pescoco', (0, 0.12, 0.50), (0, 0.10, 0.60), 'peito'),
    ('cabeca', (0, 0.10, 0.60), (0, 0.08, 0.98), 'pescoco'),
    ('ombro.L', (0.06, 0.13, 0.48), (0.27, 0.13, 0.47), 'peito'),
    ('braco.L', (0.27, 0.13, 0.47), (0.38, 0.15, 0.13), 'ombro.L'),
    ('antebraco.L', (0.38, 0.15, 0.13), (0.38, 0.15, -0.13), 'braco.L'),
    ('mao.L', (0.38, 0.15, -0.13), (0.37, 0.13, -0.29), 'antebraco.L'),
    ('ombro.R', (-0.06, 0.13, 0.48), (-0.27, 0.13, 0.47), 'peito'),
    ('braco.R', (-0.27, 0.13, 0.47), (-0.37, 0.15, 0.17), 'ombro.R'),
    ('antebraco.R', (-0.37, 0.15, 0.17), (-0.27, -0.02, 0.17), 'braco.R'),
    ('mao.R', (-0.27, -0.02, 0.17), (-0.21, -0.16, 0.20), 'antebraco.R'),
    ('coxa.L', (0.13, Yb, -0.12), (0.17, Yb, -0.50), 'quadril'),
    ('canela.L', (0.17, Yb, -0.50), (0.17, 0.15, -0.88), 'coxa.L'),
    ('pe.L', (0.17, 0.15, -0.88), (0.17, -0.04, -0.97), 'canela.L'),
    ('coxa.R', (-0.13, Yb, -0.12), (-0.17, Yb, -0.50), 'quadril'),
    ('canela.R', (-0.17, Yb, -0.50), (-0.17, 0.15, -0.88), 'coxa.R'),
    ('pe.R', (-0.17, 0.15, -0.88), (-0.17, -0.04, -0.97), 'canela.R'),
]
arm_data = bpy.data.armatures.new('EsqueletoLauro')
arm = bpy.data.objects.new('EsqueletoLauro', arm_data)
scene.collection.objects.link(arm)
bpy.ops.object.select_all(action='DESELECT')
bpy.context.view_layer.objects.active = arm
arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
for name, h, t, parent in BONES:
    b = arm_data.edit_bones.new(name)
    b.head, b.tail = Vector(h), Vector(t)
    b.roll = 0
    if parent:
        b.parent = arm_data.edit_bones[parent]
        b.use_connect = (Vector(h) - arm_data.edit_bones[parent].tail).length < 1e-4
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type='ARMATURE_AUTO')
# interior da boca e o rosto em volta da boca seguem só a cabeça
head = body.vertex_groups['cabeca']
others = [g for g in body.vertex_groups if g.name != 'cabeca']
inner = list(range(n_body, len(co)))
for g in others:
    g.remove(inner)
head.add(inner, 1.0, 'REPLACE')

# axilas: lado do tronco segue só o tronco; lado do braço segue só o braço (o ombro de cima fica com os pesos automáticos)
ARM = {1: ['braco.L', 'antebraco.L', 'mao.L', 'ombro.L'], -1: ['braco.R', 'antebraco.R', 'mao.R', 'ombro.R']}
TORSO = ['peito', 'coluna', 'quadril']
fixed = 0
for v in body.data.vertices:
    if v.index >= n_body or not (AX_Z0 - 0.02 < v.co.z < AX_Z1 + 0.005):
        continue
    sd = 1 if v.co.x > 0 else -1
    if sd < 0 and v.co.y < -0.09:
        continue  # mão e cuia na frente do peito
    n, p = axila_plane(sd)
    d = n.dot(v.co - p)
    if abs(v.co.x) < 0.12:
        continue
    names = {body.vertex_groups[g.group].name: g.weight for g in v.groups}
    if d < -0.002:  # tronco
        moved = sum(w for k, w in names.items() if k in ARM[sd])
        if moved > 1e-4:
            for k in names:
                if k in ARM[sd]:
                    body.vertex_groups[k].remove([v.index])
            body.vertex_groups['peito'].add([v.index], moved, 'ADD'); fixed += 1
    elif d > 0.002:  # braço
        moved = sum(w for k, w in names.items() if k in TORSO)
        if moved > 1e-4:
            for k in names:
                if k in TORSO:
                    body.vertex_groups[k].remove([v.index])
            body.vertex_groups['braco.' + ('L' if sd > 0 else 'R')].add([v.index], moved, 'ADD'); fixed += 1
print('pesos da axila corrigidos:', fixed)

# ---------------------------------------------------------------- 7. animações
rest = {b.name: b.matrix_local.to_quaternion() for b in arm_data.bones}


def q_arm(axis, deg):
    return Quaternion(Vector(axis), math.radians(deg))


def to_local(name, q):
    r = rest[name]
    return r.inverted() @ q @ r


def pose(frame, rots, hips_z=0.0):
    for pb in arm.pose.bones:
        q = Quaternion()
        for axis, deg in rots.get(pb.name, []):
            q = q_arm(axis, deg) @ q
        pb.rotation_mode = 'QUATERNION'
        pb.rotation_quaternion = to_local(pb.name, q)
        pb.keyframe_insert('rotation_quaternion', frame=frame)
        if pb.name == 'quadril':
            pb.location = Vector((0, hips_z, 0))
            pb.keyframe_insert('location', frame=frame)


X, Yax, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)
arm.animation_data_create()
S = math.sin
TAU = 2 * math.pi


def make_action(name, n, fn, step=1):
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


def parado(u):
    b = S(u * TAU)
    return ({'peito': [(X, -1.5 * b)], 'cabeca': [(X, 1.2 * S(u * TAU + 1)), (Z, 2 * S(u * TAU * 0.5))],
             'braco.L': [(X, 2 * b)], 'braco.R': [(X, -1 * b)]}, 0.004 * b)


def andar(u):
    a = S(u * TAU)
    k1 = max(0, S(u * TAU + math.pi / 2)); k2 = max(0, S(u * TAU + math.pi * 1.5))
    return ({'coxa.L': [(X, -24 * a)], 'coxa.R': [(X, 24 * a)], 'canela.L': [(X, 35 * k1)], 'canela.R': [(X, 35 * k2)],
             'pe.L': [(X, -10 * k1)], 'pe.R': [(X, -10 * k2)], 'braco.L': [(X, 18 * a)], 'antebraco.L': [(X, -12 - 6 * a)],
             'braco.R': [(X, -4 * a)], 'quadril': [(Z, 4 * a)], 'peito': [(Z, -6 * a), (X, 3)], 'cabeca': [(Z, 3 * a)]},
            0.025 * abs(S(u * TAU)) - 0.02)


def acenar(u):
    up = min(1, u / 0.18) if u < 0.82 else max(0, (1 - u) / 0.18)
    e = up * up * (3 - 2 * up); w = S(u * TAU * 4) * e
    # braço abre até a horizontal, ombro sobe um pouco e o COTOVELO leva a mão para cima
    return ({'ombro.L': [(Yax, -14 * e)], 'braco.L': [(Yax, -82 * e), (X, -12 * e)],
             'antebraco.L': [(Yax, -72 * e + 20 * w)], 'mao.L': [(Yax, 8 * w)],
             'peito': [(Yax, 3 * e)], 'cabeca': [(Yax, -4 * e), (X, -3 * e)]}, 0)


def pular(u):
    if u < 0.25:
        c = S(u / 0.25 * math.pi / 2); hz = -0.05 * c; air = 0
    elif u < 0.75:
        v = (u - 0.25) / 0.5; c = max(0, 1 - v * 3); hz = 0.22 * S(v * math.pi) - 0.05 * c; air = S(v * math.pi)
    else:
        v = (u - 0.75) / 0.25; c = S(v * math.pi); hz = -0.04 * c; air = 0
    return ({'coxa.L': [(X, -30 * c - 15 * air)], 'coxa.R': [(X, -30 * c - 15 * air)], 'canela.L': [(X, 50 * c + 25 * air)],
             'canela.R': [(X, 50 * c + 25 * air)], 'pe.L': [(X, -20 * c)], 'pe.R': [(X, -20 * c)], 'coluna': [(X, 12 * c)],
             'braco.L': [(Yax, -35 * air), (X, 10 * c)]}, hz)


def falar(u):
    g = S(u * TAU * 2)
    return ({'braco.L': [(X, -25 - 8 * g), (Yax, -10)], 'antebraco.L': [(X, -55 - 20 * g), (Z, 15 * S(u * TAU))],
             'mao.L': [(Z, 20 * g)], 'cabeca': [(X, 5 * S(u * TAU * 3)), (Z, 6 * S(u * TAU))],
             'peito': [(Z, 4 * S(u * TAU)), (X, -2)], 'braco.R': [(X, -3 * g)]}, 0.004 * S(u * TAU * 2))


def bah(u):
    a = min(1, u / 0.15); e = a * a * (3 - 2 * a); back = e * (1 - max(0, (u - 0.7) / 0.3))
    return ({'coluna': [(X, -6 * back)], 'peito': [(X, -10 * back)], 'cabeca': [(X, -14 * back)],
             'braco.L': [(Yax, -55 * back), (X, -20 * back)], 'antebraco.L': [(X, -40 * back)], 'braco.R': [(Yax, 12 * back)],
             'coxa.L': [(X, -6 * back)], 'coxa.R': [(X, -6 * back)], 'canela.L': [(X, 10 * back)], 'canela.R': [(X, 10 * back)]},
            0.05 * S(min(1, u / 0.35) * math.pi))


def mate(u):
    a = min(1, u / 0.25) if u < 0.75 else max(0, (1 - u) / 0.25)
    e = a * a * (3 - 2 * a)
    return ({'braco.R': [(X, -12 * e), (Yax, 6 * e)], 'antebraco.R': [(X, -38 * e), (Z, 22 * e)],
             'mao.R': [(Z, -20 * e), (X, 18 * e)], 'cabeca': [(X, -8 * e), (Z, -6 * e)]}, 0)


make_action('parado', 60, parado, 2)
make_action('andar', 32, andar, 1)
make_action('acenar', 72, acenar, 1)
make_action('pular', 24, pular, 1)
make_action('falar', 60, falar, 2)
make_action('bah', 30, bah, 1)
make_action('mate', 72, mate, 2)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                          export_skins=True, export_morph=True, export_apply=False, export_image_format='JPEG',
                          export_jpeg_quality=90)
print('OK', dst)
