package webgl;

import webgl.WebglEngine;

class WebglGeometry {
	public var meshId:Null<DEFAULT_MESH>;
	public var materialId:Null<String>;

	// function set_materialId(id:String) {
	// 	final gl = WebglEngine.inst.gl;
	// 	if (gl == null)
	// 		return id;

	// 	final material = WebglEngine.inst.materials.get(id);
	// 	if (material == null)
	// 		return id;

	// 	final shader = WebglEngine.inst.shaders.get(material.shaderId);
	// 	if (shader == null)
	// 		return id;

	// 	final mesh = WebglEngine.inst.meshs.get(meshId);
	// 	if (mesh == null)
	// 		return id;

	// 	// mesh.shader = shader;

	// 	return id;
	// }

	public var uniform:Map<String, Dynamic> = [];

	public function new(meshId:DEFAULT_MESH) {
		this.meshId = meshId;
	}
}
