package model.ver2.alg;

import tool.Debug;
import model.TreasureGenerator;
import model.GridGenerator;
import model.IModel;
import model.Config;
import model.ver2.Define;
import model.ver2.alg.Brain;
import model.ver2.alg.Alg;
import model.ver2.alg.AlgGrid;
import model.ver2.alg.AlgPeople;

using Lambda;

// 玩家回合結束
function doPlayerEnd(ctx:Context) {
	info("doPlayerEnd", "start");
	final isContinue = onPlayerEnd(ctx, ctx.currentPlayerId);
	if (isContinue) {
		final nextPlayer = ctx.players[ctx.currentPlayerId];
		if (nextPlayer.brain != null) {
			doBrain(ctx, nextPlayer.id);
			// try {
			// 	doBrain(ctx, nextPlayer.id);
			// } catch (e:Any) {
			// 	warn("doPlayerEnd", ["doPlayerEnd catch", e]);
			// }
		}
	}
	info("doPlayerEnd", "done");
}

function doPlayerDice(ctx:Context) {
	onPlayerDice(ctx, ctx.currentPlayerId);
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

function onPlayerGoToPosition(ctx:Context, playerId:Int, toGridId:Int) {
	final player = getPlayerById(ctx, playerId);
	final toGrid = ctx.grids[toGridId];
	final toGridBelongPlayerId = getGridBelongPlayerId(ctx, toGrid.id);
	final fromGridId = player.position;
	player.position = toGridId;
	if (fromGridId != toGridId) {
		// 移動動畫
		ctx.events.push(ANIMATION_EVENT_MOVE({
			playerId: playerId,
			fromGridId: fromGridId,
			toGridId: toGridId
		}, getGameInfo(ctx, false)));
	}
	// 過路費
	final isStopAtEnemyGrid = toGridBelongPlayerId != null && toGridBelongPlayerId != player.id;
	if (isStopAtEnemyGrid) {
		onPayTaxToGrid(ctx, player.id, toGrid.id);
	}
	switch toGrid.buildtype {
		case CHANCE:
			// 機會就是跳類似大發利市，民兵等
			verbose("onPlayerGoToPosition", '${player.name}走到機會');
			switch Math.random() {
				case v if (v < 0.9):
					verbose("onPlayerGoToPosition", '發生量產事件');
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY);
					if (gridsWillGrow.length > 0) {
						final chooseId = Std.int(Math.random() * gridsWillGrow.length);
						final chooseGrid = gridsWillGrow[chooseId];
						switch Math.random() {
							case v if (v < 0.333):
								verbose("onPlayerGoToPosition", '產糧在${chooseGrid.name}');
								onGridGainFoodEvent(ctx, [chooseGrid]);
							case v if (v < 0.666):
								verbose("onPlayerGoToPosition", '產錢在${chooseGrid.name}');
								onGridGainMoneyEvent(ctx, [chooseGrid]);
							case _:
								verbose("onPlayerGoToPosition", '產兵在${chooseGrid.name}');
								onGridGainArmyEvent(ctx, [chooseGrid]);
						}
					} else {
						warn("onPlayerGoToPosition", '發生量產事件, 但沒有可以對應的格子');
					}
				case _:
					verbose("onPlayerGoToPosition", '發生異軍突起事件');
					final emptyGrids = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) == EMPTY);
					if (emptyGrids.length > 0) {
						final chooseId = Std.int(Math.random() * emptyGrids.length);
						final chooseGrid = emptyGrids[chooseId];
						verbose("onPlayerGoToPosition", '異軍突起在${chooseGrid.name}');
						onGridBornEvent(ctx, chooseGrid.id);
					} else {
						warn("onPlayerGoToPosition", '發生異軍突起事件, 但沒有可以對應的格子');
					}
			}
		case DESTINY:
			// 命運可以跳類似某個武將+體力，-體力，+功績，-功績之類的
			// 或者主公掉錢，意外之財等
			verbose("onPlayerGoToPosition", '${player.name}走到命運');
			switch Math.random() {
				case v if (v < 0.5):
					final value = 50;
					player.money = Math.max(0, player.money - value);
					ctx.events.push(MESSAGE_EVENT({
						title: "命運",
						msg: '${player.name}不小心掉了錢包, 損失${value}錢'
					}, getGameInfo(ctx, false)));
				case _:
					final value = 50;
					player.money = player.money + value;
					ctx.events.push(MESSAGE_EVENT({
						title: "命運",
						msg: '${player.name}撿到錢, 得到${value}錢'
					}, getGameInfo(ctx, false)));
			}
		case _:
	}
}

