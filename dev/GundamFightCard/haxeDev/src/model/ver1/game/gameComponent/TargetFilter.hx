package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.TableComponent;
import model.ver1.game.gameComponent.GameComponent;

// typedef TargetFilter = (card:Card) -> Bool;
// function not(filter:TargetFilter):TargetFilter {
// 	return (card:Card) -> {
// 		return !filter(card);
// 	};
// }
// function and(filters:Array<TargetFilter>):TargetFilter {
// 	return (card:Card) -> {
// 		return filters.filter(f -> f(card)).length == filters.length;
// 	};
// }
// function or(filters:Array<TargetFilter>):TargetFilter {
// 	return (card:Card) -> {
// 		return filters.exists(f -> f(card));
// 	};
// }
// // ユニット
// function cardEntityCategoryIn(ctx:IGameComponent, c:Array<CardEntityCategory>):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// function isCardCategoryIn(ctx:IGameComponent, c:Array<CardCategory>):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// // 自軍
// function belongPlayer(ctx:IGameComponent, c:PlayerId):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// function characteristicIn(ctx:IGameComponent, c:Array<String>):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// function isDestroyByBattleDamage(ctx:IGameComponent):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// function isDestroyByBattleDamageSpeed(ctx:IGameComponent, speed:Int):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// function inBattle(ctx:IGameComponent):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }
// function baSyouIn(ctx:IGameComponent, c:Array<BaSyou>):TargetFilter {
// 	return (card:Card) -> {
// 		return false;
// 	};
// }