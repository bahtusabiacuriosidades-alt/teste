"""
Esqueleto + animações do Lauro 3D, feito por script no Blender (bpy).

Uso:  python3 tools/rig_lauro.py <entrada.glb> <saida.glb>

- Entrada: malha do Hunyuan3D (Y para cima no glTF; no Blender vira Z para cima,
  frente para -Y, direita do Lauro em -X).
- Monta um esqueleto simples (quadril, coluna, peito, pescoço, cabeça, braços,
  pernas), liga a malha com pesos automáticos e cria as ações:
  parado, andar, acenar, pular, falar, bah, mate.
- Exporta um .glb com todas as ações (cada uma vira uma animação no three.js).
"""
import sys, math
import bpy
from mathutils import Vector, Quaternion, Euler

src, dst = sys.argv[-2], sys.argv[-1]
FPS = 30

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = FPS

bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in scene.objects if o.type == 'MESH']
for o in scene.objects:
    o.select_set(False)
for o in meshes:
    o.select_set(True)
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
# junta vértices duplicados (ajuda o cálculo de pesos)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.remove_doubles(threshold=0.0005)
bpy.ops.object.mode_set(mode='OBJECT')
# a malha veio com a bomba dupla: apaga o canudo da frente (caixa medida na malha)
import bmesh
bm = bmesh.new(); bm.from_mesh(body.data)
kill = [v for v in bm.verts if v.co.z > 0.335 and v.co.y < -0.255 and v.co.x < -0.1]
print('BOMBA EXTRA: apagando', len(kill), 'vertices')
bmesh.ops.delete(bm, geom=kill, context='VERTS')
bm.to_mesh(body.data); bm.free()
bpy.ops.object.shade_smooth()

# ---------- esqueleto (coordenadas medidas na malha) ----------
Y = 0.14
BONES = [
    # nome, cabeça, cauda, pai
    ('quadril', (0, Y, -0.12), (0, Y, 0.05), None),
    ('coluna', (0, Y, 0.05), (0, 0.13, 0.30), 'quadril'),
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
    ('coxa.L', (0.13, Y, -0.12), (0.17, Y, -0.50), 'quadril'),
    ('canela.L', (0.17, Y, -0.50), (0.17, 0.15, -0.88), 'coxa.L'),
    ('pe.L', (0.17, 0.15, -0.88), (0.17, -0.04, -0.97), 'canela.L'),
    ('coxa.R', (-0.13, Y, -0.12), (-0.17, Y, -0.50), 'quadril'),
    ('canela.R', (-0.17, Y, -0.50), (-0.17, 0.15, -0.88), 'coxa.R'),
    ('pe.R', (-0.17, 0.15, -0.88), (-0.17, -0.04, -0.97), 'canela.R'),
]
arm_data = bpy.data.armatures.new('EsqueletoLauro')
arm = bpy.data.objects.new('EsqueletoLauro', arm_data)
scene.collection.objects.link(arm)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.mode_set(mode='EDIT')
for name, h, t, parent in BONES:
    b = arm_data.edit_bones.new(name)
    b.head, b.tail = Vector(h), Vector(t)
    b.roll = 0
    if parent:
        b.parent = arm_data.edit_bones[parent]
        b.use_connect = (Vector(h) - arm_data.edit_bones[parent].tail).length < 1e-4
bpy.ops.object.mode_set(mode='OBJECT')

# ---------- pele: pesos automáticos ----------
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type='ARMATURE_AUTO')
empty_groups = [vg.name for vg in body.vertex_groups]
counts = {g: 0 for g in empty_groups}
for v in body.data.vertices:
    for g in v.groups:
        if g.weight > 0.01:
            counts[body.vertex_groups[g.group].name] += 1
print('VERTICES POR OSSO', counts)

# ---------- animação ----------
rest = {b.name: b.matrix_local.to_quaternion() for b in arm_data.bones}


def q_arm(axis, deg):
    """rotação no espaço do esqueleto (X = lado, Y = frente/trás, Z = cima)"""
    return Quaternion(Vector(axis), math.radians(deg))


def to_local(name, q):
    r = rest[name]
    return r.inverted() @ q @ r


def pose(frame, rots, hips_z=0.0):
    """rots: {osso: [(eixo, graus), ...]} no espaço do esqueleto"""
    for pb in arm.pose.bones:
        q = Quaternion()
        for axis, deg in rots.get(pb.name, []):
            q = q_arm(axis, deg) @ q
        pb.rotation_mode = 'QUATERNION'
        pb.rotation_quaternion = to_local(pb.name, q)
        pb.keyframe_insert('rotation_quaternion', frame=frame)
        if pb.name == 'quadril':
            pb.location = Vector((0, hips_z, 0))  # Y local do quadril = Z do mundo
            pb.keyframe_insert('location', frame=frame)


X, Yax, Z = (1, 0, 0), (0, 1, 0), (0, 0, 1)
arm.animation_data_create()
actions = []


def make_action(name, n, fn, step=1):
    act = bpy.data.actions.new(name)
    arm.animation_data.action = act
    for f in range(0, n + 1, step):
        r, hz = fn(f / n, f)
        pose(f + 1, r, hz)
    act.use_fake_user = True
    track = arm.animation_data.nla_tracks.new()
    track.name = name
    track.strips.new(name, 1, act)
    arm.animation_data.action = None
    actions.append(name)


