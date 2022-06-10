package tool.optalg;

import haxe.Exception;
import haxe.ds.EnumValueMap;

using StringTools;

interface ISolution<T:EnumValue> {
	function getId():T;
	function getParentId():Null<T>;
	function getSortKey():String;
	function getSortScore():Int;
	function isGoal():Bool;
	function getNextSolution():Array<ISolution<T>>;
}

class DefaultSolution<T:EnumValue> implements ISolution<T> {
	public final id:T;
	public final parentId:Null<T>;
	public final cost:Int;
	public final estimate:Int;

	private final _isGoal:Bool;

	final key:String;

	public function new(id:T, parentId:Null<T>, cost:Int, estimate:Int, isGoal:Bool) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this._isGoal = isGoal;
		key = '${getSortScore()}'.lpad("0", 20) + "_" + id;
	}

	public function getId():T {
		return id;
	}

	public function getParentId():Null<T> {
		return parentId;
	}

	public function getSortKey():String {
		return key;
	}

	public function getSortScore():Int {
		return cost + estimate;
	}

	public function isGoal():Bool {
		return _isGoal;
	}

	public function getNextSolution():Array<ISolution<T>> {
		return [];
	}
}

function getPath<T:EnumValue>(tree:EnumValueMap<T, ISolution<T>>, goal:T):Array<T> {
	final ret:Array<T> = [goal];
	var curr:Null<ISolution<T>> = tree.get(goal);
	if (curr == null) {
		throw new Exception("goal not found");
	}
	while (true) {
		final parentId = curr.getParentId();
		if (parentId == null) {
			break;
		}
		curr = tree.get(parentId);
		if (curr == null) {
			throw new Exception("goal not found");
		}
		ret.push(curr.getId());
	}
	ret.reverse();
	return ret;
}
