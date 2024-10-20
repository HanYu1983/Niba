import { RelatedPlayerSideKeyword } from ".";
import { CardCategory } from "./CardPrototype";
import { DestroyReason, Effect } from "./Effect";
import { PlayerID } from "./PlayerID";
import { BattleBonus } from "./CardText";
import { Phase } from "./Timing";
import { AbsoluteBaSyou } from "./BaSyou";

export type GameEventTitle =
    | ["GameEventOnTiming", Phase]
    | ["GameEventOnMove", AbsoluteBaSyou, AbsoluteBaSyou]
    | ["カット終了時", Effect[]]
    | ["このカードが場に出た場合"]  // このカードが場に出た場合
    | ["プレイされて場に出た場合"]
    | ["プレイされて場にセットされた場合"]
    | ["戦闘ダメージを受けた場合", { isNotRule?: boolean }]
    | ["このカードの部隊が敵軍本国に戦闘ダメージを与えた場合"]
    | ["このカードが攻撃に出撃した場合"]
    | ["このカードがGとして場に出た場合"]
    | ["コインが(x)個以上になった場合", number]
    | ["「改装」の効果で廃棄される場合"]
    | ["「改装」の効果で場に出た場合"]
    | ["破壊された場合", DestroyReason]
    | ["プレイした場合"]
    | ["「ゲイン」の効果で戦闘修正を得る場合", BattleBonus]
    | ["「ゲイン」の効果で戦闘修正を得た場合", BattleBonus]
    | ["(敵軍)(ユニット)がダメージを受けた場合", PlayerID, CardCategory]
    | ["自軍本国に戦闘ダメージが与えられた場合"]
    | ["カードが場から離れた場合"]
    | ["このカードのセットグループのユニットが破壊された場合"]
    | ["交戦中となった場合"]
    // "解決直後"為處理特殊狀況, 不是常規事件. 也可以去掉它改用別的方式實作, 但先保留
    | ["解決直後"]

export type GameEvent = {
    title: GameEventTitle;
    cardIds?: string[];
    effect?: Effect;
    playerId?: PlayerID;
}