S = math.sin
TAU = 2 * math.pi
# braço direito segurando a cuia: fica quase parado em todas
CUIA = {'braco.R': [(X, 0)], 'antebraco.R': [(X, 0)]}


def parado(u, f):
    b = S(u * TAU)
    return ({'peito': [(X, -1.5 * b)], 'cabeca': [(X, 1.2 * S(u * TAU + 1)), (Z, 2 * S(u * TAU * 0.5))],
             'braco.L': [(X, 2 * b)], 'braco.R': [(X, -1 * b)]}, 0.004 * b)


def andar(u, f):
    a = S(u * TAU)
    k1 = max(0, S(u * TAU + math.pi / 2))  # joelho dobra na passagem
    k2 = max(0, S(u * TAU + math.pi * 1.5))
    return ({
        'coxa.L': [(X, -24 * a)], 'coxa.R': [(X, 24 * a)],
        'canela.L': [(X, 35 * k1)], 'canela.R': [(X, 35 * k2)],
        'pe.L': [(X, -10 * k1)], 'pe.R': [(X, -10 * k2)],
        'braco.L': [(X, 18 * a)], 'antebraco.L': [(X, -12 - 6 * a)],
        'braco.R': [(X, -4 * a)],
        'quadril': [(Z, 4 * a)], 'peito': [(Z, -6 * a), (X, 3)],
        'cabeca': [(Z, 3 * a)],
    }, 0.025 * abs(S(u * TAU)) - 0.02)


def acenar(u, f):
    up = min(1, u / 0.18) if u < 0.82 else max(0, (1 - u) / 0.18)
    e = up * up * (3 - 2 * up)
    w = S(u * TAU * 4) * e
    return ({
        'ombro.L': [(Yax, -12 * e)],
        'braco.L': [(Yax, -125 * e), (X, -15 * e)],
        'antebraco.L': [(Yax, -45 * e + 22 * w)],
        'mao.L': [(Yax, 10 * w)],
        'peito': [(Yax, 3 * e)], 'cabeca': [(Yax, -4 * e), (X, -3 * e)],
    }, 0)


def pular(u, f):
    # agacha (0-0.25), sobe (0.25-0.6), aterrissa (0.6-1)
    if u < 0.25:
        c = S(u / 0.25 * math.pi / 2); hz = -0.05 * c; air = 0
    elif u < 0.75:
        v = (u - 0.25) / 0.5; c = max(0, 1 - v * 3); hz = 0.22 * S(v * math.pi) - 0.05 * c; air = S(v * math.pi)
    else:
        v = (u - 0.75) / 0.25; c = S(v * math.pi); hz = -0.04 * c; air = 0
    return ({
        'coxa.L': [(X, -30 * c - 15 * air)], 'coxa.R': [(X, -30 * c - 15 * air)],
        'canela.L': [(X, 50 * c + 25 * air)], 'canela.R': [(X, 50 * c + 25 * air)],
        'pe.L': [(X, -20 * c)], 'pe.R': [(X, -20 * c)],
        'coluna': [(X, 12 * c)],
        'braco.L': [(Yax, -35 * air), (X, 10 * c)],
    }, hz)


def falar(u, f):
    g = S(u * TAU * 2)
    return ({
        'braco.L': [(X, -25 - 8 * g), (Yax, -10)], 'antebraco.L': [(X, -55 - 20 * g), (Z, 15 * S(u * TAU))],
        'mao.L': [(Z, 20 * g)],
        'cabeca': [(X, 5 * S(u * TAU * 3)), (Z, 6 * S(u * TAU))],
        'peito': [(Z, 4 * S(u * TAU)), (X, -2)],
        'braco.R': [(X, -3 * g)],
    }, 0.004 * S(u * TAU * 2))


def bah(u, f):
    a = min(1, u / 0.15)
    e = a * a * (3 - 2 * a)
    back = e * (1 - max(0, (u - 0.7) / 0.3))
    return ({
        'coluna': [(X, -6 * back)], 'peito': [(X, -10 * back)],
        'cabeca': [(X, -14 * back)],
        'braco.L': [(Yax, -55 * back), (X, -20 * back)], 'antebraco.L': [(X, -40 * back)],
        'braco.R': [(Yax, 12 * back)],
        'coxa.L': [(X, -6 * back)], 'coxa.R': [(X, -6 * back)], 'canela.L': [(X, 10 * back)], 'canela.R': [(X, 10 * back)],
    }, 0.05 * S(min(1, u / 0.35) * math.pi))


def mate(u, f):
    # leva a cuia até a boca, toma, baixa
    a = min(1, u / 0.25) if u < 0.75 else max(0, (1 - u) / 0.25)
    e = a * a * (3 - 2 * a)
    return ({
        'braco.R': [(X, -12 * e), (Yax, 6 * e)], 'antebraco.R': [(X, -38 * e), (Z, 22 * e)],
        'mao.R': [(Z, -20 * e), (X, 18 * e)],
        'cabeca': [(X, -8 * e), (Z, -6 * e)],
    }, 0)


make_action('parado', 60, parado, 2)
make_action('andar', 32, andar, 1)
make_action('acenar', 72, acenar, 1)
make_action('pular', 24, pular, 1)
make_action('falar', 60, falar, 2)
make_action('bah', 30, bah, 1)
make_action('mate', 72, mate, 2)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_animations=True,
                          export_animation_mode='NLA_TRACKS', export_skins=True, export_apply=False)
print('OK', dst, actions)
