package model.ver2;

import model.GridGenerator;
import model.IModel;
import model.ver2.Config;
import model.ver2.Define;

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
				ctx.events.push(Event.WORLD_EVENT(worldEventValue));
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

function initContext(ctx:Context, option:{}) {
	final genGrids = model.GridGenerator.getInst().getGrids(30);
	for (grid in genGrids) {
		addGridInfo(ctx, grid);
	}
	var i = 0;
	// for (name in ["vic", "han", "xiao", "any"]) {
	for (name in ["vic", "han"]) {
		addPlayerInfo(ctx, {
			id: i++,
			name: name,
			money: 300.0,
			army: 300.0,
			food: 300.0,
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

function getPeopleById(ctx:Context, id:Int):People {
	final find = ctx.peoples.filter(p -> p.id == id);
	if (find.length == 0) {
		throw new haxe.Exception('people not found: ${id}');
	}
	return find[0];
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

// =================================
// 交涉
// 向城池奪取%資源
// =================================
// 稅收
// 主公會得到所有城池的成數
// =========================================
// config
// 以下的方法都不定義回傳的類型, 因為是動態設計, 做到哪想到哪
// 每一個回傳都是依靠編譯器的類型推理
// 所以可以把回傳最多欄位的放在case的第1個, 讓編譯器告訴你其它的回傳少了哪些欄位
// =========================================
// 交涉計算
// 參與能力為:7良官
function getNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	// 使用switch達成策略模式
	// 0代表預設的隨意實作
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(id -> getPeopleById(ctx, id));
			return switch fightPeople {
				case [p1, p2]:
					// 用掉1/5的體力(最多20)
					// 體力越少效率越低
					final useEnergy = p1.energy / (100 / ENERGY_COST_ON_NEGO);
					// 使用20體力的情況下基礎值為0.5
					final base = getBase(useEnergy, ENERGY_COST_ON_NEGO, -.15);
					final intelligenceFactor = p1.intelligence / p2.intelligence;
					final politicalFactor = p1.political / p2.political;
					final charmFactor = p1.charm / p2.charm;
					// 良官加成(決定勝率)
					final abiFactor = p1.abilities.has(7) ? 1.5 : 1;
					final rate = base * intelligenceFactor * politicalFactor * charmFactor * abiFactor;

					// 商才，務農，徵兵分別可以提高獲得數量
					final gainRate = 0.05 * rate + .1;
					{
						playerCost: {
							id: playerId,
							army: ENABLE_NEGO_ARMY ? grid.army * (gainRate + (p1.abilities.has(11) ? .05 : 0)) : 0.0,
							money: grid.money * (gainRate + (p1.abilities.has(4) ? .05 : 0)),
							food: grid.food * (gainRate + (p1.abilities.has(5) ? .05 : 0))
						},
						peopleCost: {
							id: p1.id,
							energy: useEnergy,
						},
						successRate: rate
					};
				case _:
					throw new haxe.Exception("fightPeople not right");
			}
		case 1:
			// 版本1
			{
				playerCost: {
					id: 0,
					army: 0.0,
					money: 0.0,
					food: 0.0,
				},
				peopleCost: {
					id: 0,
					energy: 0.0,
				},
				successRate: 0.0,
			}
		case _:
			throw new haxe.Exception("not impl");
	}
}

function doGetTakeNegoPreview(ctx:Context, playerId:Int, gridId:Int):NegoPreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

function doGetPreResultOfNego(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnNego {
	final player = ctx.players[playerId];
	final people = getPeopleById(ctx, peopleId);
	final negoCost = getNegoCost(ctx, playerId, gridId, peopleId, inviteId);
	final totalArmy = ctx.grids.filter(g -> getGridBelongPlayerId(ctx, g.id) == playerId).fold((p, a) -> {
		return a + p.army;
	}, 0.0) + ctx.players[playerId].army;
	return {
		energyBefore: Std.int(people.energy),
		energyAfter: Std.int(people.energy - negoCost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army + negoCost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money + negoCost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food + negoCost.playerCost.food),
		maintainFoodBefore: getMaintainArmy(ctx, playerId),
		maintainFoodAfter: getMaintainArmyPure(totalArmy + negoCost.playerCost.army),
		successRate: negoCost.successRate
	};
}

function doTakeNegoOn(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final grid = ctx.grids[gridId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
		favorBefore: grid.favor[playerId],
		favorAfter: grid.favor[playerId],
	}
	final success = applyNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	resultValue.favorAfter = grid.favor[playerId];
	ctx.events = [Event.NEGOTIATE_RESULT(resultValue)];
}

function applyNegoCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getNegoCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	final grid = ctx.grids[gridId];
	people.energy -= Std.int(negoCost.peopleCost.energy);
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		// 降低友好度
		final isHateYou = Math.random() < NEGO_HATE_RATE;
		if (isHateYou) {
			grid.favor[playerId] = Std.int(Math.max(grid.favor[playerId] - 1, MIN_GRID_FAVOR));
		}
		return false;
	}
	// 城池被搶奪
	grid.army -= negoCost.playerCost.army;
	if (grid.army < 0) {
		grid.army = 0;
	}
	grid.money -= negoCost.playerCost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food -= negoCost.playerCost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	// 玩家搶奪
	final player = ctx.players[playerId];
	player.army += negoCost.playerCost.army;
	player.money += negoCost.playerCost.money;
	player.food += negoCost.playerCost.food;
	// 提升友好度
	final isLikeYou = Math.random() < NEGO_LIKE_RATE;
	if (isLikeYou) {
		grid.favor[playerId] = Std.int(Math.min(grid.favor[playerId] + 1, MAX_GRID_FAVOR));
	}
	return true;
}

//
// 雇用計算
function getHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final fightPeople = [p1SelectId, p2SelectId].map(p -> getPeopleById(ctx, p));
			return switch fightPeople {
				case [p1, p2]:
					final useEnergy = p1.energy / (100 / ENERGY_COST_ON_HIRE);
					final base = getBase(useEnergy, ENERGY_COST_ON_HIRE, -.1);
					final charmFactor = p1.charm / p2.charm;
					// 人脈加成
					final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
					final rate = base * charmFactor * abiFactor;
					{
						playerCost: {
							id: playerId,
							money: p2.cost * PEOPLE_HIRE_COST_FACTOR
						},
						peopleCost: {
							id: p1.id,
							energy: useEnergy,
						},
						successRate: rate
					};
				case _:
					throw new haxe.Exception("fightPeople not right");
			}
		case _:
			throw new haxe.Exception("not impl");
	}
}

