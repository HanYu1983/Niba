package tool;

interface IEntityContainer {
	function push(obj:Any):Void;
	function remove(obj:Any):Void;
}

class CompositeContainer implements IEntityContainer {
	final _list:Array<IEntityContainer> = [];

	public function addContainer(c:IEntityContainer) {
		_list.push(c);
	}

	public function push(obj:Any):Void {
		for (c in _list) {
			c.push(obj);
		}
	}

	public function remove(obj:Any):Void {
		for (c in _list) {
			c.remove(obj);
		}
	}
}

abstract class DefaultContainer<T> implements IEntityContainer {
	final _list:Array<T> = [];

	public function remove(obj:Any):Void {
		_list.remove(obj);
	}

	public function getList():Array<T> {
		return _list;
	}
}
