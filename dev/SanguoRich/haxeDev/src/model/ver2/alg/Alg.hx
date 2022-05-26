package model.ver2.alg;

import model.TreasureGenerator;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Nego;
import model.ver2.alg.War;
import model.ver2.alg.Brain;
import tool.Debug;

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
	info("Alg", ["doPlayerEnd", "start"]);
	final isContinue = onPlayerEnd(ctx, ctx.currentPlayerId);
	if (isContinue) {
		final nextPlayer = ctx.players[ctx.currentPlayerId];
		if (nextPlayer.brain != null) {
			try {
				doBrain(ctx, nextPlayer.id);
			} catch (e:Any) {
				warn("Alg", ["doPlayerEnd catch", e]);
			}
		}
	}
	info("Alg", ["doPlayerEnd", "done"]);
}

function doPlayerDice(ctx:Context) {
	onPlayerDice(ctx, ctx.currentPlayerId);
}

function initContext(ctx:Context, options:GameSetting) {
	info("Alg", ["initContext", options]);
	ctx.settings = options;
	final genGrids = model.GridGenerator.getInst()
		.getGrids(options.gridCount != null ? options.gridCount : INIT_GRID_COUNT, options.limitBuilding, options.putong ? 0 : -1);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	final names = ["劉備", "曹操", "孫權", "董卓"];
	var i = 0;
	final playerPosSet:Array<Int> = [];
	for (playerConfig in options.players) {
		final isClose = playerConfig.type == 2;
		final isLose = isClose;
		final mustBePlayer = i == 0;
		final isAI = mustBePlayer == false && playerConfig.type == 1;
		final resourceFact = isAI ? [1.0, 1.5, 2.0][options.aiLevel] : 1.0;
		final resource = (options.resource != null ? options.resource : INIT_RESOURCE) * resourceFact;
		final atGridId = {
			var pos = Std.int(Math.random() * genGrids.length);
			for (i in 0...10) {
				if (playerPosSet.has(pos) == false) {
					break;
				}
				pos = Std.int(Math.random() * genGrids.length);
			};
			pos;
		}
		playerPosSet.push(atGridId);
		addPlayerInfo(ctx, {
			id: i,
			name: names[i],
			money: isLose ? 0.0 : resource * 2,
			army: isLose ? 0.0 : resource,
			food: isLose ? 0.0 : resource * 2,
			strategys: [],
			people: isLose ? [] : [
				model.PeopleGenerator.getInst().generate(options.putong ? 0 : -1),
				model.PeopleGenerator.getInst().generate(options.putong ? 0 : -1),
				model.PeopleGenerator.getInst().generate(options.putong ? 0 : -1),
			],
			maintainPeople: 0,
			maintainArmy: 0,
			armyGrow: 0.0,
			atGridId: atGridId,
			grids: [],
			commands: [],
			treasures: [],
			score: 0.0,
		}, isAI, isLose);
		i++;
	}
	for (player in ctx.players) {
		if (player.isLose) {
			continue;
		}
		// 移除原有建物
		ctx.attachments = ctx.attachments.filter(a -> a.belongToGridId != player.position);
		// 蓋總城建物
		final buildings = BuildingList.filter(catelog -> {
			// 不使用
			// case _:
			// 強迫編譯器檢查
			return switch catelog.type {
				case FISHING(level):
					level == 0;
				case HUNTING(level):
					level == 0;
				case MINE(level):
					level == 0;
				case MARKET(level):
					level == 0;
				case BANK(level):
					level == 1;
				case FARM(level):
					level == 0;
				case BARN(level):
					level == 1;
				case BARRACKS(level):
					level == 0;
				case HOME(level):
					level == 1;
				case EXPLORE(level):
					level == 0;
				case WALL(level):
					level == 1;
				case SIEGEFACTORY(level):
					level == 0;
				case ACADEMY(level):
					level == 0;
			}
		}).map(catelog -> catelog.type);
		for (building in buildings) {
			addAttachInfo(ctx, player.position, building);
		}
		ctx.grids[player.position].defaultMoneyGrow = Math.random() * 0.01;
		ctx.grids[player.position].defaultFoodGrow = Math.random() * 0.01;
		ctx.grids[player.position].defaultArmyGrow = Math.random() * 0.01;
		ctx.grids[player.position].defaultMaxMoney = 500;
		ctx.grids[player.position].defaultMaxFood = 500;
		ctx.grids[player.position].defaultMaxArmy = 500;
		ctx.grids[player.position].money = 350;
		ctx.grids[player.position].food = 350;
		ctx.grids[player.position].army = 350;
		final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == player.position);
		for (people in peopleInGrid) {
			people.belongToPlayerId = player.id;
		}
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

function onPlayerGoToPosition(ctx:Context, playerId:Int, toGridId:Int) {
	final player = getPlayerById(ctx, playerId);
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
	final grid = ctx.grids[gridId];
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, grid.id);
	if (gridBelongPlayerId == null) {
		throw new haxe.Exception("這裡不該是付給中立格子");
	}
	final player = getPlayerById(ctx, playerId);
	// 是否有減免效果
	{
		final effectStrategy16 = ctx.effects.filter(e -> e.belongToPlayerId == playerId).filter(e -> switch e.proto {
			case Strategy({id: 16}):
				true;
			case _:
				false;
		});
		if (effectStrategy16.length > 0) {
			ctx.events.push(MESSAGE_EVENT({
				title: '${player.name}有減免效果',
				msg: "不用支付貢奉金"
			}, getGameInfo(ctx, false)));
			// 移除效果
			ctx.effects = ctx.effects.filter(e -> e.id != effectStrategy16[0].id);
			return;
		}
	}
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
		// 過路費
		final taxRate = getGridTaxRate(ctx, grid.id);
		final taxMoney = Math.max(0, grid.money * taxRate);
		final taxFood = Math.max(0, grid.food * taxRate);
		final taxArmy = Math.max(0, grid.army * taxRate);
		{
			final hateRate = Std.int((taxMoney + taxFood + taxArmy) / 100);
			for (i in 0...hateRate + 1) {
				player.hate.push(gridBelongPlayerId);
			}
		}
		// info("onPayTaxToGrid", "player.name", player.name);
		// info("onPayTaxToGrid", "taxRate", taxRate);
		// info("onPayTaxToGrid", "taxMoney", taxMoney);
		// info("onPayTaxToGrid", "taxFood", taxFood);
		// info("onPayTaxToGrid", "taxArmy", taxArmy);
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
				player.money -= taxMoney;
				player.food -= taxFood;
				player.army -= taxArmy;

				if (player.money < 0 || player.food < 0 || player.army < 0) {
					final playerGrids = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == player.id);
					// 從小城開始賣
					playerGrids.sort((a, b) -> {
						final ac = a.food + a.money + a.army;
						final bc = b.food + b.money + b.army;
						return Std.int(ac) - Std.int(bc);
					});
					for (g in playerGrids) {
						// 計算建物的賣價
						final attachInGrid = ctx.attachments.filter(a -> a.belongToGridId == g.id);
						final attachSellValue = attachInGrid.flatMap(a -> {
							final ret:Array<BUILDING> = switch a.type {
								case FISHING(level):
									[for (i in 0...level + 1) FISHING(i)];
								case HUNTING(level):
									[for (i in 0...level + 1) HUNTING(i)];
								case MINE(level):
									[for (i in 0...level + 1) MINE(i)];
								case MARKET(level):
									[for (i in 0...level + 1) MARKET(i)];
								case BANK(level):
									[for (i in 0...level + 1) BANK(i)];
								case FARM(level):
									[for (i in 0...level + 1) FARM(i)];
								case BARN(level):
									[for (i in 0...level + 1) BARN(i)];
								case BARRACKS(level):
									[for (i in 0...level + 1) BARRACKS(i)];
								case HOME(level):
									[for (i in 0...level + 1) HOME(i)];
								case EXPLORE(level):
									[for (i in 0...level + 1) EXPLORE(i)];
								case WALL(level):
									[for (i in 0...level + 1) WALL(i)];
								case SIEGEFACTORY(level):
									[for (i in 0...level + 1) SIEGEFACTORY(i)];
								case ACADEMY(level):
									[for (i in 0...level + 1) ACADEMY(i)];
							}
							return ret;
						}).map(type -> {
							final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, type));
							if (catelog.length == 0) {
								throw new haxe.Exception('current.catelog找不到:${type}');
							}
							return catelog[0];
						}).fold((catelog, acc) -> {
							return catelog.money + acc;
						}, 0.0);
						// 賣掉建物
						for (a in attachInGrid) {
							final resetBuild:BUILDING = switch a.type {
								case FISHING(_):
									FISHING(0);
								case HUNTING(_):
									HUNTING(0);
								case MINE(_):
									MINE(0);
								case MARKET(_):
									MARKET(0);
								case BANK(_):
									BANK(0);
								case FARM(_):
									FARM(0);
								case BARN(_):
									BARN(0);
								case BARRACKS(_):
									BARRACKS(0);
								case HOME(_):
									HOME(0);
								case EXPLORE(_):
									EXPLORE(0);
								case WALL(_):
									WALL(0);
								case SIEGEFACTORY(_):
									SIEGEFACTORY(0);
								case ACADEMY(_):
									ACADEMY(0);
							}
							a.type = resetBuild;
						}
						player.money += attachSellValue * 0.8;
						// 收回資源格子資源
						player.money += g.money * 0.8;
						player.army += g.army * 0.8;
						player.food += g.food * 0.8;
						g.money = 0;
						g.army = 0;
						g.food = 0;
						// 抽離武將
						final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == g.id);
						for (p in peopleInGrid) {
							p.position.gridId = null;
						}
						ctx.events.push(MESSAGE_EVENT({
							title: '${player.name}沒有資源, 不得不賣格子',
							msg: '${g.name}被賣掉了'
						}, getGameInfo(ctx, false)));
						if (player.money >= 0 && player.food >= 0 && player.army >= 0) {
							break;
						}
					}
				}

				if (player.money < 0 || player.food < 0 || player.army < 0) {
					final playerPeople = ctx.peoples.filter(p -> p.belongToPlayerId == player.id);
					// 從小開始賣
					playerPeople.sort((a, b) -> {
						final ac = a.cost * a.exp;
						final bc = b.cost * b.exp;
						return Std.int(ac) - Std.int(bc);
					});
					for (p in playerPeople) {
						final value = p.cost / 10;
						player.money += value;
						player.army += value;
						player.food += value;
						p.belongToPlayerId = null;
						p.position.gridId = null;
						ctx.events.push(MESSAGE_EVENT({
							title: '${player.name}沒有資源, 不能不賣武將',
							msg: '${p.name}被賣掉了'
						}, getGameInfo(ctx, false)));
						if (player.money >= 0 && player.food >= 0 && player.army >= 0) {
							break;
						}
					}
				}
				final targetPlayerId = getGridBelongPlayerId(ctx, grid.id);
				if (targetPlayerId != null) {
					final targetPlayer = ctx.players[targetPlayerId];
					// info("onPayTaxToGrid", "targetPlayer.name", targetPlayer.name);
					// info("onPayTaxToGrid", "targetPlayer.money", targetPlayer.money);
					// info("onPayTaxToGrid", "targetPlayer.food", targetPlayer.food);
					// info("onPayTaxToGrid", "targetPlayer.army", targetPlayer.army);
					// info("onPayTaxToGrid", "================");
					targetPlayer.money += taxMoney;
					targetPlayer.food += taxFood;
					targetPlayer.army += taxArmy;
					// info("onPayTaxToGrid", "targetPlayer.name", targetPlayer.name);
					// info("onPayTaxToGrid", "targetPlayer.money", targetPlayer.money);
					// info("onPayTaxToGrid", "targetPlayer.food", targetPlayer.food);
					// info("onPayTaxToGrid", "targetPlayer.army", targetPlayer.army);
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
		PAY_FOR_OVER_ENEMY_GRID(eventValue, getGameInfo(ctx, false), null);
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
		return a + p.cost + p.exp * 10;
	}, 0.0);
	final gridScore = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).length * 1000;
	final gridResourceScore = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).map(g -> {
		return g.army + g.food + g.money;
	}).fold((p, a:Float) -> {
		return a + p;
	}, 0.0);
	final attachScore = ctx.attachments.filter(a -> getGridBelongPlayerId(ctx, a.belongToGridId) == playerId).length * 300;
	final peopleLength = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).length;
	final base = Math.pow(peopleLength, 0.5) * 0.1;
	return base * ((resourceScore + gridResourceScore) * 3.0 + treasureScore + peopleScore + gridScore + attachScore);
}

