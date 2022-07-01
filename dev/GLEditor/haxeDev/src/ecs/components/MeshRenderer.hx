package ecs.components;

import webgl.WebglEngine;
import webgl.WebglGeometry;
import webgl.WebglMesh;
import webgl.WebglMaterial;

@:nullSafety
class MeshRenderer extends Component {
	public final geometry:Null<WebglGeometry>;
	public var meshId(default, set):DEFAULT_MESH = DEFAULT_MESH.CUBE3D;

	function set_meshId(id:DEFAULT_MESH) {
		if (geometry != null) {
			geometry.meshId = id;
		}
		return id;
	}

	public var materialId(default, set):String = 'noiseMaterial';

	function set_materialId(id:String) {
		if (geometry != null) {
			WebglEngine.inst.changeMaterial(name, id);
		}
		return id;
	}

	public function new(name:String) {
		super(name);

		geometry = WebglEngine.inst.createGeometry(name, meshId, materialId);
	}
}
