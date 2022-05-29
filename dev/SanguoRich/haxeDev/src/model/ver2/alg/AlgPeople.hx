package model.ver2.alg;

import tool.Debug;
import model.TreasureGenerator;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Brain;
import model.ver2.alg.AlgPlayer;

using Lambda;

function doPeopleMaintain(ctx:Context) {
	// 玩家
	for (player in ctx.players) {
		// 支付武將的薪水
		{
			final peopleCost = getMaintainPeople(ctx, player.id);
			final attachmentsCost = {
				final myAttachments = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == player.id);
				final levels = myAttachments.fold((c, a:Float) -> {
					return a + switch c.type {
						case TREASURE(level):
							level;
						case FISHING(level):
							level;
						case HUNTING(level):
							level;
						case MINE(level):
							level;
						case MARKET(level):
							level;
						case FARM(level):
							level;
						case HOME(level):
							level;
						case BARRACKS(level):
							level;
						case EXPLORE(level):
							level;
						case WALL(level):
							level;
						case BANK(level):
							level;
						case BARN(level):
							level;
						case SIEGEFACTORY(level):
							level;
						case ACADEMY(level):
							level;
					}
				}, 0.0);
				levels * BASIC_BUILDING_MAINTAIN_FACTOR;
			}
			final cost = peopleCost + attachmentsCost;
			// 計算體力回復率
			final offset = player.money - cost;
			// 完全付不出來的話, 這個系數為1
			final offsetFactor = offset >= 0 ? 0 : Math.min(1, -1 * offset / cost);
			for (people in ctx.peoples) {
				// 別人的武將不回復
				if (people.belongToPlayerId != player.id) {
					continue;
				}
				// 回體力
				final addEnergy = (PEOPLE_ENERGY_SUPPLY_BASE + people.energy * PEOPLE_ENERGY_SUPPLY_SAVE_FACTOR) * (1 - offsetFactor);
				people.energy = Math.min(100, people.energy + addEnergy);
				// 如果完全付不出來
				if (offsetFactor >= 1) {
					people.energy = Math.max(0, people.energy - people.energy * 0.1);
				}
			}
			player.money = Math.max(0, player.money - cost);
		}
		// 吃食物
		{
			final cost = getMaintainArmy(ctx, player.id);
			// 計算士兵逃率
			final offset = player.food - cost;
			// 完全付不出來的話, 這個系數為1
			final offsetFactor = offset >= 0 ? 0 : Math.min(1, -1 * offset / cost);
			for (grid in ctx.grids) {
				if (getGridBelongPlayerId(ctx, grid.id) != player.id) {
					continue;
				}
				// 從格子逃兵
				final base = grid.army * 0.1;
				final lostArmy = base * offsetFactor;
				grid.army = Math.max(0, grid.army - lostArmy);
			}
			// 從主公逃兵
			final base = player.army * 0.1;
			final lostArmy = base * offsetFactor;
			player.army = Math.max(0, player.army - lostArmy);
			player.food = Math.max(0, player.food - cost);
		}
	}
}

function onPeopleExpAdd(ctx:Context, peopleId:Int, exp:Float) {
	final people = getPeopleById(ctx, peopleId);
	final eventValue = {
		peopleBefore: getPeopleInfo(ctx, people),
		peopleAfter: getPeopleInfo(ctx, people),
		gridId: people.position.gridId,
	}
	final originLevel = getExpLevel(people.exp);
	final expRate = if (people.belongToPlayerId == null) {
		1.0;
	} else {
		getExpRateByAttachment(ctx, people.belongToPlayerId);
	}
	final gainExp = exp * expRate;
	people.exp += gainExp;
	final isLevelUp = getExpLevel(people.exp) > originLevel;
	if (isLevelUp) {
		eventValue.peopleAfter = getPeopleInfo(ctx, people);
		ctx.events.push(PEOPLE_LEVEL_UP_EVENT(eventValue, getGameInfo(ctx, false)));
	}
}
