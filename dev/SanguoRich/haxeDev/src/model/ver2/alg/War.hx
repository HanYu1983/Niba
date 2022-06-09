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

// =================================
// 佔領
// 派兵目前的設計是【糧食】消耗為主要，【金錢】次之或者不用消耗
// 攻擊方主要參數為【武力】及【智力】  	防守方主要參數為【統率】及【智力】
// 攻擊方影響能力[0,1,2,3]         	 防守方影響能力[0,1,2,3,8,9];
// =================================
private function getWarCostImpl(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float,
		options:{occupy:Bool, debug:Bool}) {
	var atkMoneyCost = 0.0;
	var atkFoodCost = 0.0;
	{
		final atkArmy = army1;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final atkPeopleAbilities = getPeopleAbilities(ctx, atkPeople.id);
		final fact1 = getFact(if (atkPeopleAbilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0);
		final fact2 = getFact(if (atkPeopleAbilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0);
		final fact3 = factVery(factNot(getFact(getPeopleIntelligence(ctx, atkPeople.id) / 100.0)), 0.125);
		final rate = getFact(fact1 * fact2 * fact3);
		atkMoneyCost = atkArmy * WAR_MONEY_COST_FACTOR * rate;
		atkFoodCost = atkArmy * WAR_FOOD_COST_FACTOR * rate * getWarFoodCostRateByAttachment(ctx, playerId);
	}
	var atkDamage = 0.0;
	var atkEnergyCost = 0.0;
	{
		final atkArmy = army1;
		final defArmy = army2;
		final atkPeople = getPeopleById(ctx, p1PeopleId);
		final atkPeopleAbilities = getPeopleAbilities(ctx, atkPeople.id);
		final defPeople = getPeopleById(ctx, p2PeopleId);
		final defPeopleAbilities = getPeopleAbilities(ctx, defPeople.id);
		final currMoney = ctx.players[playerId].money;
		final currFood = ctx.players[playerId].food;
		final moneyCost = atkMoneyCost;
		final foodCost = atkFoodCost;
		final useEnergy = atkPeople.energy / (100 / ENERGY_COST_ON_WAR);
		final fact0 = getFact(useEnergy / ENERGY_COST_ON_WAR);
		// 包圍係數
		final fact1 = factVery(getFact(if (defArmy > 0) {
			(atkArmy + defArmy * WAR_HIGH_LOW_FACTOR) / (defArmy + defArmy * WAR_HIGH_LOW_FACTOR);
		} else {
			99999.0;
		}), 1.5);
		final fact2 = getFact(if (atkPeopleAbilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact3 = getFact(if (atkPeopleAbilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact4 = getFact(if (atkPeopleAbilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact5 = getFact({
			if (false) {
				if (atkPeopleAbilities.has(3)) {
					WAR_FRONT_ABILITY_FACTOR;
				} else {
					1.0;
				};
			} else {
				1.0;
			}
		});
		final fact6 = factVery(getFact(getPeopleForce(ctx, atkPeople.id) / getPeopleCommand(ctx, defPeople.id)), 1.0);
		final fact7 = getFact({
			if (false) {
				getPeopleIntelligence(ctx, atkPeople.id) / getPeopleIntelligence(ctx, defPeople.id);
			} else {
				1.0;
			}
		});
		final factWall = factNot(getFact(ctx.attachments.filter(a -> a.belongToGridId == gridId).fold((p, a) -> {
			return a * switch p.type {
				case WALL(level):
					return [1.0, 1.15, 1.35, 1.5][level];
				case _:
					1.0;
			}
		}, 1.0)));
		final factMoney = factVery(if (moneyCost == 0) {
			1.0;
		} else {
			Math.min(1, getFact(currMoney / moneyCost));
		}, 3.0);
		final factFood = factVery(if (foodCost == 0) {
			1.0;
		} else {
			Math.min(1, getFact(currFood / foodCost));
		}, 3.0);
		final factArmyTypeAtk = getFact(if (atkPeopleAbilities.has(0) && defPeopleAbilities.has(2)) {
			1.5;
		} else if (atkPeopleAbilities.has(1) && defPeopleAbilities.has(0)) {
			1.5;
		} else if (atkPeopleAbilities.has(2) && defPeopleAbilities.has(1)) {
			1.5;
		} else {
			1.0;
		});
		final factArmyTypeDef = getFact(if (defPeopleAbilities.has(0) && atkPeopleAbilities.has(2)) {
			1 / 1.5;
		} else if (defPeopleAbilities.has(1) && atkPeopleAbilities.has(0)) {
			1 / 1.5;
		} else if (defPeopleAbilities.has(2) && atkPeopleAbilities.has(1)) {
			1 / 1.5;
		} else {
			1.0;
		});
		final base = atkArmy * if (options.occupy) (1 / WAR_DEFFENDER_FACTOR) else 1;
		final baseDamage = atkArmy * WAR_ARMY_FACTOR;
		final damageFact = getFact(fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * factArmyTypeAtk * factArmyTypeDef * factWall * factMoney * factFood * WAR_FINAL_DAMAGE_FACTOR);
		final damageRate = damageFact;
		final damage = baseDamage + base * getZeroOneFromFact(damageRate) * getWarDamageRateByAttachment(ctx, playerId);
		if (options.debug) {
			// trace("attack =================");
			// trace("damageFact", damageFact, "=", fact0, fact1, fact2, fact3, fact4, fact5, fact6, fact7, factArmyTypeAtk, factArmyTypeDef);
			// trace("damageRate", damageRate, "=", damageFact, zeroOneMoney, zeroOneFood, zeroOneWall);
			// trace("damage", damage, "=", baseDamage, "+", base, "*", damageRate, WAR_FINAL_DAMAGE_FACTOR);
		}
		atkDamage = damage;
		atkEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	var defMoneyCost = 0.0;
	var defFoodCost = 0.0;
	{
		final atkArmy = army2;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final atkPeopleAbilities = getPeopleAbilities(ctx, atkPeople.id);
		final fact1 = getFact(if (atkPeopleAbilities.has(6)) WAR_BACK_ABILITY_FACTOR else 1.0);
		final fact2 = getFact(if (atkPeopleAbilities.has(7)) WAR_BACK_ABILITY_FACTOR else 1.0);
		final fact3 = factVery(factNot(getFact(getPeopleIntelligence(ctx, atkPeople.id) / 100.0)), 0.125);
		final rate = fact1 * fact2 * fact3;
		defMoneyCost = atkArmy * WAR_MONEY_COST_FACTOR * rate;
		defFoodCost = atkArmy * WAR_FOOD_COST_FACTOR * rate;
	}
	var defDamage = 0.0;
	var defEnergyCost = 0.0;
	{
		final atkArmy = army2;
		final defArmy = army1;
		final atkPeople = getPeopleById(ctx, p2PeopleId);
		final atkPeopleAbilities = getPeopleAbilities(ctx, atkPeople.id);
		final defPeople = getPeopleById(ctx, p1PeopleId);
		final currMoney = ctx.grids[gridId].money;
		final currFood = ctx.grids[gridId].food;
		final moneyCost = defMoneyCost;
		final foodCost = defFoodCost;
		final useEnergy = atkPeople.energy / (100 / ENERGY_COST_ON_WAR);
		final fact0 = getFact(useEnergy / ENERGY_COST_ON_WAR);
		// 防守方不計算包圍係數
		final fact1 = 1.0;
		final fact2 = getFact(if (atkPeopleAbilities.has(0)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact3 = getFact(if (atkPeopleAbilities.has(1)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact4 = getFact(if (atkPeopleAbilities.has(2)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact5 = getFact({
			if (false) {
				if (atkPeopleAbilities.has(3)) {
					WAR_FRONT_ABILITY_FACTOR;
				} else {
					1.0;
				};
			} else {
				1.0;
			}
		});
		final fact6 = getFact(if (options.occupy && atkPeopleAbilities.has(8)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact7 = getFact(if (options.occupy && atkPeopleAbilities.has(9)) WAR_FRONT_ABILITY_FACTOR else 1.0);
		final fact8 = factVery(getFact(getPeopleCommand(ctx, atkPeople.id) / getPeopleForce(ctx, defPeople.id)), 1.0);
		final fact9 = getFact({
			if (false) {
				getPeopleIntelligence(ctx, atkPeople.id) / getPeopleIntelligence(ctx, defPeople.id);
			} else {
				1.0;
			}
		});
		final factWall = getFact(ctx.attachments.filter(a -> a.belongToGridId == gridId).fold((p, a) -> {
			return a * switch p.type {
				case WALL(level):
					return [1.0, 1.15, 1.35, 1.5][level];
				case _:
					1.0;
			}
		}, 1.0));
		final factMoney = factVery(if (moneyCost == 0) {
			1.0;
		} else {
			Math.min(1, getFact(currMoney / moneyCost));
		}, 3.0);
		final factFood = factVery(if (foodCost == 0) {
			1.0;
		} else {
			Math.min(1, getFact(currFood / foodCost));
		}, 3.0);
		final base = atkArmy * if (options.occupy) WAR_DEFFENDER_FACTOR else 1;
		final baseDamage = atkArmy * WAR_ARMY_FACTOR;
		final damageFact = getFact(fact0 * fact1 * fact2 * fact3 * fact4 * fact5 * fact6 * fact7 * fact8 * fact9 * factWall * factMoney * factFood * WAR_FINAL_DAMAGE_FACTOR);
		final damageRate = damageFact;
		final damage = baseDamage + base * getZeroOneFromFact(damageRate);
		if (options.debug) {
			// trace("defend =================");
			// trace("damageFact", damageFact, "=", fact0, fact1, fact2, fact3, fact4, fact5, fact6, fact7, fact8, fact9, factWall);
			// trace("damageRate", damageRate, "=", damageFact, zeroOneMoney, zeroOneFood);
			// trace("damage", damage, "=", baseDamage, "+", base, "*", damageRate, WAR_FINAL_DAMAGE_FACTOR);
		}
		defDamage = damage;
		defEnergyCost = useEnergy * getEnergyFactor(atkArmy);
	}
	final success = (ctx.grids[gridId].army - atkDamage) <= 0 && ctx.players[playerId].army - defDamage >= 0;
	final findTreasureRate = if (options.occupy == false) {
		0.0;
	} else {
		if (getTreasureInGrid(ctx, gridId).length > 0) {
			if (success) {
				FIND_TREASURE_WHEN_WAR_SUCCESS_BASE_RATE;
			} else {
				0.0;
			}
		} else {
			0.0;
		}
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
		success: success,
		findTreasureRate: findTreasureRate,
	}
}

private function onWarCostImpl(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float,
		options:{occupy:Bool, warEvent:Bool}):Bool {
	final people1 = getPeopleById(ctx, p1PeopleId);
	final people2 = getPeopleById(ctx, p2PeopleId);
	final player = getPlayerById(ctx, playerId);
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
		gridId: gridId,
	}
	final success = {
		switch getWarCostImpl(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: options.occupy, debug: true}) {
			case {
				playerCost: [playerCost1, playerCost2],
				peopleCost: [peopleCost1, peopleCost2],
				success: success,
				findTreasureRate: findTreasureRate
			}:
				// 無論成功或失敗武將先消體力
				if (people1.energy < peopleCost1.energy) {
					throw new haxe.Exception('people.energy ${people1.energy} < ${peopleCost1.energy}');
				}
				if (people2.energy < peopleCost2.energy) {
					throw new haxe.Exception('people.energy ${people2.energy} < ${peopleCost2.energy}');
				}
				people1.energy -= peopleCost1.energy;
				if (people1.energy < 0) {
					people1.energy = 0;
				}
				people2.energy -= peopleCost2.energy;
				if (people2.energy < 0) {
					people2.energy = 0;
				}
				//
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
						// 城裡的武將副效果
						final peoplesInGrid = ctx.peoples.filter(p -> p.position.gridId == grid.id);
						for (peopleInGrid in peoplesInGrid) {
							// 回到主公身上或解散
							peopleInGrid.position.gridId = null;
							// 體力減半
							peopleInGrid.energy *= 0.5;
						}
						// 沒有進駐的話, 自動進駐
						if (people1.position.gridId == null) {
							people1.position.gridId = gridId;
						}
						//  佔領後資源的損失
						grid.money /= 2;
						grid.food /= 2;
						grid.army /= 2;
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
				if (success) {
					// 寶物只處理攻城部分
					if (options.occupy) {
						// 先不吃findTreasureRate
						if (false) {
							final isFindTreasure = Math.random() < findTreasureRate;
							if (isFindTreasure) {
								final treasureInGrid = getTreasureInGrid(ctx, gridId);
								if (treasureInGrid.length == 0) {
									throw new haxe.Exception("城裡必須有寶物");
								}
								final takeId = Math.floor(Math.random() * treasureInGrid.length);
								final treasure = treasureInGrid[takeId];
								onFindTreasure(ctx, playerId, [treasure]);
							}
						}
						// 先把所有寶物移到攻城者身上
						final treasureInGrid = getTreasureInGrid(ctx, gridId);
						onFindTreasure(ctx, playerId, treasureInGrid);
					}
					// 功績
					onPeopleExpAdd(ctx, people1.id, getExpAdd(1, peopleCost1.energy));
				}
				if (people2.belongToPlayerId != null) {
					final targetPlayer = getPlayerById(ctx, people2.belongToPlayerId);
					if (success) {
						// hate you
						targetPlayer.hate.push(playerId);
						targetPlayer.hate.push(playerId);
						targetPlayer.hate.push(playerId);
						targetPlayer.hate.push(playerId);
						targetPlayer.hate.push(playerId);
					} else {
						// hate you
						targetPlayer.hate.push(playerId);
						targetPlayer.hate.push(playerId);
					}
				}
				success;
			case _:
				throw new haxe.Exception("getWarCost not match");
		}
	}
	if (options.warEvent) {
		resultValue.success = success;
		resultValue.energyAfter = people1.energy;
		resultValue.armyAfter = player.army;
		resultValue.moneyAfter = player.money;
		resultValue.foodAfter = player.food;
		ctx.events.push(WAR_RESULT(resultValue, getGameInfo(ctx, false)));
	}
	return success;
}

function _getTakeWarPreview(ctx:Context, playerId:Int, gridId:Int):WarPreview {
	final grid = ctx.grids[gridId];
	if (getGridBuildType(ctx, grid.id) == GROWTYPE.EMPTY) {
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
					strategys: [],
					people: ctx.peoples.filter(p -> p.position.gridId == gridId).map(p -> getPeopleInfo(ctx, p)),
					atGridId: gridId,
					maintainArmy: 0.0,
					maintainPeople: 0.0,
					armyGrow: 0.0,
					grids: [],
					commands: [],
					treasures: [],
					score: 0.0,
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
	return switch getWarCostImpl(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: options.occupy, debug: true}) {
		case {playerCost: [playerCost1, playerCost2], peopleCost: [peopleCost1, peopleCost2]}:
			final player1 = getPlayerById(ctx, playerId);
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
					armyFight: Std.int(army1),
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
					armyFight: Std.int(army2),
				}
			];
		case _:
			throw new haxe.Exception("getWarCost not match");
	}
}

function _takeWarOn(ctx:Context, playerId:Int, gridId:Int, p1PeopleId:Int, p2PeopleId:Int, army1:Float, army2:Float) {
	onWarCostImpl(ctx, playerId, gridId, p1PeopleId, p2PeopleId, army1, army2, {occupy: true, warEvent: true});
	{
		final player = ctx.players[ctx.currentPlayerId];
		player.memory.hasCommand = true;
	}
}

// expose
final getWarCost = getWarCostImpl;
final onWarCost = onWarCostImpl;
