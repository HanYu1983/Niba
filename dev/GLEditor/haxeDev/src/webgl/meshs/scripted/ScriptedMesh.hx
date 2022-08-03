package webgl.meshs.scripted;

import mme.math.glmatrix.Vec3Tools;
import mme.math.glmatrix.Vec3;

@:abstract
class ScriptedMesh extends WebglMesh {
	final position = [];
	final indices = [];

	public function new(numInstances = 0) {
		generateMesh();
		super(numInstances);
	}

	@:abstract
	function generateMesh() {}

	override function getNormal():Array<Float> {
		final pos = [];
		for (id in indices) {
			final vert = position[id];
			final normal = Vec3Tools.normalize(vert);
			pos.push(normal.x);
			pos.push(normal.y);
			pos.push(normal.z);
		}
		return pos;
	}

	override function getPosition():Array<Float> {
		final pos = [];
		for (id in indices) {
			final vert = position[id];
			pos.push(vert.x);
			pos.push(vert.y);
			pos.push(vert.z);
		}
		return pos;
	}

	override function is2d():Bool {
		return false;
	}
}
