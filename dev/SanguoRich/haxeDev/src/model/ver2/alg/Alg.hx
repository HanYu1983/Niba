package model.ver2.alg;

import model.TreasureGenerator;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Nego;
import model.ver2.alg.War;

using Lambda;

function doPeopleMaintain(ctx:Context) {
	// 玩家
	for (player in ctx.players) {
		// 支付武將的薪水
		{
			final cost = getMaintainPeople(ctx, player.id);
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

function doGridGrow(ctx:Context) {
	for (grid in ctx.grids) {
		final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
		// 沒武將的格子不成長
		if (peopleInGrid.length == 0) {
			continue;
		}
		// 城池成長
		final gainMoney = grid.money * getGridMoneyGrow(ctx, grid.id);
		final gainFood = grid.food * getGridFoodGrow(ctx, grid.id);
		final gainArmy = grid.army * getGridArmyGrow(ctx, grid.id);
		grid.money = Math.min(GRID_RESOURCE_MAX, grid.money + gainMoney);
		grid.food = Math.min(GRID_RESOURCE_MAX, grid.food + gainFood);
		grid.army = Math.min(GRID_RESOURCE_MAX, grid.army + gainArmy);
	}
}

// 玩家回合結束
function doPlayerEnd(ctx:Context) {
	ctx.actions = [];
	ctx.events = [];
	// 四個玩家走完後才計算回合
	final isTurnEnd = ctx.currentPlayerId == (ctx.players.length - 1);
	if (isTurnEnd) {
		// 支付薪水
		{
			final enable = (ctx.turn + 1) % PLAYER_EARN_PER_TURN == 0;
			if (enable) {
				final worldEventValue = {
					playerBefore: ctx.players.map(p -> getPlayerInfo(ctx, p)),
					playerAfter: ([] : Array<model.IModel.PlayerInfo>),
					gridBefore: ctx.grids.map(g -> getGridInfo(ctx, g)),
					gridAfter: ([] : Array<model.GridGenerator.Grid>),
				}
				doPeopleMaintain(ctx);
				worldEventValue.playerAfter = ctx.players.map(p -> getPlayerInfo(ctx, p));
				worldEventValue.gridAfter = ctx.grids.map(g -> getGridInfo(ctx, g));
				if (SHOW_POPUP_WHEN_EARN) {
					ctx.events.push(Event.WORLD_EVENT(worldEventValue));
				}
			}
		}
		// 格子成長
		{
			final enable = (ctx.turn + 1) % GRID_EARN_PER_TURN == 0;
			if (enable) {
				doGridGrow(ctx);
			}
		}
		// 收稅
		{
			final enable = (ctx.turn + 1) % PLAYER_EARN_FROM_CITY_PER_TURN == 0;
			if (enable) {
				trace("ModelVer2", "doPlayerEnd", "收稅");
				final worldEventValue = {
					playerBefore: ctx.players.map(p -> getPlayerInfo(ctx, p)),
					playerAfter: ([] : Array<model.IModel.PlayerInfo>),
					gridBefore: ctx.grids.map(g -> getGridInfo(ctx, g)),
					gridAfter: ([] : Array<model.GridGenerator.Grid>),
				}
				for (grid in ctx.grids) {
					// 有主公的才有稅收
					final belongPlayerId = getGridBelongPlayerId(ctx, grid.id);
					if (belongPlayerId == null) {
						continue;
					}
					final player = ctx.players[belongPlayerId];
					final earnArmy = grid.army * PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT;
					final earnFood = grid.food * PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT;
					final earnMoney = grid.money * PLAYER_EARN_FROM_CITY_BY_TURN_PERSENT;
					// grid.army -= earnArmy;
					// if (grid.army < 0) {
					// 	grid.army = 0;
					// }
					// grid.food -= earnFood;
					// if (grid.food < 0) {
					// 	grid.food = 0;
					// }
					// grid.money -= earnMoney;
					// if (grid.money < 0) {
					// 	grid.money = 0;
					// }
					player.army += earnArmy;
					player.food += earnFood;
					player.money += earnMoney;
				}
				worldEventValue.playerAfter = ctx.players.map(p -> getPlayerInfo(ctx, p));
				worldEventValue.gridAfter = ctx.grids.map(g -> getGridInfo(ctx, g));
				ctx.events.push(Event.WORLD_EVENT(worldEventValue));
			}
			// 收稅時計算友好度
			if (enable) {
				for (grid in ctx.grids) {
					for (playerId in 0...ctx.players.length) {
						grid.favor[playerId] = switch grid.favor[playerId] {
							case favor if (favor < 0):
								Std.int(Math.min(favor + 1, MAX_GRID_FAVOR));
							case favor if (favor > 0):
								Std.int(Math.max(favor - 1, MIN_GRID_FAVOR));
							case favor:
								favor;
						}
					}
				}
			}
		}
		// 事件
		{
			final enable = (ctx.turn + 1) % 1 == 0;
			if (enable) {
				//
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					if (gridsWillGrow.length > 0) {
						final gridsBefore = gridsWillGrow.map(g -> getGridInfo(ctx, g));
						for (grid in gridsWillGrow) {
							final gain = EVENT_GROW_FOOD_AMOUNT * (Math.random() * .4 + .8);
							grid.food = Math.min(GRID_RESOURCE_MAX, grid.food + gain);
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
						}));
					}
				}
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					if (gridsWillGrow.length > 0) {
						final gridsBefore = gridsWillGrow.map(g -> getGridInfo(ctx, g));
						for (grid in gridsWillGrow) {
							final gain = EVENT_GROW_FOOD_AMOUNT * (Math.random() * .4 + .8);
							grid.money = Math.min(GRID_RESOURCE_MAX, grid.money + gain);
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
						}));
					}
				}
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					if (gridsWillGrow.length > 0) {
						final gridsBefore = gridsWillGrow.map(g -> getGridInfo(ctx, g));
						for (grid in gridsWillGrow) {
							final gain = EVENT_GROW_FOOD_AMOUNT * (Math.random() * .4 + .8);
							grid.army = Math.min(GRID_RESOURCE_MAX, grid.army + gain);
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
						}));
					}
				}
				final isBorn = Math.random() < EVENT_GRID_BORN_RATE;
				if (isBorn) {
					final emptyGrids = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) == EMPTY);
					if (emptyGrids.length > 0) {
						final chooseId = Std.int(Math.random() * emptyGrids.length);
						final chooseGrid = emptyGrids[chooseId];
						// 隨機生成類型
						addAttachInfo(ctx, chooseGrid.id, MARKET(0));
						addAttachInfo(ctx, chooseGrid.id, FARM(0));
						addAttachInfo(ctx, chooseGrid.id, BARRACKS(1));
						addAttachInfo(ctx, chooseGrid.id, EXPLORE(0));
						addAttachInfo(ctx, chooseGrid.id, WALL(0));
						chooseGrid.money = EVENT_GRID_BORN_RESOURCE_AMOUNT;
						chooseGrid.army = EVENT_GRID_BORN_RESOURCE_AMOUNT;
						chooseGrid.food = EVENT_GRID_BORN_RESOURCE_AMOUNT;

						// 加入武將
						addPeopleInfo(ctx, null, chooseGrid.id, model.PeopleGenerator.getInst().generate());
						ctx.events.push(GRID_BORN_EVENT({
							grid: getGridInfo(ctx, chooseGrid)
						}));
					}
				}
			}
		}
		// 下一回合
		ctx.turn += 1;
	}
	// 下一個玩家
	ctx.currentPlayerId = (ctx.currentPlayerId + 1) % ctx.players.length;
	// clear memory
	clearMemory(ctx);
}

