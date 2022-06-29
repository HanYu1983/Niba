package webgl.meshs;

@:nullSafety
class Rectangle2dMesh extends WebglMesh {
	public function new() {
		super();
	}

	override function getPosition():Array<Float> {
		return [
			  0,   0,
			100,   0,
			  0, 100,
			  0, 100,
			100,   0,
			100, 100,
		].map((i) -> {i + 0.0;});
	}

	override function is2d():Bool {
		return true;
	}
}
