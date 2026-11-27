"""
Reduz um .glb pesado (ex.: Tripo, ~5 milhões de triângulos) para um número alvo de triângulos,
mantendo UV e textura.

Uso: python3 tools/reduzir_glb.py entrada.glb saida.glb [alvo_triangulos=100000]
"""
import sys
import bpy

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
src, dst = args[0], args[1]
alvo = int(args[2]) if len(args) > 2 else 100000

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
total = 0
for o in meshes:
    o.data.calc_loop_triangles()
    total += len(o.data.loop_triangles)
print('triângulos antes:', total)
ratio = min(1.0, alvo / max(total, 1))
for o in meshes:
    bpy.context.view_layer.objects.active = o
    m = o.modifiers.new('reduzir', 'DECIMATE')
    m.decimate_type = 'COLLAPSE'
    m.ratio = ratio
    m.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=m.name)
depois = 0
for o in meshes:
    o.data.calc_loop_triangles()
    depois += len(o.data.loop_triangles)
    for p in o.data.polygons:
        p.use_smooth = True
print('triângulos depois:', depois)
bpy.ops.export_scene.gltf(filepath=dst, export_format='GLB', export_image_format='JPEG', export_jpeg_quality=92)
print('OK', dst)
