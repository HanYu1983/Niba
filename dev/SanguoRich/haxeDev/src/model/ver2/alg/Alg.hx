package model.ver2.alg;

import model.GridGenerator;
import model.IModel;
import model.ver2.Config;
import model.ver2.Define;
import model.ver2.alg.Nego;
import model.ver2.alg.War;

using Lambda;

// 玩家回合結束
function doPlayerEnd(ctx:Context) {
	ctx.actions = [];
	ctx.events = [];
	// 四個玩家走完後才計算回合
	final isTurnEnd = ctx.currentPlayerId == (ctx.players.length - 1);
	if (isTurnEnd) {
		// 先假設每回合回體力
		{
			final enable = ctx.turn > 0 && ctx.turn % 1 == 0;
			// 回體力
			for (people in ctx.peoples) {
				people.energy += PEOPLE_ENERGY_SUPPLY_BASE + people.energy * PEOPLE_ENERGY_SUPPLY_SAVE_FACTOR;
				if (people.energy > 100) {
					people.energy = 100;
				}
			}
		}
		// 支付薪水
		{
			final enable = ctx.turn > 0 && ctx.turn % PLAYER_EARN_PER_TURN == 0;
			if (enable) {
				trace("ModelVer2", "doPlayerEnd", "支付薪水");
				final worldEventValue = {
					playerBefore: ctx.players.map(p -> getPlayerInfo(ctx, p)),
					playerAfter: ([] : Array<model.IModel.PlayerInfo>),
					gridBefore: ctx.grids.map(g -> getGridInfo(ctx, g)),
					gridAfter: ([] : Array<model.GridGenerator.Grid>),
				}
				// 玩家
				for (player in ctx.players) {
					// 支付武將的薪水
					{
						player.money -= getMaintainPeople(ctx, player.id);
						if (player.money < 0) {
							player.money = 0;
						}
					}
					// 吃食物
					{
						player.food -= getMaintainArmy(ctx, player.id);
						if (player.food < 0) {
							player.food = 0;
						}
					}
				}
				worldEventValue.playerAfter = ctx.players.map(p -> getPlayerInfo(ctx, p));
				worldEventValue.gridAfter = ctx.grids.map(g -> getGridInfo(ctx, g));
				if(SHOW_POPUP_WHEN_EARN) ctx.events.push(Event.WORLD_EVENT(worldEventValue));
			}
		}
		// 格子成長
		{
			final enable = ctx.turn > 0 && ctx.turn % GRID_EARN_PER_TURN == 0;
			if (enable) {
				trace("ModelVer2", "doPlayerEnd", "格子成長");
				for (grid in ctx.grids) {
					final peopleInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
					// 沒武將的格子不成長
					if (peopleInGrid.length == 0) {
						continue;
					}
					final totalPeopleIntelligence = peopleInGrid.fold((p, a) -> {
						return a + p.intelligence;
					}, 0.0);
					final totalPeoplePolitical = peopleInGrid.fold((p, a) -> {
						return a + p.political;
					}, 0.0);
					final totalPeoplecharm = peopleInGrid.fold((p, a) -> {
						return a + p.charm;
					}, 0.0);
					final factor1 = 1 / (peopleInGrid.length * 100);
					// 城池成長
					grid.money += grid.money * grid.moneyGrow * (totalPeoplePolitical * factor1) + BASIC_GROW_MONEY;
					grid.food += grid.food * grid.foodGrow * (totalPeopleIntelligence * factor1) + BASIC_GROW_FOOD;
					grid.army += grid.army * grid.armyGrow * (totalPeoplecharm * factor1) + BASIC_GROW_ARMY;
				}
			}
		}
		// 收稅
		{
			final enable = ctx.turn > 0 && ctx.turn % PLAYER_EARN_FROM_CITY_PER_TURN == 0;
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
				ctx.events.push(Event.WORLD_EVENT(worldEventValue));
			}
			// 收稅時計算友好度
			if (enable) {
				for (grid in ctx.grids) {
					for (playerId in 0...ctx.players.length) {
						grid.favor[playerId] = switch grid.favor[playerId] {
							case favor if (favor < 0):
								Std.int(Math.max(favor - 1, MIN_GRID_FAVOR));
							case favor if (favor > 0):
								Std.int(Math.min(favor + 1, MAX_GRID_FAVOR));
							case favor:
								favor;
						}
					}
				}
			}
		}
		// 下一回合
		ctx.turn += 1;
	}
	// 下一個玩家
	ctx.currentPlayerId = (ctx.currentPlayerId + 1) % ctx.players.length;
}

function doPlayerDice(ctx:Context) {
	final activePlayerId = ctx.currentPlayerId;
	final player = ctx.players[activePlayerId];
	final fromGridId = player.position;
	final moveStep = Math.floor(Math.random() * 6) + 1;
	final toGridId = (fromGridId + moveStep) % ctx.grids.length;
	player.position = toGridId;
	ctx.actions = [
		Action.MOVE({
			playerId: activePlayerId,
			fromGridId: fromGridId,
			toGridId: toGridId
		}, getGameInfo(ctx, false))
	];
	final toGrid = ctx.grids[toGridId];
	ctx.events = [
		Event.WALK_STOP({
			grid: getGridInfo(ctx, toGrid),
			commands: [],
		})
	];
}

function initContext(ctx:Context, option:{}) {
	final genGrids = model.GridGenerator.getInst().getGrids(30);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	var i = 0;
	// for (name in ["vic", "han", "xiao", "any"]) {
	for (name in ["劉備", "曹操"]) {
		addPlayerInfo(ctx, {
			id: i++,
			name: name,
			money: 500.0,
			army: 500.0,
			food: 500.0,
			strategy: 300.0,
			people: [
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate(),
				model.PeopleGenerator.getInst().generate()
			],
			maintainPeople: 0,
			maintainArmy: 0,
			atGridId: 0,
			grids: []
		});
	}
}