function doPlayerDice(ctx:Context) {
	ctx.events = [];
	ctx.actions = [];
	final activePlayerId = ctx.currentPlayerId;
	final player = ctx.players[activePlayerId];
	final fromGridId = player.position;
	final moveStep = Math.floor(Math.random() * 6) + 1;
	var toGridId = (fromGridId + moveStep) % ctx.grids.length;
	{
		// 計算路障
		final everyStep = [for (i in 1...(moveStep + 1)) player.position + i].map(s -> s % ctx.grids.length);
		final findGroundItem = ctx.groundItems.filter(item -> everyStep.has(item.position) && item.belongToPlayerId != activePlayerId);
		if (findGroundItem.length > 0) {
			final stopItem = findGroundItem[0];
			// 停住
			toGridId = stopItem.position;
			// 移除路障
			ctx.groundItems = ctx.groundItems.filter(item -> item.id != stopItem.id);
		}
	}
	onPlayerGoToPosition(ctx, activePlayerId, toGridId);
	player.memory.hasDice = true;
	ctx.actions.push(Action.MOVE({
		playerId: activePlayerId,
		fromGridId: fromGridId,
		toGridId: toGridId
	}, getGameInfo(ctx, false)));
}

function initContext(ctx:Context, option:{}) {
	final genGrids = model.GridGenerator.getInst().getGrids(20);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	var i = 0;
	// for (name in ["vic", "han", "xiao", "any"]) {
	for (name in ["劉備", "曹操"]) {
		addPlayerInfo(ctx, {
			id: i++,
			name: name,
			money: 1200.0,
			army: 1200.0,
			food: 1200.0,
			strategy: 300.0,
			people: [
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate()
			],
			maintainPeople: 0,
			maintainArmy: 0,
			armyGrow: 0.01,
			atGridId: 0,
			grids: [],
			commands: [],
			treasures: []
		});
	}
}

