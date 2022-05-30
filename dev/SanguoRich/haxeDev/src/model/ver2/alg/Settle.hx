package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.Config;
import model.tool.Fact;
import model.ver2.Define;
import model.ver2.alg.Alg;
import model.ver2.alg.AlgPlayer;
import model.ver2.alg.AlgGrid;
import model.ver2.alg.AlgPeople;

using Lambda;

function getSettleCost(ctx:Context, playerId:Int, peopleId:Int, gridId:Int, settleType:Int) {
	final player = getPlayerById(ctx, playerId);
	final p1 = getPeopleById(ctx, peopleId);
	final useEnergy = p1.energy / (100 / ENERGY_COST_ON_SETTLE);
	final base = getBase(useEnergy, ENERGY_COST_ON_SETTLE, 0.0) * BASE_RATE_SETTLE;
	final settleMoneyCost = [200.0, 200, 200, 500][settleType];
	final putMoney = Math.max(0, Math.min(100, player.money - settleMoneyCost));
	final putArmy = Math.min(100, player.army);
	final putFood = Math.max(0, Math.min(100, player.food - settleMoneyCost));
	return {
		player: {
			money: putMoney + settleMoneyCost,
			food: putFood + settleMoneyCost,
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
	// 移除原有建物
	tmpCtx.attachments = tmpCtx.attachments.filter(a -> a.belongToGridId != gridId);
	// 移除原住民
	tmpCtx.peoples = tmpCtx.peoples.filter(a -> a.position.gridId != gridId);
	// 移除寶物
	tmpCtx.treasures = tmpCtx.treasures.filter(a -> a.position.gridId != gridId);
	// 這回合的資料
	final newGridInfo:GridGenerator.Grid = {
		final limitBuilding = if (ctx.settings == null) {
			true;
		} else {
			ctx.settings.limitBuilding;
		}
		final landType = ctx.grids[gridId].landType;
		final buildtype:GROWTYPE = switch settleType {
			case 0: MARKET;
			case 1: FARM;
			case 2: VILLAGE;
			case 3: CITY;
			case _: throw new haxe.Exception('unknown settleType: ${settleType}');
		}
		var tmp:Null<GridGenerator.Grid> = null;
		// 只跑100次, 這裡假設不可能在次數內還無法隨機非建物地
		for (i in 0...100) {
			tmp = GridGenerator.getInst().getGrids(1, limitBuilding, -1, landType, buildtype)[0];
			switch tmp.buildtype {
				case CHANCE | DESTINY | EMPTY:
					// 不開拓出無建物的地
					continue;
				case MARKET | FARM | VILLAGE | CITY:
					// 只開出有建物的地
			}
			break;
		}
		if (tmp == null) {
			throw new haxe.Exception("次數內還無法隨機非建物地, 請檢查產生算法");
		}
		// 同步id
		tmp.id = gridId;
		// 同步名字
		tmp.name = ctx.grids[gridId].name;
		// 放進來的資源
		tmp.money = cost.genGrid.money;
		tmp.army = cost.genGrid.army;
		tmp.food = cost.genGrid.food;
		// 清空本來的武將
		tmp.people = [];
		tmp;
	}
	addGridInfo(tmpCtx, newGridInfo, true);
	final gridInfo = deepCopy(newGridInfo);
	// 下回合的資料
	final nextGridInfo = {
		final nextTmpCtx2 = deepCopy(tmpCtx);
		// 將人移到城中(有人才會計算格子成長)
		final p1 = getPeopleById(nextTmpCtx2, peopleId);
		p1.position.gridId = gridId;
		doGridGrow(nextTmpCtx2);
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
	if (_tmpCtx != null) {
		final grid = _tmpCtx.grids[gridId];
		return getGridInfo(ctx, grid);
	}
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
	// 套用idSeq!!
	ctx.idSeq = _tmpCtx.idSeq;
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
	// 清空暫存
	_tmpCtx = null;
}

function test() {
	final ctx = getDefaultContext();
	var grid0 = {
		final tmp = getDefaultGrid();
		tmp;
	}
	ctx.grids = [grid0];
	final player0 = {
		final tmp = getDefaultPlayer();
		tmp.money = 1000;
		tmp.food = 1000;
		tmp.army = 1000;
		tmp;
	}
	ctx.players = [player0];
	final people0 = {
		final tmp = getDefaultPeople();
		tmp;
	}
	ctx.peoples = [people0];
	_getPreResultOfSettle(ctx, player0.id, people0.id, grid0.id, 0);
	_takeSettle(ctx, player0.id, people0.id, grid0.id, 0);
	grid0 = ctx.grids[0];
	switch [grid0.money, grid0.food, grid0.army] {
		case [100, 100, 100]:
		case _:
			throw new haxe.Exception("格子必須有資源各100");
	}
	switch [player0.money, player0.food, player0.army] {
		case [700, 700, 900]:
		case _:
			throw new haxe.Exception("玩家必須支付200錢和放入的各100資源");
	}
	final attachInGrid = ctx.attachments.filter(a -> a.belongToGridId == grid0.id);
	if (attachInGrid.length == 0) {
		throw new haxe.Exception("必須蓋出建物");
	}
}
