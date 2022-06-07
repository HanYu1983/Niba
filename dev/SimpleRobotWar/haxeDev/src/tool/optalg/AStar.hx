package tool.optalg;

import haxe.Exception;
import haxe.ds.List;
import haxe.ds.ListSort;
import haxe.ds.StringMap;
import haxe.ds.BalancedTree;
import haxe.ds.ObjectMap;
import tool.optalg.Define;

using StringTools;

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
