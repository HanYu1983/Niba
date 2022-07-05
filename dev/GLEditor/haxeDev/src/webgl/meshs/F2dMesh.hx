package webgl.meshs;

@:nullSafety
class F2dMesh extends WebglMesh {
	public function new(numInstances = 0) {
		super(numInstances);
	}

    override function getPosition():Array<Int> {
        return [
            // left column
            0, 0,
            30, 0,
            0, 150,
            0, 150,
            30, 0,
            30, 150,
  
            // top rung
            30, 0,
            100, 0,
            30, 30,
            30, 30,
            100, 0,
            100, 30,
  
            // middle rung
            30, 60,
            67, 60,
            30, 90,
            30, 90,
            67, 60,
            67, 90,
        ];
    }

    override function is2d():Bool {
        return true;
    }
    
}
