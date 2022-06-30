package ecs;

import ecs.components.Transform;

using Lambda;

@:nullSafety
class Entity extends Component {
	final components:Array<Component> = [];

	public final transform:Transform;

	public function new(name:String) {
		super(name);

		transform = new Transform('${name}_tranform');
	}

	public function addComponent(component:Component) {
		if (components.has(component))
			return;
		components.push(component);
	}

	public function getComponent<T>(clz:Class<T>):Null<T> {
		var ret:Null<Dynamic> = null;
		for (value in components) {
			if (Std.isOfType(value, clz)) {
				ret = value;
				break;
			}
		}
		return ret;
	}

	override public function update(deltaTime:Float) {
		for (component in components) {
			component.update(deltaTime);
		}
	}
}