function doGetTakeHirePreview(ctx:Context, playerId:Int, gridId:Int):HirePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
		p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people,
	};
}

function doGetPreResultOfHire(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, inviteId:Int):PreResultOnHire {
	final player = ctx.players[playerId];
	final cost = getHireCost(ctx, playerId, gridId, peopleId, inviteId);
	final p1 = getPeopleById(ctx, peopleId);
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		return a + p.cost;
	}, 0.0) + p1.cost;
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		moneyBefore: player.money,
		moneyAfter: player.money - cost.playerCost.money,
		successRate: cost.successRate,
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

function doTakeHire(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final p2 = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	resultValue.success = success;
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.HIRE_RESULT(resultValue)];
}

function applyHireCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, p2SelectId:Int):Bool {
	final negoCost = getHireCost(ctx, playerId, gridId, p1SelectId, p2SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return false;
	}
	final hirePeople = getPeopleById(ctx, p2SelectId);
	final player = ctx.players[playerId];
	// 支付雇用費
	player.money -= negoCost.playerCost.money;
	if (player.money < 0) {
		player.money = 0;
	}
	// 將人變成主公的
	hirePeople.belongToPlayerId = playerId;
	// 將人移到玩家上
	hirePeople.position.player = true;
	// 從格子上移除人
	hirePeople.position.gridId = null;
	return true;
}

// =================================
// 探索
// ================================
// 探索計算
function getExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final useEnergy = p1.energy / (100 / ENERGY_COST_ON_EXPLORE);
			final base = getBase(useEnergy, ENERGY_COST_ON_EXPLORE, .1);
			final charmFactor = p1.charm / 100;
			// 人脈加成
			final abiFactor = p1.abilities.has(10) ? 1.5 : 1;
			final rate = base * charmFactor * abiFactor;
			return {
				playerCost: {
					id: playerId,
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				},
				successRate: rate
			};
		case _:
			throw new haxe.Exception("not impl");
	}
}

