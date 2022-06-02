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

function doGridGrow(ctx:Context) {
	for (grid in ctx.grids) {
		final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
		// 沒武將的格子不成長
		if (peopleInGrid.length == 0) {
			continue;
		}
		// 城池成長
		final gainMoney = grid.money * getGridMoneyGrow(ctx, grid.id) + getGridMoneyAdd(ctx, grid.id);
		final gainFood = grid.food * getGridFoodGrow(ctx, grid.id) + getGridFoodAdd(ctx, grid.id);
		final gainArmy = grid.army * getGridArmyGrow(ctx, grid.id) + getGridArmyAdd(ctx, grid.id);
		grid.money = Math.min(getGridMaxMoney(ctx, grid.id), grid.money + gainMoney);
		grid.food = Math.min(getGridMaxFood(ctx, grid.id), grid.food + gainFood);
		grid.army = Math.min(getGridMaxArmy(ctx, grid.id), grid.army + gainArmy);
	}
}

function onGridGainFoodEvent(ctx:Context, gridsWillGrow:Array<Grid>) {
	final gridsBefore = gridsWillGrow.map(g -> getGridInfo(ctx, g));
	for (grid in gridsWillGrow) {
		final gain = EVENT_GROW_FOOD_AMOUNT * (Math.random() * .4 + .8);
		grid.food = Math.min(getGridMaxFood(ctx, grid.id), grid.food + gain);
	}
	final gridsAfter = gridsWillGrow.map(g -> getGridInfo(ctx, g));
	ctx.events.push(GRID_RESOURCE_EVENT({
		grids: [
			for (i in 0...gridsWillGrow.length)
				{
					gridBefore: gridsBefore[i],
					gridAfter: gridsAfter[i]
				}
		],
		describtion: "大豐收"
	}, getGameInfo(ctx, false)));
}

function onGridGainMoneyEvent(ctx:Context, gridsWillGrow:Array<Grid>) {
	final gridsBefore = gridsWillGrow.map(g -> getGridInfo(ctx, g));
	for (grid in gridsWillGrow) {
		final gain = EVENT_GROW_FOOD_AMOUNT * (Math.random() * .4 + .8);
		grid.money = Math.min(getGridMaxMoney(ctx, grid.id), grid.money + gain);
	}
	final gridsAfter = gridsWillGrow.map(g -> getGridInfo(ctx, g));
	ctx.events.push(GRID_RESOURCE_EVENT({
		grids: [
			for (i in 0...gridsWillGrow.length)
				{
					gridBefore: gridsBefore[i],
					gridAfter: gridsAfter[i]
				}
		],
		describtion: "大發利市"
	}, getGameInfo(ctx, false)));
}

function onGridGainArmyEvent(ctx:Context, gridsWillGrow:Array<Grid>) {
	final gridsBefore = gridsWillGrow.map(g -> getGridInfo(ctx, g));
	for (grid in gridsWillGrow) {
		final gain = EVENT_GROW_FOOD_AMOUNT * (Math.random() * .4 + .8);
		grid.army = Math.min(getGridMaxArmy(ctx, grid.id), grid.army + gain);
	}
	final gridsAfter = gridsWillGrow.map(g -> getGridInfo(ctx, g));
	ctx.events.push(GRID_RESOURCE_EVENT({
		grids: [
			for (i in 0...gridsWillGrow.length)
				{
					gridBefore: gridsBefore[i],
					gridAfter: gridsAfter[i]
				}
		],
		describtion: "接收民兵"
	}, getGameInfo(ctx, false)));
}

function onGridBornEvent(ctx:Context, gridId:Int) {
	final chooseId = gridId;
	final chooseGrid = ctx.grids[chooseId];
	// 移除原有建物
	ctx.attachments = ctx.attachments.filter(a -> a.belongToGridId != chooseGrid.id);
	//
	final buildings = BuildingList.filter(catelog -> {
		// 不使用
		// case _:
		// 強迫編譯器檢查
		return switch catelog.type {
			case PUB(level):
				level == 0;
			case TREASURE(level):
				level == 0;
			case FISHING(level):
				level == 0;
			case HUNTING(level):
				level == 0;
			case MINE(level):
				level == 0;
			case MARKET(level):
				level == 0;
			case BANK(level):
				level == 0;
			case FARM(level):
				level == 0;
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
		addAttachInfo(ctx, chooseGrid.id, building);
	}
	// 記得加入buildtype!
	chooseGrid.buildtype = VILLAGE;
	chooseGrid.money = EVENT_GRID_BORN_RESOURCE_AMOUNT;
	chooseGrid.army = EVENT_GRID_BORN_RESOURCE_AMOUNT;
	chooseGrid.food = EVENT_GRID_BORN_RESOURCE_AMOUNT;
	chooseGrid.defaultMaxMoney = 500;
	chooseGrid.defaultMaxFood = 500;
	chooseGrid.defaultMaxArmy = 500;
	// 加入武將
	addPeopleInfo(ctx, null, chooseGrid.id, model.PeopleGenerator.getInst().generate());
	ctx.events.push(GRID_BORN_EVENT({
		grid: getGridInfo(ctx, chooseGrid)
	}, getGameInfo(ctx, false)));
}
