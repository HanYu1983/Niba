package tool;

import haxe.Exception;
import haxe.ds.List;
import haxe.ds.ListSort;
import haxe.ds.StringMap;
import haxe.ds.BalancedTree;

using StringTools;

interface ISolution {
	function getId():String;
	function getSortKey():String;
	function isGoal():Bool;
}

function getAStar(getNextSolution:ISolution->Array<ISolution>, isContinueWhenFind:Bool, s:ISolution):StringMap<ISolution> {
	final close = new StringMap<ISolution>();
	// final open = new Array<ISolution>();
	final open = new BalancedTree<String, ISolution>();
	final openMapping = new StringMap<ISolution>();
	open.set(s.getSortKey(), s);
	// open.push(s);
	openMapping.set(s.getId(), s);
	var isDone = false;
	for (i in 0...1000) {
		if (isDone) {
			break;
		}
		// open.sort((a, b) -> {
		// 	return a.compare(b);
		// });
		// trace(i, open);
		// final top = open.pop();
		// if (top == null) {
		// 	break;
		// }
		// final nextNodes = getNextSolution(top);
		// for (nextNode in nextNodes) {
		// 	if (close.exists(nextNode.getId())) {
		// 		continue;
		// 	}
		// 	final origin = openMapping.get(nextNode.getId());
		// 	if (origin == null) {
		// 		open.push(nextNode);
		// 		openMapping.set(nextNode.getId(), nextNode);
		// 	} else {
		// 		if (nextNode.compare(origin) > 0) {
		// 			open.remove(origin);
		// 			open.push(nextNode);
		// 			openMapping.set(nextNode.getId(), nextNode);
		// 		}
		// 	}
		// }
		// open.remove(top);
		// openMapping.remove(top.getId());
		// close.set(top.getId(), top);
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
					continue;
				}
				if (isContinueWhenFind == false) {
					if (nextNode.isGoal()) {
						break;
					}
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
			break;
		}
	}
	return close;
}

class AStarSolution implements ISolution {
	public final id:String;
	public final parentId:Null<String>;
	public final cost:Int;
	public final estimate:Int;
	public final _isGoal:Bool;
	public final payload:Dynamic;

	final key:String;

	public function new(id:String, parentId:Null<String>, cost:Int, estimate:Int, isGoal:Bool, payload:Dynamic) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this._isGoal = isGoal;
		this.payload = payload;
		key = Std.string(cost + estimate).lpad("0", 5) + "_" + id;
	}

	public function getId():String {
		return id;
	}

	public function getSortKey():String {
		return key;
	}

	public function isGoal():Bool {
		return _isGoal;
	}
}

function test() {
	final firstNode = new AStarSolution("0_0", null, 0, 9999999, false, [0, 0]);
	final tree = getAStar(node -> {
		final tmp = cast(node, AStarSolution);
		if (tmp.cost >= 2) {
			return [];
		}
		return switch tmp.payload {
			case [x, y]:
				[
					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
						switch next {
							case [ox, oy]:
								final nx = x + ox;
								final ny = y + oy;
								final cost = tmp.cost + 1;
								final ex = 1;
								final ey = 1;
								final estimate = Std.int(Math.pow(ex - nx, 2) + Math.pow(ey - ny, 2));
								final isGoal = nx == ex && ny == ey;
								new AStarSolution('${nx}_${ny}', tmp.getId(), cost, estimate, isGoal, [nx, ny]);
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
}
