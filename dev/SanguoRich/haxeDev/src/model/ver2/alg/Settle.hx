package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.tool.Fact;

using Lambda;

function getSettleCost(ctx:Context, playerId:Int, peopleId:Int, gridId:Int, settleType:Int) {
	final player = getPlayerById(ctx, playerId);
	final p1 = getPeopleById(ctx, peopleId);
	final useEnergy = p1.energy / (100 / ENERGY_COST_ON_SETTLE);
	final base = getBase(useEnergy, ENERGY_COST_ON_SETTLE, 0.0) * BASE_RATE_SETTLE;
	final settleMoneyCost = [200.0, 200, 200, 500][settleType];
	final putMoney = Math.max(0, Math.min(100, player.money - settleMoneyCost));
	final putArmy = Math.min(100, player.army);
	final putFood = Math.min(100, player.food);
	return {
		player: {
			money: putMoney + settleMoneyCost,
			food: putFood,
			army: putArmy
		},
		people: {
			id: p1.id,
			energy: useEnergy
		},
		genGrid: {
			money: putMoney,
			food: putFood,
			army: putArmy
		},
		successRate: 1.0
	}
}

// 將生長建物資料放在記憶體, 因為開拓的過程不涉及遊戲記錄, 所以可以這樣做
private var _tmpCtx:Null<Context> = null;

private function genNewGrid(ctx:Context, playerId:Int, peopleId:Int, gridId:Int, settleType:Int):GridGenerator.Grid {
	final cost = getSettleCost(ctx, playerId, peopleId, gridId, settleType);
	// 修改遊戲資料的副本
	final tmpCtx = deepCopy(ctx);
	final grid = tmpCtx.grids[gridId];
	// 移除原有建物
	tmpCtx.attachments = tmpCtx.attachments.filter(a -> a.belongToGridId != grid.id);
	// 移除原住民
	tmpCtx.peoples = tmpCtx.peoples.filter(a -> a.position.gridId != grid.id);
	// 移除寶物
	tmpCtx.treasures = tmpCtx.treasures.filter(a -> a.position.gridId != grid.id);
	switch settleType {
		case 0:
			// 市場
			final buildings = BuildingList.filter(catelog -> {
				// 不使用
				// case _:
				// 強迫編譯器檢查
				return switch catelog.type {
					case TREASURE(level):
						false;
					case HUNTING(level):
						false;
					case FISHING(level):
						false;
					case MINE(level):
						false;
					case MARKET(level):
						false;
					case BANK(level):
						false;
					case FARM(level):
						false;
					case BARN(level):
						false;
					case BARRACKS(level):
						false;
					case HOME(level):
						false;
					case EXPLORE(level):
						false;
					case WALL(level):
						level == 0;
					case SIEGEFACTORY(level):
						false;
					case ACADEMY(level):
						false;
				}
			}).map(catelog -> catelog.type);
			for (building in buildings) {
				addAttachInfo(tmpCtx, grid.id, building);
			}
			grid.defaultMaxMoney = 500;
			grid.defaultMaxFood = 500;
			grid.defaultMaxArmy = 500;
		case 1:
			// 農田
			final buildings = BuildingList.filter(catelog -> {
				// 不使用
				// case _:
				// 強迫編譯器檢查
				return switch catelog.type {
					case TREASURE(level):
						false;
					case HUNTING(level):
						false;
					case FISHING(level):
						false;
					case MINE(level):
						false;
					case MARKET(level):
						false;
					case BANK(level):
						false;
					case FARM(level):
						level == 1;
					case BARN(level):
						level == 0;
					case BARRACKS(level):
						false;
					case HOME(level):
						false;
					case EXPLORE(level):
						false;
					case WALL(level):
						level == 0;
					case SIEGEFACTORY(level):
						false;
					case ACADEMY(level):
						false;
				}
			}).map(catelog -> catelog.type);
			for (building in buildings) {
				addAttachInfo(tmpCtx, grid.id, building);
			}
			grid.defaultMaxMoney = 500;
			grid.defaultMaxFood = 500;
			grid.defaultMaxArmy = 500;
		case 2:
			// 村落
			final buildings = BuildingList.filter(catelog -> {
				// 不使用
				// case _:
				// 強迫編譯器檢查
				return switch catelog.type {
					case TREASURE(level):
						false;
					case HUNTING(level):
						false;
					case FISHING(level):
						false;
					case MINE(level):
						false;
					case MARKET(level):
						false;
					case BANK(level):
						false;
					case FARM(level):
						false;
					case BARN(level):
						false;
					case BARRACKS(level):
						level == 1;
					case HOME(level):
						level == 0;
					case EXPLORE(level):
						false;
					case WALL(level):
						level == 0;
					case SIEGEFACTORY(level):
						level == 0;
					case ACADEMY(level):
						level == 0;
				}
			}).map(catelog -> catelog.type);
			for (building in buildings) {
				addAttachInfo(tmpCtx, grid.id, building);
			}
			grid.defaultMaxMoney = 500;
			grid.defaultMaxFood = 500;
			grid.defaultMaxArmy = 500;
		case 3:
			// 城市
			final buildings = BuildingList.filter(catelog -> {
				return switch catelog.type {
					case TREASURE(level):
						level == 0;
					case HUNTING(level):
						level == 0;
					case FISHING(level):
						level == 0;
					case MINE(level):
						level == 0;
					case MARKET(level):
						level == 1;
					case BANK(level):
						level == 0;
					case FARM(level):
						level == 1;
					case BARN(level):
						level == 0;
					case BARRACKS(level):
						level == 1;
					case HOME(level):
						level == 0;
					case EXPLORE(level):
						level == 0;
					case WALL(level):
						level == 0;
					case SIEGEFACTORY(level):
						level == 0;
					case ACADEMY(level):
						level == 0;
				}
			}).map(catelog -> catelog.type);
			for (building in buildings) {
				addAttachInfo(tmpCtx, grid.id, building);
			}
			grid.defaultMaxMoney = 500;
			grid.defaultMaxFood = 500;
			grid.defaultMaxArmy = 500;
		case _:
			throw new haxe.Exception('settleType not found:${settleType}');
	}
	final putMoney = cost.genGrid.money;
	final putArmy = cost.genGrid.army;
	final putFood = cost.genGrid.food;
	grid.money = putMoney;
	grid.army = putArmy;
	grid.food = putFood;
	grid.defaultMoneyGrow = Math.random() * 0.01;
	grid.defaultFoodGrow = Math.random() * 0.01;
	grid.defaultArmyGrow = Math.random() * 0.01;
	// 這回合的資料
	final gridInfo = getGridInfo(tmpCtx, grid);
	// 下回合的資料
	final nextGridInfo = {
		final nextTmpCtx2 = deepCopy(tmpCtx);
		// 將人移到城中(有人才會計算格子成長)
		final p1 = getPeopleById(nextTmpCtx2, peopleId);
		p1.position.gridId = gridId;
		model.ver2.alg.Alg.doGridGrow(nextTmpCtx2);
		nextTmpCtx2.grids[gridId];
	}
	gridInfo.moneyGrow = nextGridInfo.money - gridInfo.money;
	gridInfo.foodGrow = nextGridInfo.food - gridInfo.food;
	gridInfo.armyGrow = nextGridInfo.army - gridInfo.army;
	// 將資料暫存在記憶體
	_tmpCtx = tmpCtx;
	return gridInfo;
}

