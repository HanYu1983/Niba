package tool;

import haxe.Exception;
import haxe.ds.List;
import haxe.ds.ListSort;
import haxe.ds.StringMap;
import haxe.ds.BalancedTree;
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

function getAStar(s:ISolution, isContinueWhenFind:Bool):ObjectMap<Dynamic, ISolution> {
	// ObjectMap的key是認物件地址
	final close = new ObjectMap<Dynamic, ISolution>();
	final open = new BalancedTree<String, ISolution>();
	final openMapping = new ObjectMap<Dynamic, ISolution>();
	open.set(s.getSortKey(), s);
	openMapping.set(s.getId(), s);
	var i = 0;
	while (true) {
		if (++i > 20000) {
			trace("loop done");
			break;
		}
		var hasProcess = false;
		for (top in open.iterator()) {
			// trace(i, top.getId());
			open.remove(top.getSortKey());
			openMapping.remove(top.getId());
			close.set(top.getId(), top);
			if (isContinueWhenFind == false) {
				if (top.isGoal()) {
					trace("Goal!");
					break;
				}
			}
			final nextNodes = top.getNextSolution();
			for (nextNode in nextNodes) {
				if (close.exists(nextNode.getId())) {
					// trace("ignore", nextNode.getId());
					continue;
				}
				final origin = openMapping.get(nextNode.getId());
				if (origin == null) {
					open.set(nextNode.getSortKey(), nextNode);
					openMapping.set(nextNode.getId(), nextNode);
				} else {
					if (nextNode.getSortKey() < origin.getSortKey()) {
						open.remove(origin.getSortKey());
						open.set(nextNode.getSortKey(), nextNode);
						openMapping.set(nextNode.getId(), nextNode);
					}
				}
			}
			hasProcess = true;
			break;
		}
		if (hasProcess == false) {
			trace("hasProcess == false");
			break;
		}
	}
	trace(i);
	return close;
}

function getHillClimbing(s:ISolution, isContinueWhenFind:Bool):ObjectMap<Dynamic, ISolution> {
	// ObjectMap的key是認物件地址
	final close = new ObjectMap<Dynamic, ISolution>();
	var top = s;
	var i = 0;
	while (true) {
		if (++i > 20000) {
			trace("loop done");
			break;
		}
		close.set(top.getId(), top);
		if (isContinueWhenFind == false) {
			if (top.isGoal()) {
				trace("Goal!");
				break;
			}
		}
		var hasProcess = false;
		final nextNodes = top.getNextSolution();
		// 選出最低的
		for (nextNode in nextNodes) {
			if (close.exists(nextNode.getId())) {
				continue;
			}
			if (nextNode.getSortKey() < top.getSortKey()) {
				hasProcess = true;
				top = nextNode;
			}
		}
		if (hasProcess == false) {
			trace("hasProcess == false");
			break;
		}
	}
	trace(i);
	return close;
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
