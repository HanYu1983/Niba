package webgl.meshs;

@:nullSafety
class Rectangle2dMesh extends WebglMesh {
	public function new(numInstances = 0) {
		super(numInstances);
	}

	override function getPosition():Array<Float> {
		return [
			  0,   0,
			100,   0,
			  0, 100,
			  0, 100,
			100,   0,
			100, 100,
		].map((i) -> {
			i + 0.0;
		});
	}

	override function getTexcoord():Array<Float> {
		return [
			0, 0,
			1, 0,
			0, 1,
			0, 1,
			1, 0,
			1, 1,
		];
	}

	override function is2d():Bool {
		return true;
	}
}
