package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

function _getStrategyRate(ctx:Context, p1People:model.PeopleGenerator.People, strategy:Strategy, targetPlayerId:Int, targetPeopleId:Int,
		targetGridId:Int):{energyBefore:Int, energyAfter:Int, rate:Float} {
	return {
		energyAfter: 10,
		energyBefore: 5,
		rate: Math.random(),
	}
}

function _takeStrategy(ctx:Context, p1PeopleId:Int, strategyId:Int, targetPlayerId:Int, targetPeopleId:Int, targetGridId:Int):Void {
	ctx.events = [
		Event.STRATEGY_RESULT({
			success: true,
			people: PeopleGenerator.getInst().generate(),
			strategy: StrategyList[0],
			energyBefore: 0,
			energyAfter: 1,
		}),
		WALK_STOP({
			grid: getGridInfo(ctx, ctx.grids[0])
		})
	];
}
