package model.ver1.game.data;

import model.ver1.game.define.Define;

private final _cardProtoPool:Map<String, CardProto> = [
	"179001_01A_CH_WT007R_white" => new model.ver1.data.CardProto_179001_01A_CH_WT007R_white(),
	"179003_01A_U_BK008U_black" => new model.ver1.data.CardProto_179003_01A_U_BK008U_black(),
	"179004_01A_CH_WT009R_white" => new model.ver1.data.CardProto_179004_01A_CH_WT009R_white(),
];

@:nullSafety
function getCardProto(key:String):CardProto {
	final obj = _cardProtoPool[key];
	if (obj == null) {
		throw new haxe.Exception('${key} not found');
	}
	return obj;
}




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


// 179025_07D_CH_BK070C_black
// C
// F91
// アンナマリー・ブルージュ
// 女性　子供
// 『恒常』：このカードをプレイする場合、このカードのロールコストは、赤のGサインを持つ自軍Gでも支払う事ができる。
// <『起動』：このカードが破壊された場合、敵軍キャラ１枚を破壊する>


// 179025_07D_CH_BL077R_blue
// R
// GUNDAM
// アムロ・レイ
// 男性　子供　ＮＴ　WB隊
// 〔青１〕：共有［レジェンド］
// 『恒常』：このカードは、「特徴：レジェンド」を持つ自軍ユニットにセットする場合、ロールコストー２してプレイできる。