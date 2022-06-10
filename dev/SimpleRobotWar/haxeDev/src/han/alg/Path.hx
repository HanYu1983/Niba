package han.alg;

import haxe.Serializer;
import haxe.Unserializer;
import haxe.Exception;
import common.IData;
import han.alg.IDefine;
import han.model.IDefine;
import tool.optalg.Define;
import tool.optalg.AStar;

private class PathSolution extends DefaultSolution<Position> {
	final _ctx:Context;
	final _targetPos:Position;

	public function new(id:Position, parentId:Null<Position>, cost:Int, estimate:Int, isGoal:Bool, ctx:Context, targetPos:Position) {
		super(id, parentId, cost, estimate, isGoal);
		_ctx = ctx;
		_targetPos = targetPos;
	}

	override function getNextSolution():Array<ISolution<Position>> {
		return switch [getId(), _targetPos] {
			case [Position.POS(x, y), Position.POS(ex, ey)]:
				final fixDot = 10.0;
				[
					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
						switch next {
							case [ox, oy]:
								final nx = x + ox;
								final ny = y + oy;
								final remainX:Int = Std.int(Math.abs(ex - nx));
								final remainY:Int = Std.int(Math.abs(ey - ny));
								final isGoal = nx == ex && ny == ey;
								final cost = this.cost + 1;
								final estimate = (remainX + remainY) << 1;
								new PathSolution(POS(nx, ny), getId(), cost, estimate, isGoal, _ctx, _targetPos);
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
	testPath();
}

private function testPath() {
	final _ctx = getDefaultContext();
	_ctx.grids = getRandomMap(10, 10);
	final s = Serializer.run(_ctx);
	final ctx = Unserializer.run(s);
	final firstSolution = new PathSolution(POS(0, 0), null, 0, 9999999, false, ctx, POS(10, 10));
	final tree = getAStar(firstSolution, {exitWhenFind: true});
	final path = getPath(tree, POS(10, 10));
	trace(path.length);
}
