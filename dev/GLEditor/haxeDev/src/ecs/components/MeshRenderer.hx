package ecs.components;

import webgl.WebglEngine;
import webgl.WebglGeometry;
import webgl.WebglMesh;
import webgl.WebglMaterial;

@:nullSafety
class MeshRenderer extends Component {
	public final geometryId:String;
	public final meshId:String;
	public final materialId:String;

	public function new(name:String, meshId:String, materialId:String) {
		super(name);
		this.meshId = meshId;
		this.materialId = materialId;

		geometryId = 'geo_${name}';
		WebglEngine.inst.createGeometry(geometryId, meshId, materialId);
	}
}
