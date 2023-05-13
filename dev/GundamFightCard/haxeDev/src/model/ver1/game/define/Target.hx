package model.ver1.game.define;

using Lambda;

import haxe.ds.Option;
import tool.Table;
import model.ver1.game.define.Define;
import model.ver1.game.define.Player;
import model.ver1.game.define.BaSyou;
import model.ver1.game.component.TableComponent;

enum TargetCount {
	// 全て
	All;
	// 1枚
	Constants(value:Int);
	// 合計2枚まで
	MuchAsPossible(value:Int);
}

enum SameAsThisCardWhat {
	GSign;
}

enum RelativeBaSyou {
	RelativeBaSyou(playerId:RelativePlayer, baSyouKeyword:BaSyouKeyword);
}

enum TargetFilter {
	Or(value:Array<TargetFilter>);
	And(value:Array<TargetFilter>);
	Not(value:TargetFilter);
	CardEntityCategoryIn(value:Array<CardEntityCategory>);
	CardCategoryIn(value:Array<CardCategory>);
	BelongPlayer(value:RelativePlayer);
	CharacteristicIn(value:Array<String>);
	IsDestroyByBattleDamage;
	IsDestroyByBattleDamageSpeed(speed:Int);
	InBattle;
	BaSyouKeywordIn(value:Array<RelativeBaSyou>);
	SameAsThisCard(what:SameAsThisCardWhat);
}

enum BattleGroupFilter {
	Or(value:Array<BattleGroupFilter>);
	And(value:Array<BattleGroupFilter>);
	Not(value:BattleGroupFilter);
	UnitCount(value:TargetCount);
	BelongPlayer(value:RelativePlayer);
}

enum Target {
	Or(value:Array<Target>);
	Card(player:RelativePlayer, filter:TargetFilter, count:TargetCount);
	SetGroup(player:RelativePlayer, count:TargetCount);
	Player(player:RelativePlayer);
	BattleGroup(player:RelativePlayer, filter:BattleGroupFilter, count:TargetCount);
	Nation(player:RelativePlayer);
	// 〔２〕を支払う。
	//Pay(player:RelativePlayer, count:TargetCount);
}

function tests():Void {
	// 「特徴：MF」を持つ、戦闘ダメージ以外で破壊されている自軍ユニット１枚
	Target.Card(You, And([
		CharacteristicIn(["MF"]),
		Not(IsDestroyByBattleDamage),
		BelongPlayer(You),
		CardEntityCategoryIn([Unit])
	]), Constants(1));
	// 「速度２」の戦闘ダメージ以外で破壊されている、自軍ユニット１枚
	Target.Card(You, And([
		Not(IsDestroyByBattleDamageSpeed(2)),
		BelongPlayer(You),
		CardEntityCategoryIn([Unit])
	]), Constants(1));
	// 交戦中ではない全てのユニット
	Target.Card(You, And([Not(InBattle), CardEntityCategoryIn([Unit])]), All);
	// 敵軍は、自分の手札1枚、または自分のカード１枚
	Target.Or([
		Card(Opponent, And([Not(BaSyouKeywordIn([RelativeBaSyou(You, TeHuTa)])), BelongPlayer(You),]), Constants(1)),
		Card(Opponent, And([BelongPlayer(You)]), Constants(1))
	]);
	// 敵軍は、自分の手札、G以外の自分のカードを、合計２枚まで、可能な限り選んで
	Target.Card(Opponent, And([
		Not(BaSyouKeywordIn([RelativeBaSyou(You, TeHuTa), RelativeBaSyou(You, GZone)])),
		BelongPlayer(You),
	]), MuchAsPossible(2));
	// このカードと同じ属性のGサインを持つ自軍ユニット１枚
	Target.Card(You, And([SameAsThisCard(GSign), BelongPlayer(You),]), Constants(1));
	// ユニットが１枚のみの自軍部隊１つを指定する
	Target.BattleGroup(You, And([UnitCount(Constants(1)), BelongPlayer(You),]), Constants(1));
	// セットカードがセットされていない、G以外の敵軍カード１枚
	// マイナスの戦闘修正を受けている敵軍ユニット１枚
	// 戦闘エリアにいる、X以下の合計国力を持つ敵軍ユニット１枚を、持ち主の手札に移す。Xの値は、自軍ジャンクヤードにあるユニットの枚数と同じとする。
}
