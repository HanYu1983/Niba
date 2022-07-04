package webgl;

import webgl.WebglEngine;

class WebglGeometry {
	public var meshId:Null<DEFAULT_MESH>;
	public var materialId:Null<String>;

	

	public var uniform:Map<String, Dynamic> = [];

	public function new(meshId:DEFAULT_MESH) {
		this.meshId = meshId;
	}
}
