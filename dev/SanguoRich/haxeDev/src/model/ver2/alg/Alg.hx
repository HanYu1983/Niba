package model.ver2.alg;

import model.TreasureGenerator;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Nego;
import model.ver2.alg.War;
import model.ver2.alg.Brain;

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
						case MARKET(level):
							level;
						case FARM(level):
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
					}
				}, 0.0);
				levels * .1;
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

// 玩家回合結束
function doPlayerEnd(ctx:Context) {
	trace("doPlayerEnd", "start");
	final isContinue = onPlayerEnd(ctx, ctx.currentPlayerId);
	if (isContinue) {
		final nextPlayer = ctx.players[ctx.currentPlayerId];
		if (nextPlayer.brain != null) {
			try {
				doBrain(ctx, nextPlayer.id);
			} catch (e:Any) {
				trace("doPlayerEnd catch:", e);
			}
		}
	}
	trace("doPlayerEnd", "finished");
}

function doPlayerDice(ctx:Context) {
	onPlayerDice(ctx, ctx.currentPlayerId);
}

function initContext(ctx:Context, options:GameSetting) {
	trace(options);
	ctx.settings = options;
	trace("第一個玩家不能是AI");
	final genGrids = model.GridGenerator.getInst().getGrids(options.gridCount != null ? options.gridCount : INIT_GRID_COUNT, options.limitBuilding);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	final names = ["劉備", "曹操", "孫權", "董卓"];
	var i = 0;
	for (playerConfig in options.players) {
		final isClose = playerConfig.type == 2;
		final isLose = isClose;
		final mustBePlayer = i == 0;
		final isAI = mustBePlayer == false && playerConfig.type == 1;
		final resource = options.resource != null ? options.resource : INIT_RESOURCE;
		addPlayerInfo(ctx, {
			id: i,
			name: names[i],
			money: /*i == 0 ? 0.0 :*/ isLose ? 0.0 : resource,
			army: /*i == 0 ? 0.0 :*/ isLose ? 0.0 : resource,
			food: /*i == 0 ? 0.0 :*/ isLose ? 0.0 : resource,
			strategy: isLose ? 0.0 : 300.0,
			people: isLose ? [] : [
				model.PeopleGenerator.getInst().generate(-1),
				model.PeopleGenerator.getInst().generate(0),
				model.PeopleGenerator.getInst().generate(0)
			],
			maintainPeople: 0,
			maintainArmy: 0,
			armyGrow: 0.0,
			atGridId: Std.int(Math.random() * genGrids.length),
			grids: [],
			commands: [],
			treasures: [],
			score: 0.0,
		}, isAI, isLose);
		++i;
	}
	for (player in ctx.players) {
		player.score = getPlayerScore(ctx, player.id);
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
	people.exp += exp;
	final isLevelUp = getExpLevel(people.exp) > originLevel;
	if (isLevelUp) {
		eventValue.peopleAfter = getPeopleInfo(ctx, people);
		ctx.events.push(PEOPLE_LEVEL_UP_EVENT(eventValue, getGameInfo(ctx, false)));
	}
}

function onPlayerGoToPosition(ctx:Context, playerId:Int, toGridId:Int) {
	final player = ctx.players[playerId];
	final toGrid = ctx.grids[toGridId];
	final toGridBelongPlayerId = getGridBelongPlayerId(ctx, toGrid.id);
	final fromGridId = player.position;
	player.position = toGridId;
	// 移動動畫
	ctx.events.push(ANIMATION_EVENT_MOVE({
		playerId: playerId,
		fromGridId: fromGridId,
		toGridId: toGridId
	}, getGameInfo(ctx, false)));
	// 過路費
	final isStopAtEnemyGrid = toGridBelongPlayerId != null && toGridBelongPlayerId != player.id;
	if (isStopAtEnemyGrid) {
		onPayTaxToGrid(ctx, player.id, toGrid.id);
	}
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
		gridId: gridId,
	}
	{
		final grid = ctx.grids[gridId];
		// 過路費
		final taxMoney = grid.money * GRID_TAX;
		final taxFood = grid.food * GRID_TAX;
		final taxArmy = grid.army * GRID_TAX;
		switch 1 {
			case 0:
				// 支付
				player.money = Math.max(0, player.money - taxMoney);
				player.food = Math.max(0, player.food - taxFood);
				player.army = Math.max(0, player.army - taxArmy);
				grid.money += taxMoney;
				grid.food += taxFood;
				grid.army += taxArmy;
				// 計算超過格子資源上限的支付給主公
				final maxMoney = getGridMaxMoney(ctx, grid.id);
				final maxFood = getGridMaxFood(ctx, grid.id);
				final maxArmy = getGridMaxArmy(ctx, grid.id);
				final offsetMoney = grid.money - maxMoney;
				final offsetFood = grid.food - maxFood;
				final offsetArmy = grid.army - maxArmy;
				// 中立國沒主公就不管了
				final targetPlayerId = getGridBelongPlayerId(ctx, grid.id);
				if (targetPlayerId != null) {
					final targetPlayer = ctx.players[targetPlayerId];
					// 超過的部分支付給主公
					if (offsetMoney > 0) {
						targetPlayer.money += offsetMoney;
						grid.money = maxMoney;
					}
					if (offsetFood > 0) {
						targetPlayer.food += offsetFood;
						grid.food = maxFood;
					}
					if (offsetArmy > 0) {
						targetPlayer.army += offsetArmy;
						grid.army = maxArmy;
					}
				}
			case 1:
				player.money = Math.max(0, player.money - taxMoney);
				player.food = Math.max(0, player.food - taxFood);
				player.army = Math.max(0, player.army - taxArmy);
				final targetPlayerId = getGridBelongPlayerId(ctx, grid.id);
				if (targetPlayerId != null) {
					final targetPlayer = ctx.players[targetPlayerId];
					targetPlayer.money += taxMoney;
					targetPlayer.food += taxFood;
					targetPlayer.army += taxArmy;
				} else {
					grid.money += taxMoney;
					grid.food += taxFood;
					grid.army += taxArmy;
				}
		}
	}
	eventValue.moneyAfter = player.money;
	eventValue.foodAfter = player.food;
	eventValue.armyAfter = player.army;
	ctx.events.push({
		PAY_FOR_OVER_ENEMY_GRID(eventValue, getGameInfo(ctx, false));
	});
}