// 玩家回合結束
function onPlayerEnd(ctx:Context, playerId:Int):Bool {
	if (playerId != ctx.currentPlayerId) {
		throw new haxe.Exception("現在不是你的回合，不能呼叫end");
	}
	// 算分, 判定勝負
	final player = getPlayerById(ctx, playerId);
	if (player.isLose == false) {
		player.score = getPlayerScore(ctx, player.id);
		player.isLose = {
			final playerScores = ctx.players.map(p -> p.score);
			final myScore = playerScores[playerId];
			playerScores.sort((a, b) -> Std.int(b * 100) - Std.int(a * 100));
			final maxScore = playerScores[0];
			final isLoseByScore = myScore <= (maxScore / 10.0);
			final isLoseByNoPeople = ctx.peoples.filter(p -> p.belongToPlayerId == player.id).length == 0;
			(isLoseByScore || isLoseByNoPeople);
		}
		if (player.isLose) {
			// 所有武將退出格子
			final peopleInLosePlayer = ctx.peoples.filter(p -> p.belongToPlayerId == player.id);
			for (p in peopleInLosePlayer) {
				p.position.gridId = null;
			}
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
					// 收到的有紅利
					player.army += earnArmy * 2;
					player.food += earnFood * 2;
					player.money += earnMoney * 2;
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
						// 移除原有建物
						ctx.attachments = ctx.attachments.filter(a -> a.belongToGridId != chooseGrid.id);
						//
						final buildings = BuildingList.filter(catelog -> {
							// 不使用
							// case _:
							// 強迫編譯器檢查
							return switch catelog.type {
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
		// 討厭度減輕
		for (player in ctx.players) {
			while (player.hate.length > 10) {
				player.hate.shift();
			}
			info("Alg", ["onPlayerEnd", "hate", player.name, player.hate]);
		}
		// 效果過期
		for (effect in ctx.effects) {
			if (effect.expireTurn == null) {
				continue;
			}
			ctx.effects = ctx.effects.filter(e -> {
				return effect.expireTurn > ctx.turn;
			});
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
	final player = getPlayerById(ctx, playerId);
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
		// 	info("onPlayerDice", "路障!!!", "grid", toGridId);
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
				info("onPlayerDice", ["路障!!!", "grid", toGridId]);
				break;
			}
		}
	}
	onPlayerGoToPosition(ctx, playerId, toGridId);
	player.memory.hasDice = true;
}