function _getPreResultOfSettle(ctx:Context, playerId:Int, peopleId:Int, gridId:Int, settleType:Int):GridGenerator.Grid {
	return genNewGrid(ctx, playerId, peopleId, gridId, settleType);
}

function _takeSettle(ctx:Context, playerId:Int, peopleId:Int, gridId:Int, settleType:Int) {
	final playerInGrid = ctx.peoples.filter(a -> a.position.gridId == gridId);
	if (playerInGrid.length > 0) {
		throw new haxe.Exception("playerInGrid.length > 0. 有人在時不能開拓");
	}
	if (_tmpCtx == null) {
		throw new haxe.Exception("_tmpCtx == null. 你必須先呼叫_getPreResultOfSettle");
	}
	// 套用新格子
	ctx.grids = _tmpCtx.grids;
	ctx.attachments = _tmpCtx.attachments;
	ctx.peoples = _tmpCtx.peoples;
	ctx.treasures = _tmpCtx.treasures;
	//
	final player = getPlayerById(ctx, playerId);
	final p1 = getPeopleById(ctx, peopleId);
	final cost = getSettleCost(ctx, playerId, peopleId, gridId, settleType);
	player.food -= cost.player.food;
	player.money -= cost.player.money;
	player.army -= cost.player.army;
	p1.energy -= cost.people.energy;
	onPeopleExpAdd(ctx, p1.id, getExpAdd(cost.successRate, ENERGY_COST_ON_SETTLE));
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasBuild = true;
		player.memory.hasCommand = true;
	}
	// 事件
	final grid = ctx.grids[gridId];
	ctx.events.push(SETTLE_RESULT({
		grid: getGridInfo(ctx, grid),
		gridId: grid.id
	}, getGameInfo(ctx, false), null));
}
