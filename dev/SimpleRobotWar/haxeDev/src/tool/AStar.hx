package tool;

import haxe.ds.List;
import haxe.ds.ListSort;
import haxe.ds.ObjectMap;
import haxe.ds.BalancedTree;

using StringTools;

class Solution {
	public final id:String;
	public final parentId:String;
	public final cost:Int;
	public final estimate:Int;
	public final payload:Any;

	public function new(id:String, parentId:String, cost:Int, estimate:Int, payload:Any) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this.payload = payload;
	}

	public function getScore():Int {
		return cost + estimate;
	}

	public function compare(other:Solution):Int {
		final key1 = Std.string(getScore()).lpad("0", 5) + "_" + id;
		final key2 = Std.string(other.getScore()).lpad("0", 5) + "_" + other.id;
		return Reflect.compare(key1, key2);
	}
}

function getAStar(getNextNode:Solution->Array<Solution>, s:Solution):ObjectMap<String, Solution> {
	final close = new ObjectMap<String, Solution>();
	final open = new BalancedTree<Solution, Solution>();
	final openMapping = new ObjectMap<String, Solution>();
	open.set(s, s);
	openMapping.set(s.id, s);
	for (i in 0...1000) {
		var hasProcess = false;
		for (top in open.iterator()) {
			final nextNodes = getNextNode(top);
			for (nextNode in nextNodes) {
				if (close.exists(nextNode.id)) {
					continue;
				}
				final origin = openMapping.get(nextNode.id);
				if (origin == null) {
					open.set(nextNode, nextNode);
					openMapping.set(nextNode.id, nextNode);
				} else {
					if (nextNode.getScore() < origin.getScore()) {
						open.remove(origin);
						open.set(nextNode, nextNode);
						openMapping.set(nextNode.id, nextNode);
					}
				}
			}
			open.remove(top);
			openMapping.remove(top.id);
			close.set(top.id, top);
			hasProcess = true;
			break;
		}
		if (hasProcess == false) {
			break;
		}
	}
	return close;
}
