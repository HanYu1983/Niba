import { RelatedPlayerSideKeyword } from ".";
import { CardCategory } from "./CardPrototype";
import { DestroyReason, Effect } from "./Effect";
import { PlayerID } from "./PlayerID";
import { BattleBonus } from "./Text";
import { Timing } from "./Timing";

export type EventTitle =
    | ["GameEventOnTiming", Timing]
    | ["カット終了時", Effect[]]
    | ["場に出た場合"]
    | ["プレイされて場に出た場合"]
    | ["プレイされて場にセットされた場合"]
    | ["戦闘ダメージを受けた場合"]
    | ["コインが(x)個以上になった場合", number]
    | ["「改装」の効果で廃棄される場合"]
    | ["「改装」の効果で場に出た場合"]
    | ["破壊された場合", DestroyReason]
    | ["プレイした場合" | "解決直後", string, string]
    | ["「ゲイン」の効果で戦闘修正を得る場合", BattleBonus]
    | ["(敵軍)(ユニット)がダメージを受けた場合", PlayerID, CardCategory]

export type Event = {
    title: EventTitle;
    cardId?: string;
    effect?: Effect;
}