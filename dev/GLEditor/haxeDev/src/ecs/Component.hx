package ecs;

@:nullSafety
class Component {
	public var name:String;
    public var owner:Null<Component>;

	public function new(name:String) {
		this.name = name;
	}

	public function update(deltaTime:Float) {}
}