function _getTakeExplorePreview(ctx:Context, playerId:Int, gridId:Int):ExplorePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people
	};
}

function _getPreResultOfExplore(ctx:Context, playerId:Int, gridId:Int, peopleId:Int):PreResultOnExplore {
	final cost = getExploreCost(ctx, playerId, gridId, peopleId);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		successRate: cost.successRate
	}
}

function _takeExplore(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		peopleList: ([] : Array<model.PeopleGenerator.People>),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final newPeopleIds = applyExploreCost(ctx, playerId, gridId, p1SelectId);
	resultValue.success = newPeopleIds.length > 0;
	resultValue.peopleList = newPeopleIds.map(id -> getPeopleById(ctx, id)).map(p -> getPeopleInfo(ctx, p));
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.EXPLORE_RESULT(resultValue)];
}

function applyExploreCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int):Array<Int> {
	final negoCost = getExploreCost(ctx, playerId, gridId, p1SelectId);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	//
	final success = Math.random() < negoCost.successRate;
	if (success == false) {
		return [];
	}
	final newPeople = PeopleGenerator.getInst().generate();
	addPeopleInfo(ctx, null, gridId, newPeople);
	return [newPeople.id];
}

// =================================
// 佔領
// 派兵目前的設計是【糧食】消耗為主要，【金錢】次之或者不用消耗
// 攻擊方主要參數為【武力】及【智力】  	防守方主要參數為【統率】及【智力】
// 攻擊方影響能力[0,1,2,3]         	 防守方影響能力[0,1,2,3,8,9];
// 2022/4/26 測試到奇怪的現象，就是感覺就是强很多的武將，結果爲了打爆對方。糧食扣的比爛武將多。感覺很奇怪？
// =================================
function getWarCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, options:{occupy:Bool}) {
	var atkMoneyCost = 0.0;
	var atkFoodCost = 0.0;
	{
		final atkArmy = army1;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final fact1 = if (atkPeople.abilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact2 = if (atkPeople.abilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact3 = atkPeople.intelligence / 100;
		final base = atkArmy;
		final cost = base * fact1 * fact2 * fact3;
		atkMoneyCost = cost * WAR_MONEY_COST_FACTOR;
		atkFoodCost = cost * WAR_FOOD_COST_FACTOR;
	}
	var atkDamage = 0.0;
	var atkEnergyCost = 0.0;
	{
		final atkArmy = army1;
		final defArmy = army2;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final defPeople = getPeopleById(ctx, p2PeopleId);
		final currMoney = ctx.players[playerId].money;
		final currFood = ctx.players[playerId].food;
		final moneyCost = atkMoneyCost;
		final foodCost = atkFoodCost;
		final useEnergy = atkPeople.energy / (100 / ENERGY_COST_ON_WAR);
		final fact0 = useEnergy / ENERGY_COST_ON_WAR;
		final fact1 = (atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		final fact2 = if (atkPeople.abilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact3 = if (atkPeople.abilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact4 = if (atkPeople.abilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact5 = if (atkPeople.abilities.has(3)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact6 = atkPeople.force / defPeople.command;
		final fact7 = atkPeople.intelligence / defPeople.intelligence;
		final factMoney = if (currMoney - moneyCost < 0) (1.0 - (-1 * (currMoney - moneyCost) / moneyCost)) else 1.0;
		final factFood = if (currFood - foodCost < 0) (1.0 - (-1 * (currFood - foodCost) / foodCost)) else 1.0;
		final base = atkArmy;
		final damage = atkArmy * WAR_ARMY_FACTOR + base * fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * factMoney * factFood;
		atkDamage = damage * WAR_FINAL_DAMAGE_FACTOR;
		atkEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	var defMoneyCost = 0.0;
	var defFoodCost = 0.0;
	{
		final atkArmy = army2;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final fact1 = if (atkPeople.abilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact2 = if (atkPeople.abilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0;
		final fact3 = atkPeople.intelligence / 100;
		final base = atkArmy;
		final cost = base * fact1 * fact2 * fact3;
		defMoneyCost = cost * WAR_MONEY_COST_FACTOR;
		defFoodCost = cost * WAR_FOOD_COST_FACTOR;
	}
	var defDamage = 0.0;
	var defEnergyCost = 0.0;
	{
		final atkArmy = army2;
		final defArmy = army1;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final defPeople = getPeopleById(ctx, p1PeopleId);
		final currMoney = ctx.grids[gridId].money;
		final currFood = ctx.grids[gridId].food;
		final moneyCost = defMoneyCost;
		final foodCost = defFoodCost;
		final useEnergy = atkPeople.energy / (100 / ENERGY_COST_ON_WAR);
		final fact0 = useEnergy / ENERGY_COST_ON_WAR;
		final fact1 = (atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		final fact2 = if (atkPeople.abilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact3 = if (atkPeople.abilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact4 = if (atkPeople.abilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact5 = if (atkPeople.abilities.has(3)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact6 = if (atkPeople.abilities.has(8)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact7 = if (atkPeople.abilities.has(9)) WAR_FRONT_ABILITY_FACTOR else 1.0;
		final fact8 = atkPeople.command / defPeople.force;
		final fact9 = atkPeople.intelligence / defPeople.intelligence;
		final factMoney = if (currMoney - moneyCost < 0) (1.0 - (-1 * (currMoney - moneyCost) / moneyCost)) else 1.0;
		final factFood = if (currFood - foodCost < 0) (1.0 - (-1 * (currFood - foodCost) / foodCost)) else 1.0;
		final base = if (options.occupy) atkArmy * WAR_DEFFENDER_FACTOR else 1.0;
		final damage = atkArmy * WAR_ARMY_FACTOR + base * fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * fact8 * fact9 * factMoney * factFood;
		defDamage = damage * WAR_FINAL_DAMAGE_FACTOR;
		defEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	return {
		playerCost: [
			{
				id: (playerId : Null<Int>),
				army: Math.min(defDamage, army1),
				money: atkMoneyCost,
				food: atkFoodCost,
			},
			{
				id: getGridBelongPlayerId(ctx, gridId),
				army: Math.min(atkDamage, army2),
				money: defMoneyCost,
				food: defFoodCost,
			}
		],
		peopleCost: [
			{
				id: p1PeopleId,
				energy: atkEnergyCost,
			},
			{
				id: p2PeopleId,
				energy: defEnergyCost,
			}
		],
		success: options.occupy ? ((ctx.grids[gridId].army - atkDamage) <= 0) : (atkDamage > defDamage)
	}
}

function _getTakeWarPreview(ctx:Context, playerId:Int, gridId:Int):WarPreview {
	final grid = ctx.grids[gridId];
	if (grid.buildtype == BUILDING.EMPTY) {
		throw new haxe.Exception("空地不能攻擊");
	}
	final gridBelongPlayerId = getGridBelongPlayerId(ctx, gridId);
	return switch gridBelongPlayerId {
		case null:
			{
				p1: getPlayerInfo(ctx, ctx.players[playerId]),
				p2: {
					id: grid.id,
					name: 'grid${gridId}',
					money: grid.money,
					food: grid.food,
					army: grid.army,
					strategy: 0,
					people: ctx.peoples.filter(p -> p.position.gridId == gridId).map(p -> getPeopleInfo(ctx, p)),
					atGridId: gridId,
					maintainArmy: 0,
					maintainPeople: 0,
					grids: []
				},
				p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
				p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people
			};
		case _:
			final gridPlayer = ctx.players[gridBelongPlayerId];
			{
				p1: getPlayerInfo(ctx, ctx.players[playerId]),
				p2: getPlayerInfo(ctx, gridPlayer),
				p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people,
				p2ValidPeople: getGridInfo(ctx, ctx.grids[gridId]).people
			};
	}
}

function _getPreResultOfWar(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float,
		options:{occupy:Bool}):Array<PreResultOnWar> {
	return switch getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, options) {
		case {playerCost: [playerCost1, playerCost2], peopleCost: [peopleCost1, peopleCost2]}:
			final player1 = ctx.players[playerId];
			final grid = ctx.grids[gridId];
			final people1 = getPeopleById(ctx, p1PeopleId);
			final people2 = getPeopleById(ctx, p2PeopleId);
			[
				{
					energyBefore: Std.int(people1.energy),
					energyAfter: Std.int(people1.energy - peopleCost1.energy),
					armyBefore: Std.int(player1.army),
					armyAfter: Std.int(player1.army - playerCost1.army),
					moneyBefore: Std.int(player1.money),
					moneyAfter: Std.int(player1.money - playerCost1.money),
					foodBefore: Std.int(player1.food),
					foodAfter: Std.int(player1.food - playerCost1.food),
					maintainFoodBefore: 0,
					maintainFoodAfter: 0,
				},
				{
					energyBefore: Std.int(people2.energy),
					energyAfter: Std.int(people2.energy - peopleCost2.energy),
					armyBefore: Std.int(grid.army),
					armyAfter: Std.int(grid.army - playerCost2.army),
					moneyBefore: Std.int(grid.money),
					moneyAfter: Std.int(grid.money - playerCost2.money),
					foodBefore: Std.int(grid.food),
					foodAfter: Std.int(grid.food - playerCost2.food),
					maintainFoodBefore: 0,
					maintainFoodAfter: 0,
				}
			];
		case _:
			throw new haxe.Exception("getWarCost not match");
	}
}

function _takeWarOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
	final people1 = getPeopleById(ctx, p1PeopleId);
	final people2 = getPeopleById(ctx, p2PeopleId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, people1),
		energyBefore: people1.energy,
		energyAfter: people1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	final success = applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: true});
	resultValue.success = success;
	resultValue.energyAfter = people1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.WAR_RESULT(resultValue)];
}

function applyWarCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float, options:{occupy:Bool}):Bool {
	switch getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, options) {
		case {playerCost: [playerCost1, playerCost2], peopleCost: [peopleCost1, peopleCost2], success: success}:
			// 無論成功或失敗武將先消體力
			final people = getPeopleById(ctx, p1PeopleId);
			if (people.energy < peopleCost1.energy) {
				throw new haxe.Exception('people.energy ${people.energy} < ${peopleCost1.energy}');
			}
			final people2 = getPeopleById(ctx, p2PeopleId);
			if (people2.energy < peopleCost2.energy) {
				throw new haxe.Exception('people.energy ${people2.energy} < ${peopleCost2.energy}');
			}
			people.energy -= peopleCost1.energy;
			if (people.energy < 0) {
				people.energy = 0;
			}
			people2.energy -= peopleCost2.energy;
			if (people2.energy < 0) {
				people2.energy = 0;
			}
			//
			final player = ctx.players[playerId];
			player.money -= playerCost1.money;
			if (player.money < 0) {
				player.money = 0;
			}
			player.food -= playerCost1.food;
			if (player.food < 0) {
				player.food = 0;
			}
			player.army -= playerCost1.army;
			if (player.army < 0) {
				player.army = 0;
			}

			final grid = ctx.grids[gridId];
			grid.money -= playerCost2.money;
			if (grid.money < 0) {
				grid.money = 0;
			}
			grid.food -= playerCost2.food;
			if (grid.food < 0) {
				grid.food = 0;
			}
			grid.army -= playerCost2.army;
			if (grid.army < 0) {
				grid.army = 0;
			}
			if (options.occupy) {
				if (success) {
					// 沒有進駐的話, 自動進駐
					if (people.position.gridId == null) {
						people.position.gridId = gridId;
					}
					// 回到主公身上或解散
					people2.position.gridId = null;

					// 體力減半
					people2.energy *= 0.5;
				}
			} else {
				//
			}
			// 友好度
			if (options.occupy) {
				grid.favor[playerId] = MIN_GRID_FAVOR;
			} else {
				// 先減1
				grid.favor[playerId] = Std.int(Math.max(grid.favor[playerId] - 1, MIN_GRID_FAVOR));
				// 額外再減
				final isHateYou = Math.random() < SNATCH_HATE_RATE;
				if (isHateYou) {
					grid.favor[playerId] = Std.int(Math.max(grid.favor[playerId] - 1, MIN_GRID_FAVOR));
				}
			}
			return success;
		case _:
			throw new haxe.Exception("getWarCost not match");
	}
}

// =================================
// 經商：加不定錢
// 買糧：扣固定錢加不定糧食
// 賣糧：扣固定糧加不定錢
// 徵兵：扣固定錢加不定兵
// 裁兵：扣固定兵加不定錢
// 2022/4/26 希望演算法可以把當前格子的資源量納入計算，資源越多，可以得到越多
// 2022/4/26 這個交易的資源也是會影響格子裏的資源量。就是經過交易后變少或變多
// =================================
// 經商買賣計算
// money:    ability 4
// food:     ability 5
// army:     ability 11
// strategy: ability 3
// 智力、政治、魅力也會影響最終數值
function getResourceCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	trace("MondelVer2", "getResourceCost", market, type);
	return switch 0 {
		case 0:
			final grid = ctx.grids[gridId];
			final p1 = getPeopleById(ctx, p1SelectId);
			final useEnergy = p1.energy / (100 / ENERGY_COST_ON_RESOURCE);
			final base = getBase(useEnergy, ENERGY_COST_ON_RESOURCE, -0.2);
			final abiFactor:Float = if (type == RESOURCE.MONEY && (p1.abilities.has(4))) {
				1.5;
			} else if (type == RESOURCE.ARMY && (p1.abilities.has(11))) {
				1.5;
			} else if (type == RESOURCE.FOOD && (p1.abilities.has(5))) {
				1.5;
			} else {
				1;
			};
			final attrFactor:Float = if (type == RESOURCE.MONEY) {
				(p1.political / 100) * .8 + (p1.intelligence / 100) * .1 + (p1.charm / 100) * .1 + (grid.money / 1000) * .1;
			} else if (type == RESOURCE.ARMY) {
				(p1.political / 100) * .1 + (p1.intelligence / 100) * .1 + (p1.charm / 100) * .8 + (grid.army / 1000) * .1;
			} else if (type == RESOURCE.FOOD) {
				(p1.political / 100) * .1 + (p1.intelligence / 100) * .8 + (p1.charm / 100) * .1 + (grid.food / 1000) * .1;
			} else {
				0;
			};
			final rate = (base + attrFactor) * abiFactor;
			final returnInfo = {
				playerCost: {
					id: playerId,
					money: 0.0,
					army: 0.0,
					food: 0.0,
					strategy: 0.0,
				},
				peopleCost: {
					id: p1.id,
					energy: useEnergy,
				}
			};
			switch [type, market] {
				case [MONEY, _]:
					returnInfo.playerCost.money = -1 * 100 * rate;
				case [ARMY, SELL]:
					final sellArmyCount = ARMY_PER_DEAL;
					returnInfo.playerCost.money = -1 * sellArmyCount * rate;
					returnInfo.playerCost.army = sellArmyCount;
				case [FOOD, SELL]:
					final sellFoodCount = FOOD_PER_DEAL;
					returnInfo.playerCost.money = -1 * sellFoodCount * rate;
					returnInfo.playerCost.food = sellFoodCount;
				case [ARMY, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					final gain = Math.min(moneyCost * rate, grid.army / 2);
					returnInfo.playerCost.money = moneyCost;
					returnInfo.playerCost.army = -gain;
				case [FOOD, BUY]:
					final moneyCost = MONEY_PER_DEAL;
					final gain = Math.min(moneyCost * rate, grid.food / 2);
					returnInfo.playerCost.money = moneyCost;
					returnInfo.playerCost.food = -gain;
				case _:
					throw new haxe.Exception('not support: ${type} ${market}');
			}
			return returnInfo;
		case _:
			throw new haxe.Exception("not impl");
	}
}

function _getTakeResourcePreview(ctx:Context, playerId:Int, gridId:Int, market:MARKET, type:RESOURCE):ResourcePreview {
	return {
		p1ValidPeople: getPlayerInfo(ctx, ctx.players[playerId]).people
	};
}

function _getPreResultOfResource(ctx:Context, playerId:Int, gridId:Int, peopleId:Int, market:MARKET, type:RESOURCE):PreResultOnResource {
	final player = ctx.players[playerId];
	final cost = getResourceCost(ctx, playerId, gridId, peopleId, market, type);
	final p1 = getPeopleById(ctx, peopleId);
	return {
		energyBefore: Std.int(p1.energy),
		energyAfter: Std.int(p1.energy - cost.peopleCost.energy),
		armyBefore: Std.int(player.army),
		armyAfter: Std.int(player.army - cost.playerCost.army),
		moneyBefore: Std.int(player.money),
		moneyAfter: Std.int(player.money - cost.playerCost.money),
		foodBefore: Std.int(player.food),
		foodAfter: Std.int(player.food - cost.playerCost.food),
		maintainFoodBefore: 0,
		maintainFoodAfter: 0,
	}
}

function _takeResource(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	final p1 = getPeopleById(ctx, p1SelectId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, p1),
		energyBefore: p1.energy,
		energyAfter: p1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	applyResourceCost(ctx, playerId, gridId, p1SelectId, market, type);
	resultValue.energyAfter = p1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.RESOURCE_RESULT(resultValue)];
}

function applyResourceCost(ctx:Context, playerId:Int, gridId:Int, p1SelectId:Int, market:MARKET, type:RESOURCE) {
	final negoCost = getResourceCost(ctx, playerId, gridId, p1SelectId, market, type);
	// 無論成功或失敗武將先消體力
	final people = getPeopleById(ctx, p1SelectId);
	if (people.energy < negoCost.peopleCost.energy) {
		throw new haxe.Exception('people.energy ${people.energy} < ${negoCost.peopleCost.energy}');
	}
	people.energy -= negoCost.peopleCost.energy;
	if (people.energy < 0) {
		people.energy = 0;
	}
	// 增加資源
	final player = ctx.players[playerId];
	player.money -= negoCost.playerCost.money;
	if (player.money < 0) {
		player.money = 0;
	}
	player.food -= negoCost.playerCost.food;
	if (player.food < 0) {
		player.food = 0;
	}
	player.army -= negoCost.playerCost.army;
	if (player.army < 0) {
		player.army = 0;
	}
	player.strategy -= negoCost.playerCost.strategy;
	if (player.strategy < 0) {
		player.strategy = 0;
	}
	// 減去資源
	final grid = ctx.grids[gridId];
	grid.money += negoCost.playerCost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food += negoCost.playerCost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	grid.army += negoCost.playerCost.army;
	if (grid.army < 0) {
		grid.army = 0;
	}
}

function _getPreResultOfFire(ctx:Context, playerId:Int, p1PeopleId:Int):PreResultOnFire {
	final totalPeopleCost = ctx.peoples.filter(p -> p.belongToPlayerId == playerId).fold((p, a) -> {
		if (p.id == p1PeopleId) {
			return a;
		}
		return a + p.cost;
	}, 0.0);
	return {
		maintainMoneyAfter: getMaintainPeoplePure(totalPeopleCost),
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
}

function _takeFire(ctx:Context, playerId:Int, p1PeopleId:Int) {
	final people = getPeopleById(ctx, p1PeopleId);
	final resultValue = {
		success: true,
		people: getPeopleInfo(ctx, people),
		maintainMoneyAfter: 0.0,
		maintainMoneyBefore: getMaintainPeople(ctx, playerId),
	}
	people.belongToPlayerId = null;
	people.position.gridId = ctx.players[playerId].position;
	resultValue.maintainMoneyAfter = getMaintainPeople(ctx, playerId);
	ctx.events = [Event.FIRE_RESULT(resultValue)];
}

// 可能不成的情況是
// 把已經有駐守在別的地方的武將派到這裡來
// 或者前端沒有派任何武將到這個格子上
function _checkValidTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid):Bool {
	for (people in gridInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		if (originPeople.position.gridId != null && originPeople.position.gridId != gridId) {
			trace("ModelVer2", "_checkValidTransfer", 'people(${people.id})已經被派駐在grid(${originPeople.position.gridId})');
			return false;
		}
	}
	return true;
}

function _takeTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		// 轉型後才能編譯器才知道要檢查null
		people: (null : Null<model.PeopleGenerator.People>),
		energyBefore: 0.0,
		energyAfter: 0.0,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	}
	applyTransfer(ctx, playerId, gridId, playerInfo, gridInfo);
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.RESOURCE_RESULT(resultValue)];
}

function applyTransfer(ctx:Context, playerId:Int, gridId:Int, playerInfo:model.IModel.PlayerInfo, gridInfo:model.GridGenerator.Grid) {
	final player = ctx.players[playerId];
	final grid = ctx.grids[gridId];
	player.food = playerInfo.food;
	player.army = playerInfo.army;
	player.money = playerInfo.money;
	grid.food = gridInfo.food;
	grid.army = gridInfo.army;
	grid.money = gridInfo.money;
	// 在同一格的情況, 離開城池
	for (people in playerInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		if (originPeople.position.gridId == gridId) {
			originPeople.position.gridId = null;
		}
	}
	// 進入城池
	for (people in gridInfo.people) {
		final originPeople = getPeopleById(ctx, people.id);
		originPeople.position.gridId = gridId;
	}
}

function _getTakeSnatchPreview(ctx:Context, playerId:Int, gridId:Int):SnatchPreview {
	final warPreview = _getTakeWarPreview(ctx, playerId, gridId);
	return {
		p1ValidPeople: warPreview.p1ValidPeople,
		p2ValidPeople: warPreview.p2ValidPeople,
		isP1ArmyValid: ctx.players[playerId].army >= SNATCH_ARMY_AT_LEAST,
		isP2ArmyValid: ctx.grids[gridId].army >= SNATCH_ARMY_AT_LEAST,
	};
}

function _getPreResultOfSnatch(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int):PreResultOnSnatch {
	final army1 = Math.min(ctx.players[playerId].army, SNATCH_ARMY_AT_LEAST);
	final army2 = Math.min(ctx.grids[gridId].army, SNATCH_ARMY_AT_LEAST);
	final cost = getSnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	final preResultOnSnatch = {
		war: _getPreResultOfWar(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false}),
		money: cost.money,
		food: cost.food,
	}
	// js.Browser.console.log(preResultOnSnatch);
	return preResultOnSnatch;
}

function getSnatchCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
	final warCost = getWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false});
	final negoCost = getNegoCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId);
	final grid = ctx.grids[gridId];
	return {
		warCost: warCost,
		money: warCost.success ? Math.min(negoCost.playerCost.money * 3, grid.money) : 0.0,
		food: warCost.success ? Math.min(negoCost.playerCost.food * 3, grid.food) : 0.0,
		success: warCost.success
	}
}

function applySnatchCost(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float):Bool {
	applyWarCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: false});
	final cost = getSnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	if (cost.success == false) {
		return false;
	}
	final grid = ctx.grids[gridId];
	grid.money -= cost.money;
	if (grid.money < 0) {
		grid.money = 0;
	}
	grid.food -= cost.food;
	if (grid.food < 0) {
		grid.food = 0;
	}
	final player = ctx.players[playerId];
	player.money += cost.money;
	player.food += cost.food;
	return true;
}

function _takeSnatchOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int) {
	final people1 = getPeopleById(ctx, p1PeopleId);
	final people2 = getPeopleById(ctx, p2PeopleId);
	final player = ctx.players[playerId];
	final resultValue = {
		success: false,
		people: getPeopleInfo(ctx, people1),
		energyBefore: people1.energy,
		energyAfter: people1.energy,
		armyBefore: player.army,
		armyAfter: player.army,
		moneyBefore: player.money,
		moneyAfter: player.money,
		foodBefore: player.food,
		foodAfter: player.food,
	};
	final army1 = Math.min(ctx.players[playerId].army, SNATCH_ARMY_AT_LEAST);
	final army2 = Math.min(ctx.grids[gridId].army, SNATCH_ARMY_AT_LEAST);
	final success = applySnatchCost(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2);
	resultValue.success = success;
	resultValue.energyAfter = people1.energy;
	resultValue.armyAfter = player.army;
	resultValue.moneyAfter = player.money;
	resultValue.foodAfter = player.food;
	ctx.events = [Event.SNATCH_RESULT(resultValue)];
}
