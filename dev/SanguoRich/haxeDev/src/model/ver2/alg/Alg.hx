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

function initContext(ctx:Context, options:GameSetting) {
	info("initContext", options);
	if (false) {
		// 測試買寶
		final grid0:Grid = {
			final grid = getDefaultGrid();
			grid.defaultMaxMoney = 1000;
			grid;
		}
		ctx.grids = [grid0];
		final player0 = {
			final player = getDefaultPlayer();
			player.memory.hasDice = true;
			player.money = 1000;
			player;
		};
		final player1 = {
			final player = getDefaultPlayer();
			player.id = 1;
			player;
		};
		ctx.players = [player0, player1];
		final people0 = {
			final tmp = getDefaultPeople();
			tmp.belongToPlayerId = player1.id;
			tmp.position.gridId = grid0.id;
			tmp;
		}
		ctx.peoples = [people0];
		final treasure0 = {
			final tmp = getDefaultTreasure();
			tmp.belongToPlayerId = null;
			tmp.position.gridId = 0;
			tmp;
		}
		ctx.treasures = [treasure0];
		final firstAttachment = {
			final attach = getDefaultAttachment();
			attach.belongToGridId = 0;
			attach.type = TREASURE(1);
			attach;
		};
		ctx.attachments = [firstAttachment];
		return;
	}

	ctx.settings = options;
	final genGrids = model.GridGenerator.getInst()
		.getGrids(options.gridCount != null ? options.gridCount : INIT_GRID_COUNT, options.limitBuilding, options.putong ? 0 : -1);
	for (grid in genGrids) {
		addGridInfo(ctx, grid, false);
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
			var pos = 0;
			for (i in 0...10) {
				pos = Std.int(Math.random() * genGrids.length);
				// 不重疊玩家
				if (playerPosSet.has(pos)) {
					continue;
				}
				// 避開機會與命運
				switch ctx.grids[pos].buildtype {
					case CHANCE | DESTINY | EMPTY:
						continue;
					case _:
				}
				break;
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
	// 建立總城
	if (options.startCity) {
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
			ctx.grids[player.position].buildtype = CITY;
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
		}
	}

	// 算分
	for (player in ctx.players) {
		if (player.isLose) {
			continue;
		}
		player.score = getPlayerScore(ctx, player.id);
	}
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
