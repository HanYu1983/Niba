package han.alg;

import haxe.Serializer;
import haxe.Unserializer;
import haxe.Exception;
import common.IConfig;
import common.IDefine;
import common.TerrianData;
import han.alg.IDefine;
import han.model.IDefine;
import tool.optalg.Define;
import tool.optalg.AStar;

@:nullSafety
function getGridMoveFactor(ctx:Context, id:Position):Array<Float> {
	final grid = ctx.grids.get(id);
	if (grid == null) {
		throw new Exception('grid not found:${id}');
	}
	final terrian = getTerrianData(grid.terrianId);
	return terrian.moveFactor;
}

@:nullSafety
private class PathSolution extends DefaultSolution<Position> {
	final _ctx:Context;
	final _targetPos:Position;

	public function new(ctx:Context, id:Position, targetPos:Position, parentId:Null<Position> = null, cost:Int = 0, estimate:Int = 99999,
			isGoal:Bool = false) {
		super(id, parentId, cost, estimate, isGoal);
		_ctx = ctx;
		_targetPos = targetPos;
	}

	override function getNextSolution():Array<ISolution<Position>> {
		return switch [getId(), _targetPos] {
			case [Position.POS(x, y), Position.POS(ex, ey)]:
				[
					for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
						final nx = switch next {
							case [ox, _]:
								x + ox;
							case _:
								throw new Exception("next not found");
						};
						final ny = switch next {
							case [_, oy]:
								y + oy;
							case _:
								throw new Exception("next not found");
						};
						if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H) {
							final remainX:Int = Std.int(Math.abs(ex - nx));
							final remainY:Int = Std.int(Math.abs(ey - ny));
							final estimate = (remainX + remainY) << 3;
							final isGoal = nx == ex && ny == ey;
							final moveCost = switch getGridMoveFactor(_ctx, POS(nx, ny)) {
								case [sea, ground, forest, mountain]:
									Std.int(4 * sea);
								case _:
									throw new Exception("getGridMoveFactor not found");
							}
							final cost = this.cost + moveCost;
							new PathSolution(_ctx, POS(nx, ny), _targetPos, getId(), cost, estimate, isGoal);
						}
					}
				];
			case _:
				throw new Exception("payload not found");
		}
	}
}

@:nullSafety
private class ShortestPathTreeSolution extends DefaultSolution<Position> {
	final _ctx:Context;
	final _energy:Int;

	public function new(ctx:Context, id:Position, energy:Int, parentId:Null<Position> = null, cost:Int = 0, estimate:Int = 0, isGoal:Bool = false) {
		super(id, parentId, cost, estimate, isGoal);
		_ctx = ctx;
		_energy = energy;
	}

	override function getNextSolution():Array<ISolution<Position>> {
		return switch getId() {
			case Position.POS(x, y):
				final ret:Array<ISolution<Position>> = [];
				for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
					switch next {
						case [ox, oy]:
							final nx = x + ox;
							final ny = y + oy;
							if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H) {
								final moveCost = switch getGridMoveFactor(_ctx, POS(nx, ny)) {
									case [sea, ground, forest, mountain]:
										Std.int(4 * sea);
									case _:
										throw new Exception("getGridMoveFactor not found");
								}
								final cost = this.cost + moveCost;
								if (cost < _energy) {
									final nextSolution = new ShortestPathTreeSolution(_ctx, POS(nx, ny), _energy, getId(), cost, 0, false);
									ret.push(nextSolution);
								}
							}
						case _:
							throw new Exception("next not found");
					}
				}
				ret;
			case _:
				throw new Exception("payload not found");
		}
	}
}

@:nullSafety
function getRobotMoveRangeByPosition(ctx:Context, pos:Position):Array<Position> {
	final robotId = ctx.positionToRobot.get(pos);
	if (robotId == null) {
		return [];
	}
	final robot = getRobot(ctx, robotId);
	final moveEnergy = 20;
	final tree = getAStar(new ShortestPathTreeSolution(ctx, pos, moveEnergy), {exitWhenFind: true});
	return [
		for (pos => solution in tree) {
			pos;
		}
	];
}

function test() {
	testPath();
}

private function testPath() {
	final _ctx = getDefaultContext();
	_ctx.grids = getRandomMap(MAP_W, MAP_H);
	final robot = createRobot('${_ctx.idSeq++}');
	_ctx.robots.set(robot.id, robot);
	final s = Serializer.run(_ctx);
	final ctx = Unserializer.run(s);
	{
		final tree = getAStar(new PathSolution(ctx, POS(0, 0), POS(9, 9)), {exitWhenFind: true});
		// trace(tree);
		final path = getPath(tree, POS(9, 9));
		trace(path);
	}
	{
		final tree = getAStar(new ShortestPathTreeSolution(ctx, POS(4, 4), 20), {exitWhenFind: true});
		for (pos => solution in tree) {
			trace(pos, solution.getSortScore());
		}
	}
}
