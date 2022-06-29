package webgl;

class WebglMaterial {
	public final geometrys:Array<String> = [];
	public var shaderId:Null<String> = null;

	public function new(shaderId:String) {
		this.shaderId = shaderId;
	}
}
