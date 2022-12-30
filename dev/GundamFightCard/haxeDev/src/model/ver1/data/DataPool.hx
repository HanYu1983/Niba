package model.ver1.data;

import model.ver1.game.Define;

private final _cardProtoPool:Map<String, CardProto> = [
	"179001_01A_CH_WT007R_white" => new CardProto_179001_01A_CH_WT007R_white(),
	"179003_01A_U_BK008U_black" => new CardProto_179003_01A_U_BK008U_black(),
	"179004_01A_CH_WT009R_white" => new CardProto_179004_01A_CH_WT009R_white(),
];

@:nullSafety
function getCardProto(key:String):CardProto {
	final obj = _cardProtoPool[key];
	if (obj == null) {
		throw new haxe.Exception('${key} not found');
	}
	return obj;
}


// 還要指定這回合中出場的卡
// 179030_11E_U_VT186R_purple
// R
// BF
// すーぱーふみな［†］
// ガンプラ　心形流　専用「サカイ・ミナト」
// クイック
// 『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。


// 還要能改變phase
// 179030_11E_C_VT065R_purple
// R
// BF
// 新たな挑戦へ
// 支配
// （自軍戦闘フェイズ）：自軍手札、または自軍ハンガーにある、「特徴：トライファイターズ」を持つカード１枚を選んで廃棄する。その場合、このターンの終了直後、新たな自軍ターンを開始する。新たなターンでは、全ての自軍Gはリロールできず、戦闘フェイズのみ行われる。

// roll也是事件
// 179030_11E_CH_BN091N_brown
// N
// ∀
// ポゥ・エイジ
// 女性　大人
// 『起動』：このカードがロールした場合、敵軍G１枚をロールする。その場合、このセットグループは、このターンと次のターン、リロールできない。



// 179028_10D_CH_WT095_white
// R
// W
// ヒイロ・ユイ
// 男性　子供
// 『恒常』：このカードは、自軍ジャンクヤードにある場合、自軍手札にあるカードのようにプレイできる。
// 『恒常』：このカードは、自軍ジャンクヤードにある状態でプレイする場合、セット先として、自軍ジャンクヤードにある、このカードと同じ属性のGサインを持つユニット１枚を、自軍配備エリアにロール状態で出し、このカードをセットできる。