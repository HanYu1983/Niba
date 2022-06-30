package ecs;

@:nullSafety
class Component {
	public var name:String;

	public function new(name:String) {
		this.name = name;
	}

	public function update(deltaTime:Float) {}
}
