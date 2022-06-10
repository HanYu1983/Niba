package han.alg;

import haxe.Exception;
import common.IData;
import han.alg.IDefine;
import han.model.IDefine;
import tool.optalg.Define;
import tool.optalg.AStar;

// private class PathSolution extends DefaultSolution<Position> {
// 	final _ctx:Context;
// 	final _targetPos:Position;
// 	public function new(id:Position, parentId:Null<Position>, cost:Int, estimate:Int, isGoal:Bool, ctx:Context, targetPos:Position) {
// 		super(id, parentId, cost, estimate, isGoal);
// 		_ctx = ctx;
// 		_targetPos = targetPos;
// 	}
// 	public function getNextSolution():Array<ISolution<Position>> {
// 		return switch [getId(), _targetPos] {
// 			case [Position.POS2(x, y), Position.POS2(ex, ey)]:
// 				final fixDot = 10.0;
// 				[
// 					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
// 						switch next {
// 							case [ox, oy]:
// 								final nx = x + ox;
// 								final ny = y + oy;
// 								// 本身COST只是拿來和其和COST比較, 這個值要盡量小, 有比較的意義就可以了
// 								// 不然, ASTAR要多找指數上升的NODE
// 								final cost = Std.int(((this.cost / fixDot) + 0.1) * fixDot);
// 								// 這個值要比COST的比重還大, 因為最短徑看的就是離終點的距離
// 								final estimate = Std.int(Math.sqrt(Math.pow(ex - nx, 2) + Math.pow(ey - ny, 2)) * fixDot);
// 								final isGoal = nx == ex && ny == ey;
// 								new PathSolution(POS2(nx, ny), getId(), cost, estimate, isGoal, _ctx, _targetPos);
// 							case _:
// 								throw new Exception("next not found");
// 						}
// 					}
// 				];
// 			case _:
// 				throw new Exception("payload not found");
// 		}
// 	}
// }

function test() {
	testPath();
}

private function testPath() {
	final ctx = getDefaultContext();
	ctx.grids = getRandomMap(10, 10);

	// final firstSolution = new PathSolution(POS2(0, 0), null, 0, 9999999, false, ctx, POS(10, 10));
	// final tree = getAStar(firstSolution, {exitWhenFind: true});
	// trace(tree);
	// final path = getPath(tree, POS2(10, 10));
	// trace(path.length);
}