function onPeopleExpAdd(ctx:Context, peopleId:Int, exp:Float) {
	final people = getPeopleById(ctx, peopleId);
	final eventValue = {
		peopleBefore: getPeopleInfo(ctx, people),
		peopleAfter: getPeopleInfo(ctx, people),
	}
	final originLevel = getExpLevel(people.exp);
	people.exp += exp;
	final isLevelUp = getExpLevel(people.exp) > originLevel;
	if (isLevelUp) {
		eventValue.peopleAfter = getPeopleInfo(ctx, people);
		ctx.events.push(Event.PEOPLE_LEVEL_UP_EVENT(eventValue));
	}
}

function onPlayerGoToPosition(ctx:Context, playerId:Int, toGridId:Int) {
	final player = ctx.players[playerId];
	final toGrid = ctx.grids[toGridId];
	final toGridBelongPlayerId = getGridBelongPlayerId(ctx, toGrid.id);
	final isStopAtEnemyGrid = toGridBelongPlayerId != null && toGridBelongPlayerId != player.id;
	if (isStopAtEnemyGrid) {
		onPayTaxToGrid(ctx, player.id, toGrid.id);
	}
	player.position = toGridId;
}

function onPayTaxToGrid(ctx:Context, playerId:Int, gridId:Int) {
	final player = ctx.players[playerId];
	final eventValue = {
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	{
		final grid = ctx.grids[gridId];
		final taxMoney = grid.money / 5;
		final taxFood = grid.food / 5;
		player.money = Math.max(0, player.money - taxMoney);
		player.food = Math.max(0, player.food - taxFood);
		grid.money += taxMoney;
		grid.food += taxFood;
	}
	eventValue.moneyAfter = player.money;
	eventValue.foodAfter = player.food;
	ctx.events.push({
		Event.PAY_FOR_OVER_ENEMY_GRID(eventValue);
	});
}

function onFindTreasure(ctx:Context, playerId:Int, treasures:Array<Treasure>) {
	for (treasure in treasures) {
		treasure.position.gridId = null;
		treasure.belongToPlayerId = playerId;
	}
	ctx.events.push(Event.FIND_TREASURE_RESULT({
		treasures: treasures.map(t -> getTreasureInfo(ctx, t).catelog)
	}));
}
