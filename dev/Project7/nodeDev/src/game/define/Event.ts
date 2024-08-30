import { TEffect } from "./Effect";
import { TBattleBonus } from "./Text";
import { TTextID } from "./TextID";
import { Timing } from "./Timing";

export type TDestroyReason1 = {
    id: "通常ダメージ" | "戦闘ダメージ" | "破壊する" | "マイナスの戦闘修正";
    // 誰造成的
    playerID: string;
};

export type TDestroyReason = TDestroyReason1

export type TEventTitle =
    | ["GameEventOnTiming", Timing]
    | ["カット終了時", TEffect[]]
    | ["場に出た場合"]
    | ["プレイされて場に出た場合"]
    | ["プレイされて場にセットされた場合"]
    | ["戦闘ダメージを受けた場合"]
    | ["コインがx個以上になった場合", number]
    | ["「改装」の効果で廃棄される場合"]
    | ["「改装」の効果で場に出た場合"]
    | ["破壊された場合", TDestroyReason]
    | ["プレイした場合" | "解決直後", TTextID]
    | ["「ゲイン」の効果で戦闘修正を得る場合", TBattleBonus]

export type TEvent = {
    title: TEventTitle;
    cardID?: string;
}