function onFindTreasure(ctx:Context, playerId:Int, treasures:Array<Treasure>) {
	if (treasures.length == 0) {
		return;
	}
	for (treasure in treasures) {
		treasure.position.gridId = null;
		treasure.belongToPlayerId = playerId;
	}
	final gridId = ctx.players[playerId].position;
	ctx.events.push(FIND_TREASURE_RESULT({
		treasures: treasures.map(t -> getTreasureInfo(ctx, t).catelog),
		gridId: gridId,
	}, getGameInfo(ctx, false)));
}

function getPlayerScore(ctx:Context, playerId:Int):Float {
	final info = getCalcTotalsByPlayerId(ctx, playerId);
	final resourceScore = info.army + info.food + info.money;
	final treasureScore = ctx.treasures.filter(t -> t.belongToPlayerId == playerId).map(t -> getTreasureInfo(ctx, t)).fold((p, a:Float) -> {
		return a + p.catelog.cost;
	}, 0.0);
	final peopleScore = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a:Float) -> {
		return a + p.cost;
	}, 0.0);
	final gridScore = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).length * 1000;
	final gridResourceScore = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).map(g -> {
		return g.army + g.food + g.money;
	}).fold((p, a:Float) -> {
		return a + p;
	}, 0.0);
	final attachScore = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).length * 300;
	trace("getPlayerScore", resourceScore, treasureScore, peopleScore, gridScore, attachScore);
	return (resourceScore + gridResourceScore) * 3.0 + treasureScore + peopleScore + gridScore + attachScore;
}

