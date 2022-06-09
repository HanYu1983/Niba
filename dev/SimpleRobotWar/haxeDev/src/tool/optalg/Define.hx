package tool.optalg;

import haxe.Exception;
import haxe.ds.ObjectMap;

using StringTools;

interface ISolution {
	function getId():Dynamic;
	function getParentId():Null<Dynamic>;
	function getSortKey():String;
	function getSortScore():Int;
	function isGoal():Bool;
	function getNextSolution():Array<ISolution>;
}

abstract class DefaultSolution implements ISolution {
	public final id:Dynamic;
	public final parentId:Null<Dynamic>;
	public final cost:Int;
	public final estimate:Int;

	private final _isGoal:Bool;

	final key:String;

	public function new(id:Dynamic, parentId:Null<Dynamic>, cost:Int, estimate:Int, isGoal:Bool) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this._isGoal = isGoal;
		key = '${getSortScore()}'.lpad("0", 20) + "_" + id;
	}

	public function getId():Dynamic {
		return id;
	}

	public function getParentId():Null<Dynamic> {
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
}

function getPath(tree:ObjectMap<Dynamic, ISolution>, goal:Dynamic):Array<Dynamic> {
	final ret:Array<Dynamic> = [goal];
	var curr:Null<ISolution> = tree.get(goal);
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
