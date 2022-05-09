package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.Mock;
import model.ver2.alg.Alg;

using Lambda;

function _getUnEquipResult(ctx:Context, p1:model.PeopleGenerator.People,
		unequipId:Int):{peopleBefore:model.PeopleGenerator.People, peopleAfter:model.PeopleGenerator.People} {
	return {
		peopleAfter: {
			final copyCtx = deepCopy(ctx);
			_takeUnEquip(copyCtx, p1, unequipId);
			final peopleAfter = getPeopleInfo(copyCtx, getPeopleById(copyCtx, p1.id));
			peopleAfter;
		},
		peopleBefore: p1,
	};
}

function _getEquipResult(ctx:Context, p1:model.PeopleGenerator.People,
		equipId:Int):{peopleBefore:model.PeopleGenerator.People, peopleAfter:model.PeopleGenerator.People} {
	return {
		peopleAfter: {
			final copyCtx = deepCopy(ctx);
			_takeEquip(copyCtx, p1, equipId);
			final peopleAfter = getPeopleInfo(copyCtx, getPeopleById(copyCtx, p1.id));
			peopleAfter;
		},
		peopleBefore: p1,
	};
}

function _takeEquip(ctx:Context, people1:model.PeopleGenerator.People, equipId:Int) {
	ctx.events = [];
	final t = getTreasureById(ctx, equipId);
	final p1 = getPeopleById(ctx, people1.id);
	if (t.belongToPlayerId != null && t.belongToPlayerId != p1.belongToPlayerId) {
		trace('寶物(${t.id})是玩家${t.belongToPlayerId}不是你的');
		return;
	}
	if (t.position.peopleId != null) {
		trace('不能拆除');
		return;
	}
	t.position.peopleId = p1.id;
}

function _takeUnEquip(ctx:Context, people1:model.PeopleGenerator.People, unequipId:Int) {
	ctx.events = [];
	final t = getTreasureById(ctx, unequipId);
	final p1 = getPeopleById(ctx, people1.id);
	if (p1.belongToPlayerId == null) {
		throw new haxe.Exception("belongToPlayerId not found");
	}
	final player = ctx.players[p1.belongToPlayerId];
	if (t.belongToPlayerId != null && t.belongToPlayerId != p1.belongToPlayerId) {
		trace('寶物(${t.id})是玩家${t.belongToPlayerId}不是你的');
		return;
	}
	t.position.peopleId = null;
	// 扣體(忠誠)
	p1.energy /= 2.0;
	// 用掉裝備次數
	player.memory.hasEquip = true;
}
