package model.ver1.game.gameComponent;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.BaSyou;
import model.ver1.game.define.Runtime;
import model.ver1.game.define.Target;
import model.ver1.game.define.TargetCardFilter;
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

class CardEntityCategoryIn extends AbstractTargetCardFilter {
	final value:Array<CardEntityCategory>;

	public function new(value:Array<CardEntityCategory>) {
		this.value = value;
	}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return false;
	}
}

class BelongPlayer extends AbstractTargetCardFilter {
	final value:RelativePlayer;

	public function new(value:RelativePlayer) {
		this.value = value;
	}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return false;
	}
}

class CharacteristicIn extends AbstractTargetCardFilter {
	final value:Array<String>;

	public function new(value:Array<String>) {
		this.value = value;
	}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return false;
	}
}

class IsDestroyByBattleDamage extends AbstractTargetCardFilter {
	public function new() {}

	public override function apply(ctx:Any, runtime:Runtime, card:Card):Bool {
		return false;
	}
}

function tests():Void {
	// 「特徴：MF」を持つ、戦闘ダメージ以外で破壊されている自軍ユニット１枚
	new TargetCard(You, new And([
		new CharacteristicIn(["MG"]),
		new Not(new IsDestroyByBattleDamage()),
		new BelongPlayer(You),
	]), Constants(1));
}

// enum TargetCount {
// 	// 全て
// 	All;
// 	// 1枚
// 	Constants(value:Int);
// 	// 合計2枚まで
// 	MuchAsPossible(value:Int);
// }
// enum RelativeBaSyou {
// 	RelativeBaSyou(playerId:RelativePlayer, baSyouKeyword:BaSyouKeyword);
// }
// enum CustomCondition {
// 	// X以下の合計国力
// 	TotalCostBelow(x:Int);
// 	// このカードと同じ属性のGサイン
// 	SameAsThisCardGProperty;
// }
// enum TargetFilter {
// 	Or(value:Array<TargetFilter>);
// 	And(value:Array<TargetFilter>);
// 	Not(value:TargetFilter);
// 	Custom(condition:CustomCondition);
// 	CardEntityCategoryIn(value:Array<CardEntityCategory>);
// 	CardCategoryIn(value:Array<CardCategory>);
// 	BelongPlayer(value:RelativePlayer);
// 	CharacteristicIn(value:Array<String>);
// 	IsDestroyByBattleDamage;
// 	IsDestroyByBattleDamageSpeed(speed:Int);
// 	InBattle;
// 	InBattleArea;
// 	BaSyouKeywordIn(value:Array<RelativeBaSyou>);
// }
// enum BattleGroupFilter {
// 	Or(value:Array<BattleGroupFilter>);
// 	And(value:Array<BattleGroupFilter>);
// 	Not(value:BattleGroupFilter);
// 	UnitCount(value:TargetCount);
// 	BelongPlayer(value:RelativePlayer);
// }
// enum Target {
// 	Or(value:Array<Target>);
// 	Card(player:RelativePlayer, filter:TargetFilter, count:TargetCount);
// 	SetGroup(player:RelativePlayer, count:TargetCount);
// 	Player(player:RelativePlayer);
// 	BattleGroup(player:RelativePlayer, filter:BattleGroupFilter, count:TargetCount);
// 	Nation(player:RelativePlayer);
// 	// 〔２〕を支払う。
// 	// Pay(player:RelativePlayer, count:TargetCount);
// }
// function tests():Void {
// 	// 「特徴：MF」を持つ、戦闘ダメージ以外で破壊されている自軍ユニット１枚
// 	Target.Card(You, And([
// 		CharacteristicIn(["MF"]),
// 		Not(IsDestroyByBattleDamage),
// 		BelongPlayer(You),
// 		CardEntityCategoryIn([Unit])
// 	]), Constants(1));
// 	// 「速度２」の戦闘ダメージ以外で破壊されている、自軍ユニット１枚
// 	Target.Card(You, And([
// 		Not(IsDestroyByBattleDamageSpeed(2)),
// 		BelongPlayer(You),
// 		CardEntityCategoryIn([Unit])
// 	]), Constants(1));
// 	// 交戦中ではない全てのユニット
// 	Target.Card(You, And([Not(InBattle), CardEntityCategoryIn([Unit])]), All);
// 	// 敵軍は、自分の手札1枚、または自分のカード１枚
// 	Target.Or([
// 		Card(Opponent, And([Not(BaSyouKeywordIn([RelativeBaSyou(You, TeHuTa)])), BelongPlayer(You),]), Constants(1)),
// 		Card(Opponent, And([BelongPlayer(You)]), Constants(1))
// 	]);
// 	// 敵軍は、自分の手札、G以外の自分のカードを、合計２枚まで、可能な限り選んで
// 	Target.Card(Opponent, And([
// 		Not(BaSyouKeywordIn([RelativeBaSyou(You, TeHuTa), RelativeBaSyou(You, GZone)])),
// 		BelongPlayer(You),
// 	]), MuchAsPossible(2));
// 	// このカードと同じ属性のGサインを持つ自軍ユニット１枚
// 	Target.Card(You, And([Custom(SameAsThisCardGProperty), BelongPlayer(You),]), Constants(1));
// 	// ユニットが１枚のみの自軍部隊１つを指定する
// 	Target.BattleGroup(You, And([UnitCount(Constants(1)), BelongPlayer(You),]), Constants(1));
// 	// セットカードがセットされていない、G以外の敵軍カード１枚
// 	// マイナスの戦闘修正を受けている敵軍ユニット１枚
// 	// 戦闘エリアにいる、X以下の合計国力を持つ敵軍ユニット１枚を、持ち主の手札に移す。Xの値は、自軍ジャンクヤードにあるユニットの枚数と同じとする。
// 	Target.Card(You, And([
// 		InBattleArea,
// 		Custom(TotalCostBelow(3)),
// 		BelongPlayer(Opponent),
// 		CardEntityCategoryIn([Unit])
// 	]), Constants(1));
// 	// Gとユニット以外の、敵軍カード１枚を
// 	Target.Card(You, And([Not(CardEntityCategoryIn([Unit, G])), BelongPlayer(Opponent),]), Constants(1));
// }
