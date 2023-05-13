package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.TableComponent;
import model.ver1.game.gameComponent.GameComponent;

typedef TargetFilter = (card:Card) -> Bool;

function not(filter:TargetFilter):TargetFilter {
	return (card:Card) -> {
		return !filter(card);
	};
}

function and(filters:Array<TargetFilter>):TargetFilter {
	return (card:Card) -> {
		return filters.filter(f -> f(card)).length == filters.length;
	};
}

function or(filters:Array<TargetFilter>):TargetFilter {
	return (card:Card) -> {
		return filters.exists(f -> f(card));
	};
}

// ユニット
function cardEntityCategoryIn(ctx:IGameComponent, c:Array<CardEntityCategory>):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

function isCardCategoryIn(ctx:IGameComponent, c:Array<CardCategory>):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

// 自軍
function belongPlayer(ctx:IGameComponent, c:PlayerId):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

function characteristicIn(ctx:IGameComponent, c:Array<String>):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

function isDestroyByBattleDamage(ctx:IGameComponent):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

function isDestroyByBattleDamageSpeed(ctx:IGameComponent, speed:Int):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

function inBattle(ctx:IGameComponent):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

function baSyouIn(ctx:IGameComponent, c:Array<BaSyou>):TargetFilter {
	return (card:Card) -> {
		return false;
	};
}

enum TargetCount {
	// 全て
	All;
	// 1枚
	Constants(value:Int);
	// 合計2枚まで
	MuchAsPossible(value:Int);
}

typedef Target = {
	player:RelativePlayer,
	filter:TargetFilter,
	count:TargetCount
}

function getCardsByFilter(ctx:IGameComponent, filter:TargetFilter):Array<Card> {
	// 「特徴：MF」を持つ、戦闘ダメージ以外で破壊されている自軍ユニット１枚
	and([
		characteristicIn(ctx, ["MF"]),
		not(isDestroyByBattleDamage(ctx)),
		belongPlayer(ctx, PlayerId.A),
		cardEntityCategoryIn(ctx, [Unit])
	]);
	// 「速度２」の戦闘ダメージ以外で破壊されている、自軍ユニット１枚
	and([
		not(isDestroyByBattleDamageSpeed(ctx, 2)),
		belongPlayer(ctx, PlayerId.A),
		cardEntityCategoryIn(ctx, [Unit])
	]);
	// 交戦中ではない全てのユニット
	and([not(inBattle(ctx)), cardEntityCategoryIn(ctx, [Unit])]);
	// 敵軍手札
	and([belongPlayer(ctx, PlayerId.A), baSyouIn(ctx, [Default(PlayerId.A, TeHuTa)])]);
	// 敵軍は、自分の手札1枚、または自分のカード１枚
	{
		final a:Target = {
			player: Opponent,
			filter: and([
				not(baSyouIn(ctx, [Default(PlayerId.A, TeHuTa), Default(PlayerId.A, GZone)])),
				belongPlayer(ctx, PlayerId.A),
			]),
			count: MuchAsPossible(2),
		};
	}
	// 敵軍は、自分の手札、G以外の自分のカードを、合計２枚まで、可能な限り選んで
	{
		final a:Target = {
			player: Opponent,
			filter: and([
				not(baSyouIn(ctx, [Default(PlayerId.A, TeHuTa), Default(PlayerId.A, GZone)])),
				belongPlayer(ctx, PlayerId.A),
			]),
			count: MuchAsPossible(2),
		};
	}
	return getCards(ctx).filter(filter);
}
