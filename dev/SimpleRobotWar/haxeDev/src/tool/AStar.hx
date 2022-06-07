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

	final key:String;

	public function new(id:String, parentId:String, cost:Int, estimate:Int, payload:Any) {
		this.id = id;
		this.parentId = parentId;
		this.cost = cost;
		this.estimate = estimate;
		this.payload = payload;
		key = Std.string(getScore()).lpad("0", 5) + "_" + id;
	}

	public function getScore():Int {
		return cost + estimate;
	}

	public function compare(other:Solution):Int {
		// 只有自己和自己比才會回傳0
		// 回傳0才能表找到自己
		// https://github.com/HaxeFoundation/haxe/blob/4.2.1/std/haxe/ds/BalancedTree.hx
		// https://shubo.io/iterative-binary-tree-traversal/
		return Reflect.compare(this.key, other.key);
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
