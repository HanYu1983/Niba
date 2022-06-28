package webgl.meshs;

@:nullSafety
class Rectangle2dMesh extends WebglMesh {
	public function new() {
		super();
	}

	override function getPosition():Array<Int> {
		return [
			  0,   0,
			100,   0,
			  0, 100,
			  0, 100,
			100,   0,
			100, 100,
		];
	}

	override function is2d():Bool {
		return true;
	}
}
