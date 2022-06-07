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
	function isGoal():Bool;
}

function getAStar(getNextSolution:ISolution->Array<ISolution>, isContinueWhenFind:Bool, s:ISolution):ObjectMap<Dynamic, ISolution> {
	final close = new ObjectMap<Dynamic, ISolution>();
	final open = new BalancedTree<String, ISolution>();
	final openMapping = new ObjectMap<Dynamic, ISolution>();
	open.set(s.getSortKey(), s);
	openMapping.set(s.getId(), s);
	var isDone = false;
	for (i in 0...100) {
		trace(i);
		if (isDone) {
			break;
		}
		var hasProcess = false;
		for (top in open.iterator()) {
			open.remove(top.getSortKey());
			openMapping.remove(top.getId());
			close.set(top.getId(), top);
			if (isContinueWhenFind == false) {
				if (top.isGoal()) {
					isDone = true;
					break;
				}
			}
			final nextNodes = getNextSolution(top);
			for (nextNode in nextNodes) {
				if (close.exists(nextNode.getId())) {
					trace("XX");
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
		// 樹為空就退出
		if (hasProcess == false) {
			break;
		}
	}
	return close;
}

function getPath(tree:ObjectMap<Dynamic, ISolution>, isGoal:ISolution->Bool):Array<Dynamic> {
	final ret:Array<Dynamic> = [];
	for (solution in tree.iterator()) {
		if (solution.isGoal() || isGoal(solution)) {
			ret.push(solution.getId());
			var curr:Null<ISolution> = solution;
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
			break;
		}
	}
	ret.reverse();
	return ret;
}

class AStarSolution implements ISolution {
	public final id:Dynamic;
	public final parentId:Null<Dynamic>;
	public final cost:Int;
	public final estimate:Int;
	public final _isGoal:Bool;

	final key:String;

	public function new(id:Dynamic, parentId:Null<Dynamic>, cost:Int, estimate:Int, isGoal:Bool) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this._isGoal = isGoal;
		key = Std.string(cost + estimate).lpad("0", 5) + "_" + id;
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

	public function isGoal():Bool {
		return _isGoal;
	}
}

function test() {
	final firstNode = new AStarSolution([0, 0], null, 0, 9999999, false);
	final end = [20, 20];
	final tree = getAStar(node -> {
		final tmp = cast(node, AStarSolution);
		if (tmp.cost >= 100) {
			return [];
		}
		return switch tmp.id {
			case [x, y]:
				[
					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
						switch next {
							case [ox, oy]:
								final nx = x + ox;
								final ny = y + oy;
								final cost = tmp.cost + 1;
								final ex = 10;
								final ey = 10;
								final estimate = Std.int(Math.pow(ex - nx, 2) + Math.pow(ey - ny, 2));
								final isGoal = nx == ex && ny == ey;
								// trace(nx, ny, isGoal);
								new AStarSolution([nx, ny], tmp.getId(), cost, estimate, isGoal);
							case _:
								throw new Exception("next not found");
						}
					}
				];
			case _:
				throw new Exception("payload not found");
		}
	}, false, firstNode);
	trace(tree);
	final path = getPath(tree, solution -> {
		return switch solution.getId() {
			case [x, y] if (x == 2 && y == 3):
				true;
			case _:
				false;
		}
	});
	trace(path);
}
