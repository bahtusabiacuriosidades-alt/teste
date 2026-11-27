"""Exporta um modelo do Tripo (reduzido, sem esqueleto) em FBX com textura embutida, pronto para o Mixamo.
Uso: python3 tools/exportar_mixamo.py entrada.glb saida.fbx"""
import sys, bpy
src, dst = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
ms = [o for o in bpy.context.scene.objects if o.type == 'MESH']
for o in bpy.context.scene.objects: o.select_set(o in ms)
bpy.context.view_layer.objects.active = ms[0]
if len(ms) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active
bpy.ops.object.parent_clear(type='CLEAR_KEEP_TRANSFORM')
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
for o in list(bpy.context.scene.objects):
    if o.type != 'MESH': bpy.data.objects.remove(o)
ob.name = 'personagem'
# Mixamo trabalha melhor em tamanho de gente: 1 unidade -> ~1,75 m (crianças ~1,35 m)
alt = float(sys.argv[-3]) if len(sys.argv) > 3 and sys.argv[-3].replace('.', '', 1).isdigit() else 1.75
ob.scale = (alt, alt, alt); bpy.ops.object.transform_apply(scale=True)
for img in bpy.data.images: img.pack()
bpy.ops.export_scene.fbx(filepath=dst, use_selection=False, object_types={'MESH'}, path_mode='COPY',
                         embed_textures=True, apply_unit_scale=True, add_leaf_bones=False)
print('OK', dst)
