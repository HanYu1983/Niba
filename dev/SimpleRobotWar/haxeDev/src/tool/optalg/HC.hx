package tool.optalg;

import haxe.Exception;
import haxe.ds.List;
import haxe.ds.ListSort;
import haxe.ds.StringMap;
import haxe.ds.BalancedTree;
import haxe.ds.ObjectMap;
import tool.optalg.Define;

using StringTools;

function getHillClimbing(s:ISolution, options:{exitWhenFind:Bool}):ObjectMap<Dynamic, ISolution> {
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
		if (options.exitWhenFind) {
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
