package tool.optalg;

import haxe.Exception;
import haxe.ds.StringMap;
import tool.optalg.Define;
import tool.optalg.AStar;
import tool.optalg.HC;

// private final tmp = new StringMap<Array<Int>>();
// // ObjectMap的key是認物件地址
// private function getPosition(x:Int, y:Int):Array<Int> {
// 	final key = '${x}_${y}';
// 	if (tmp.exists(key)) {
// 		final ret = tmp.get(key);
// 		if (ret == null) {
// 			throw new Exception("must not null");
// 		}
// 		return ret;
// 	}
// 	final ret:Array<Int> = [x, y];
// 	tmp.set(key, ret);
// 	return ret;
// };

private enum Position {
	POS(x:Int, y:Int);
}

private class TestSolution extends DefaultSolution<Position> {
	public function new(id:Position, parentId:Null<Position>, cost:Int, estimate:Int, isGoal:Bool) {
		super(id, parentId, cost, estimate, isGoal);
	}

	override function getNextSolution():Array<ISolution<Position>> {
		return switch getId() {
			case POS(x, y):
				final fixDot = 10.0;
				[
					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
						switch next {
							case [ox, oy]:
								final nx = x + ox;
								final ny = y + oy;
								// 本身COST只是拿來和其和COST比較, 這個值要盡量小, 有比較的意義就可以了
								// 不然, ASTAR要多找指數上升的NODE
								final cost = Std.int(((this.cost / fixDot) + 0.1) * fixDot);
								final ex = 10;
								final ey = 10;
								// 這個值要比COST的比重還大, 因為最短徑看的就是離終點的距離
								final estimate = Std.int(Math.sqrt(Math.pow(ex - nx, 2) + Math.pow(ey - ny, 2)) * fixDot);
								final isGoal = nx == ex && ny == ey;
								new TestSolution(POS(nx, ny), getId(), cost, estimate, isGoal);
							case _:
								throw new Exception("next not found");
						}
					}
				];
			case _:
				throw new Exception("payload not found");
		}
	}
}

function test() {
	final firstSolution = new TestSolution(POS(0, 0), null, 0, 9999999, false);
	final tree = getAStar(firstSolution, {exitWhenFind: true});
	// trace(tree);
	final path = getPath(tree, POS(10, 10));
	trace(path);
}