// 玩家回合結束
function onPlayerEnd(ctx:Context, playerId:Int):Bool {
	if (playerId != ctx.currentPlayerId) {
		throw new haxe.Exception("現在不是你的回合，不能呼叫end");
	}
	// 算分, 判定勝負
	final player = ctx.players[playerId];
	if (player.isLose == false) {
		player.score = getPlayerScore(ctx, player.id);
		player.isLose = {
			final playerScores = ctx.players.map(p -> p.score);
			final myScore = playerScores[playerId];
			playerScores.sort((a, b) -> Std.int(b * 100) - Std.int(a * 100));
			final maxScore = playerScores[0];
			myScore <= (maxScore / 10.0);
		}
		if (player.isLose) {
			ctx.events.push(PLAYER_LOSE({
				player: getPlayerInfo(ctx, player),
			}, getGameInfo(ctx, false), {duration: 3}));
			final winPlayers = ctx.players.filter(p -> p.isLose == false);
			if (winPlayers.length == 1) {
				final winPlayer = winPlayers[0];
				ctx.events.push(PLAYER_WIN({
					player: getPlayerInfo(ctx, winPlayer),
				}, getGameInfo(ctx, false), {duration: 3}));
				return false;
			}
			final playerLiveButNotAI = ctx.players.filter(p -> p.brain == null && p.isLose == false);
			if (playerLiveButNotAI.length == 0) {
				final winPlayer = winPlayers[0];
				ctx.events.push(PLAYER_WIN({
					player: null,
				}, getGameInfo(ctx, false), {duration: 3}));
				return false;
			}
		}
	}
	// 四個玩家走完後才計算回合
	final lastPlayer = {
		final playerStillLive = ctx.players.filter(p -> p.isLose == false);
		if (playerStillLive.length == 0) {
			throw new haxe.Exception("應該最少有一個玩家isLose == false");
		}
		playerStillLive[playerStillLive.length - 1];
	}
	final isTurnEnd = ctx.currentPlayerId == lastPlayer.id;
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
					ctx.events.push(WORLD_EVENT(worldEventValue, getGameInfo(ctx, false)));
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
					grid.army -= earnArmy;
					if (grid.army < 0) {
						grid.army = 0;
					}
					grid.food -= earnFood;
					if (grid.food < 0) {
						grid.food = 0;
					}
					grid.money -= earnMoney;
					if (grid.money < 0) {
						grid.money = 0;
					}
					player.army += earnArmy;
					player.food += earnFood;
					player.money += earnMoney;
				}
				worldEventValue.playerAfter = ctx.players.map(p -> getPlayerInfo(ctx, p));
				worldEventValue.gridAfter = ctx.grids.map(g -> getGridInfo(ctx, g));
				ctx.events.push(WORLD_EVENT(worldEventValue, getGameInfo(ctx, false)));
			}
		}
		{
			//
			final enable = (ctx.turn + 1) % FAVER_SLOW_PER_TURN == 0;
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
				}
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					if (gridsWillGrow.length > 0) {
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
				}
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					if (gridsWillGrow.length > 0) {
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
						chooseGrid.defaultMaxMoney = 500;
						chooseGrid.defaultMaxFood = 500;
						chooseGrid.defaultMaxArmy = 500;

						// 加入武將
						addPeopleInfo(ctx, null, chooseGrid.id, model.PeopleGenerator.getInst().generate());
						ctx.events.push(GRID_BORN_EVENT({
							grid: getGridInfo(ctx, chooseGrid)
						}, getGameInfo(ctx, false)));
					}
				}
			}
		}
		// 下一回合
		ctx.turn += 1;
	}
	// 下一個玩家
	for (i in 0...ctx.players.length) {
		ctx.currentPlayerId = (ctx.currentPlayerId + 1) % ctx.players.length;
		final tmpPlyr = ctx.players[ctx.currentPlayerId];
		if (tmpPlyr.isLose) {
			continue;
		}
		break;
	}
	// clear memory
	clearMemory(ctx);
	return true;
}

function onPlayerDice(ctx:Context, playerId:Int) {
	if (playerId != ctx.currentPlayerId) {
		throw new haxe.Exception("現在不是你的回合,不能呼叫end");
	}
	final player = ctx.players[playerId];
	final fromGridId = player.position;
	final moveStep = Math.floor(Math.random() * 6) + 1;
	var toGridId = (fromGridId + moveStep) % ctx.grids.length;
	{
		// 計算路障
		// final everyStep = [for (i in 1...(moveStep + 1)) player.position + i].map(s -> s % ctx.grids.length);
		// final findGroundItem = ctx.groundItems.filter(item -> everyStep.has(item.position) && item.belongToPlayerId != playerId);
		// if (findGroundItem.length > 0) {
		// 	final stopItem = findGroundItem[0];
		// 	// 停住
		// 	toGridId = stopItem.position;
		// 	// 移除路障
		// 	ctx.groundItems = ctx.groundItems.filter(item -> item.id != stopItem.id);
		// 	trace("onPlayerDice", "路障!!!", "grid", toGridId);
		// }
		for (s in 1...(moveStep + 1)) {
			final nextPosition = (player.position + s) % ctx.grids.length;
			final findGroundItem = ctx.groundItems.filter(item -> item.position == nextPosition && item.belongToPlayerId != playerId);
			if (findGroundItem.length > 0) {
				final stopItem = findGroundItem[0];
				// 停住
				toGridId = stopItem.position;
				// 移除路障
				ctx.groundItems = ctx.groundItems.filter(item -> item.id != stopItem.id);
				trace("onPlayerDice", "路障!!!", "grid", toGridId);
			}
		}
	}
	onPlayerGoToPosition(ctx, playerId, toGridId);
	player.memory.hasDice = true;
}
