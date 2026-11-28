"""
Esqueleto e animações do Cusco (modelo do Tripo).

Uso (dentro de remotion/):
    python3 tools/cusco3d.py public/3d/tripo/cusco_tripo.glb public/3d/tripo/cusco_anim.glb

Ossos em tools/spec3d/personagens.json ("cusco"). Frente do cachorro para -Y.
Ações: parado (respira e abana o rabo), trote, latir.
"""
import sys, math, json
import bpy
import numpy as np
from mathutils import Vector, Quaternion

src, dst = sys.argv[-2], sys.argv[-1]
cfg = json.load(open('tools/spec3d/personagens.json'))['cusco']
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.fps = 30
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
body.name = 'cusco'

arm_data = bpy.data.armatures.new('Esqueleto_cusco')
arm = bpy.data.objects.new('Esqueleto_cusco', arm_data)
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
bpy.ops.object.mode_set(mode='OBJECT')
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
arm.select_set(True)
bpy.context.view_layer.objects.active = arm
bpy.ops.object.parent_set(type='ARMATURE_NAME')

co = np.zeros(len(body.data.vertices) * 3); body.data.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
vg = [g.name for g in body.vertex_groups]
RAD = {'quadril': 0.12, 'torax': 0.12, 'pescoco': 0.07, 'cabeca': 0.09, 'rabo1': 0.035, 'rabo2': 0.035,
       'ombro': 0.045, 'pata': 0.035, 'coxa': 0.055, 'canela': 0.035}
D = np.full((len(co), len(vg)), 9.0)
for name, h, t, _ in cfg['ossos']:
    h, t = np.array(h), np.array(t)
    sg = t - h; L2 = sg @ sg
    tt = np.clip(((co - h) @ sg) / L2, 0, 1)
    d = np.linalg.norm(co - (h + tt[:, None] * sg), axis=1)
    D[:, vg.index(name)] = d / RAD[name.split('.')[0]] * 0.04
for n in vg:
    if n.endswith(('.L', '.R')):
        D[np.sign(co[:, 0]) == (-1 if n.endswith('.L') else 1), vg.index(n)] = 9
    if n.startswith(('ombro', 'pata', 'coxa', 'canela')):
        D[co[:, 2] > 0.36, vg.index(n)] = 9  # pernas só abaixo da barriga
    if n.startswith('rabo'):
        D[(co[:, 1] < 0.31) | (co[:, 2] < 0.44), vg.index(n)] = 9
for n in ('cabeca', 'pescoco'):
    D[co[:, 1] > -0.05, vg.index(n)] = 9
W = 1.0 / (D + 0.004) ** 4
np.put_along_axis(W, np.argsort(-W, axis=1)[:, 3:], 0, axis=1)
head = (co[:, 1] < -0.17) & (co[:, 2] > 0.6)  # cabeça e orelhas inteiras na cabeça
W[head] = 0; W[head, vg.index('cabeca')] = 1
W /= np.maximum(W.sum(1, keepdims=True), 1e-9)
for gi, gname in enumerate(vg):
    nz = np.nonzero(W[:, gi] > 1e-3)[0]
    q = np.round(W[nz, gi], 2)
    for wv in np.unique(q):
        body.vertex_groups[gname].add(nz[q == wv].tolist(), float(wv), 'REPLACE')
print('vértices', len(co))

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
    return ({'torax': [(X, 1.2 * b)], 'cabeca': [(X, 2 * S(u * TAU + 1)), (Yax, 3 * S(u * TAU * 0.5))],
             'rabo1': [(Z, 14 * S(u * TAU * 2))], 'rabo2': [(Z, 10 * S(u * TAU * 2 - 0.6))]}, 0.003 * b)


def trote(u):
    a = S(u * TAU)
    up1 = max(0, S(u * TAU + math.pi / 2)); up2 = max(0, S(u * TAU - math.pi / 2))
    # pares diagonais: dianteira esquerda + traseira direita, e o contrário
    return ({'ombro.L': [(X, 26 * a)], 'pata.L': [(X, 38 * up1)],
             'coxa.R': [(X, 24 * a)], 'canela.R': [(X, -30 * up1)],
             'ombro.R': [(X, -26 * a)], 'pata.R': [(X, 38 * up2)],
             'coxa.L': [(X, -24 * a)], 'canela.L': [(X, -30 * up2)],
             'torax': [(X, 2 * S(u * TAU * 2))], 'cabeca': [(X, 4 * S(u * TAU * 2 + 0.5))],
             'rabo1': [(Z, 20 * S(u * TAU * 2))], 'rabo2': [(Z, 14 * S(u * TAU * 2 - 0.7))]},
            0.012 * abs(S(u * TAU)))


def latir(u):
    k = 0.5 + 0.5 * S(u * TAU * 2 - math.pi / 2)  # dois latidos no ciclo
    return ({'pescoco': [(X, -10 * k)], 'cabeca': [(X, -14 * k)], 'torax': [(X, -4 * k)],
             'ombro.L': [(X, -6 * k)], 'ombro.R': [(X, -6 * k)],
             'rabo1': [(Z, 26 * S(u * TAU * 4))], 'rabo2': [(Z, 18 * S(u * TAU * 4 - 0.7))]}, 0.01 * k)


make_action('parado', 60, parado, 2)
make_action('trote', 16, trote)
make_action('latir', 20, latir)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                          export_skins=True, export_apply=False, export_image_format='JPEG', export_jpeg_quality=92)
print('OK', dst)
