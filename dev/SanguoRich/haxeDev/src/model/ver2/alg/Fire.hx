package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;

using Lambda;

function _getPreResultOfFire(ctx:Context, playerId:Int, p1PeopleId:Int):PreResultOnFire {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		if (p.id == p1PeopleId) {
			return a;
		}
		return a + p.cost;
	}, 0.0);
	return {
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

function _takeFire(ctx:Context, playerId:Int, p1PeopleId:Int) {
	final people = getPeopleById(ctx, p1PeopleId);
	final resultValue = {
		success: true,
		people: getPeopleInfo(ctx, people),
		maintainMoneyAfter: 0.0,
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
	people.belongToPlayerId = null;
	people.position.gridId = ctx.players[playerId].position;
	resultValue.maintainMoneyAfter = getMaintainPeople(ctx, playerId);
	ctx.events = [Event.FIRE_RESULT(resultValue)];
}