private function testOnPlayerGoToPositionChanceAndDestiny() {
	final ctx = getDefaultContext();
	final grid0 = {
		final tmp = getDefaultGrid();
		tmp.buildtype = CHANCE;
		tmp;
	}
	ctx.grids = [grid0];
	final player0 = {
		final tmp = getDefaultPlayer();
		tmp;
	}
	ctx.players = [player0];
	onPlayerGoToPosition(ctx, player0.id, grid0.id);
	if (ctx.events.length == 0) {
		throw new haxe.Exception("踩到機會必須有事件");
	}
	ctx.events = [];
	grid0.buildtype = DESTINY;
	onPlayerGoToPosition(ctx, player0.id, grid0.id);
	if (ctx.events.length == 0) {
		throw new haxe.Exception("踩到機會必須有事件");
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
								case TREASURE(level):
									[for (i in 0...level + 1) TREASURE(i)];
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
								case TREASURE(_):
									TREASURE(0);
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
		// 友好度減輕
		{
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
			final enable = false; // (ctx.turn + 1) % 1 == 0;
			if (enable) {
				//
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					onGridGainFoodEvent(ctx, gridsWillGrow);
				}
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					onGridGainMoneyEvent(ctx, gridsWillGrow);
				}
				if (true) {
					final gridsWillGrow = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) != EMPTY
						&& Math.random() < EVENT_GROW_FOOD_RATE);
					onGridGainArmyEvent(ctx, gridsWillGrow);
				}
				final isBorn = Math.random() < EVENT_GRID_BORN_RATE;
				if (isBorn) {
					final emptyGrids = ctx.grids.filter(g -> getGridBuildType(ctx, g.id) == EMPTY);
					if (emptyGrids.length > 0) {
						final chooseId = Std.int(Math.random() * emptyGrids.length);
						final chooseGrid = emptyGrids[chooseId];
						onGridBornEvent(ctx, chooseGrid.id);
					}
				}
			}
		}
		// 漁場, 獵場, 礦山, 寶物買賣事件
		{
			switch ([FISHING(1), HUNTING(1), MINE(1), TREASURE(1)] : Array<BUILDING>).map(type -> {
				final catelog = BuildingList.filter((catelog) -> Type.enumEq(catelog.type, type));
				if (catelog.length == 0) {
					throw new haxe.Exception('current.catelog找不到:${type}');
				}
				return catelog[0];
			}) {
				case [fishingCate, huntingCate, mineCate, treasureCate]:
					{
						final gridsBefore:Array<GridGenerator.Grid> = [];
						final gridsAfter:Array<GridGenerator.Grid> = [];
						for (attach in ctx.attachments) {
							switch attach.type {
								case FISHING(1):
									switch fishingCate.value {
										case {float: [successRate, gainAdd, gainRate]}:
											final success = Math.random() < successRate;
											if (success) {
												final grid = ctx.grids[attach.belongToGridId];
												final gainFood = gainAdd + grid.food * gainRate;
												gridsBefore.push(getGridInfo(ctx, grid));
												grid.food = Math.min(getGridMaxFood(ctx, grid.id), grid.food + gainFood);
												gridsAfter.push(getGridInfo(ctx, grid));
											}
										case _:
											throw new haxe.Exception("fishingCate.value not found");
									}
								case _:
									continue;
							}
						}
						if (gridsBefore.length > 0) {
							ctx.events.push(GRID_RESOURCE_EVENT({
								grids: [
									for (i in 0...gridsBefore.length)
										{
											gridBefore: gridsBefore[i],
											gridAfter: gridsAfter[i]
										}
								],
								describtion: "漁場大量收穫糧草"
							}, getGameInfo(ctx, false)));
						}
					}
					{
						final gridsBefore:Array<GridGenerator.Grid> = [];
						final gridsAfter:Array<GridGenerator.Grid> = [];
						for (attach in ctx.attachments) {
							switch attach.type {
								case HUNTING(1):
									switch huntingCate.value {
										case {float: [successRate, gainAdd]}:
											final belongToPlayerId = getGridBelongPlayerId(ctx, attach.belongToGridId);
											if (belongToPlayerId != null) {
												final peopleInPlayer = ctx.peoples.filter(p -> p.belongToPlayerId == belongToPlayerId);
												var hasSuccess = false;
												for (p in peopleInPlayer) {
													final success = Math.random() < successRate;
													if (success) {
														hasSuccess = success;
														p.exp += gainAdd;
													}
												}
												// 象徵性回傳
												if (hasSuccess) {
													final grid = ctx.grids[attach.belongToGridId];
													gridsBefore.push(getGridInfo(ctx, grid));
													gridsAfter.push(getGridInfo(ctx, grid));
												}
											} else {
												warn("onPlayerEnd", ["正在計算打獵, 但格子沒有主公", attach.belongToGridId]);
											}
										case _:
											throw new haxe.Exception("fishingCate.value not found");
									}
								case _:
									continue;
							}
						}
						if (gridsBefore.length > 0) {
							ctx.events.push(GRID_RESOURCE_EVENT({
								grids: [
									for (i in 0...gridsBefore.length)
										{
											gridBefore: gridsBefore[i],
											gridAfter: gridsAfter[i]
										}
								],
								describtion: "狩獵成功"
							}, getGameInfo(ctx, false)));
						}
					}
					{
						final gridsBefore:Array<GridGenerator.Grid> = [];
						final gridsAfter:Array<GridGenerator.Grid> = [];
						for (attach in ctx.attachments) {
							switch attach.type {
								case MINE(1):
									switch mineCate.value {
										case {float: [successRate, gainAdd, gainRate]}:
											final success = Math.random() < successRate;
											if (success) {
												final grid = ctx.grids[attach.belongToGridId];
												final gainMoney = gainAdd + grid.food * gainRate;
												gridsBefore.push(getGridInfo(ctx, grid));
												grid.money = Math.min(getGridMaxMoney(ctx, grid.id), grid.money + gainMoney);
												gridsAfter.push(getGridInfo(ctx, grid));
											}
										case _:
											throw new haxe.Exception("mineCate.value not found");
									}
								case _:
									continue;
							}
						}
						if (gridsBefore.length > 0) {
							ctx.events.push(GRID_RESOURCE_EVENT({
								grids: [
									for (i in 0...gridsBefore.length)
										{
											gridBefore: gridsBefore[i],
											gridAfter: gridsAfter[i]
										}
								],
								describtion: "採礦成功"
							}, getGameInfo(ctx, false)));
						}
					}
					{
						final gridsBefore:Array<GridGenerator.Grid> = [];
						final gridsAfter:Array<GridGenerator.Grid> = [];
						for (attach in ctx.attachments) {
							switch attach.type {
								case TREASURE(1):
									switch treasureCate.value {
										case {float: [successRate, maxCount]}:
											final success = Math.random() < successRate;
											if (success) {
												final grid = ctx.grids[attach.belongToGridId];
												final treasuresInGrid = ctx.treasures.filter(t -> t.position.gridId == attach.belongToGridId);
												if (treasuresInGrid.length < maxCount) {
													final belongToPlayerId = getGridBelongPlayerId(ctx, attach.belongToGridId);
													if (belongToPlayerId != null) {
														gridsBefore.push(getGridInfo(ctx, grid));
														addTreasureInfo(ctx, belongToPlayerId, grid.id, null, TreasureGenerator.getInst().generator());
														gridsAfter.push(getGridInfo(ctx, grid));
													} else {
														warn("onPlayerEnd", ["寶物所要將要產寶,但格子沒有主公", attach.belongToGridId]);
													}
												} else {
													warn("onPlayerEnd", ["寶物所要將要產寶, 但寶物數量已達上限", attach.belongToGridId]);
												}
											}
										case _:
											throw new haxe.Exception("mineCate.value not found");
									}
								case _:
									continue;
							}
						}
						if (gridsBefore.length > 0) {
							ctx.events.push(GRID_RESOURCE_EVENT({
								grids: [
									for (i in 0...gridsBefore.length)
										{
											gridBefore: gridsBefore[i],
											gridAfter: gridsAfter[i]
										}
								],
								describtion: "挖寶成功"
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
			info("onPlayerEnd", ["hate", player.name, player.hate]);
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

function test() {
	testOnPlayerGoToPositionChanceAndDestiny();
}