package han.alg;

import haxe.Serializer;
import haxe.Unserializer;
import haxe.Exception;
import haxe.Constraints;
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
	final _robotId:String;

	public function new(ctx:Context, id:Position, robotId:String, parentId:Null<Position> = null, cost:Int = 0, estimate:Int = 0, isGoal:Bool = false) {
		super(id, parentId, cost, estimate, isGoal);
		_ctx = ctx;
		_robotId = robotId;
	}

	override function getNextSolution():Array<ISolution<Position>> {
		return switch getId() {
			case POS(x, y):
				final ret:Array<ISolution<Position>> = [];
				final robot = getRobot(_ctx, _robotId);
				for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
					switch next {
						case [ox, oy]:
							final nx = x + ox;
							final ny = y + oy;
							if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H) {
								final nextPos = POS(nx, ny);
								final grid = getGrid(_ctx, nextPos);
								final moveCost = switch getGridMoveFactor(_ctx, nextPos) {
									case [sea, ground, forest, mountain]:
										switch robot.terrian {
											case [sea2, ground2, forest2, mountain2]:
												Std.int(4 * (sea * sea2 + ground * ground2 + forest * forest2 + mountain * mountain2));
											case _:
												throw new Exception("robot.terrian not found");
										}
									case _:
										throw new Exception("getGridMoveFactor not found");
								}
								final cost = this.cost + moveCost;
								if (cost < 40) {
									final nextSolution = new ShortestPathTreeSolution(_ctx, nextPos, _robotId, getId(), cost, 0, false);
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
private class RangeSolution extends DefaultSolution<Position> {
	final _range:Int;

	public function new(id:Position, range:Int, parentId:Null<Position> = null, cost:Int = 0, estimate:Int = 0, isGoal:Bool = false) {
		super(id, parentId, cost, estimate, isGoal);
		_range = range;
	}

	override function getNextSolution():Array<ISolution<Position>> {
		return switch getId() {
			case POS(x, y):
				final ret:Array<ISolution<Position>> = [];
				for (next in [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
					switch next {
						case [ox, oy]:
							final nx = x + ox;
							final ny = y + oy;
							final nextPos = POS(nx, ny);
							final cost = this.cost + 1;
							if (cost <= _range) {
								final nextSolution = new RangeSolution(nextPos, _range, getId(), cost, 0, false);
								ret.push(nextSolution);
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
function getRobotMoveRange(ctx:Context, robotId:String):IMap<Position, ISolution<Position>> {
	for (pos => findRobotId in ctx.positionToRobot) {
		if (findRobotId == robotId) {
			final robot = getRobot(ctx, robotId);
			final moveEnergy = 20;
			final tree = getAStar(new ShortestPathTreeSolution(ctx, pos, robotId), {exitWhenFind: true});
			return tree;
		}
	}
	throw new Exception('getRobotMoveRange 找不到robotId的位置:${robotId}');
}

function getAttackRange(center:Position, min:Int, max:Int):Array<Position> {
	final maxTree = getAStar(new RangeSolution(POS(0, 0), max), {exitWhenFind: true});
	maxTree.remove(POS(0,0));
	if (min > 1) {
		final minTree = getAStar(new RangeSolution(POS(0, 0), min-1), {exitWhenFind: true});
		for(pos => _ in minTree){
			maxTree.remove(pos);
		}
	}
	final posList = [
		for (pos => solution in maxTree) {
			final nx = switch [center, pos] {
				case [POS(cx, _), POS(x, _)]:
					cx + x;
				case _:
					throw new Exception("[center, pos] not found");
			}
			final ny = switch [center, pos] {
				case [POS(_, cy), POS(_, y)]:
					cy + y;
				case _:
					throw new Exception("[center, pos] not found");
			}
			if (nx >= 0 && ny >= 0 && nx < MAP_W && ny < MAP_H) {
				POS(nx, ny);
			}
		}
	];
	return posList;
}

function test() {
	//trace(getAttackRange(POS(5,5), 2, 4));
}
