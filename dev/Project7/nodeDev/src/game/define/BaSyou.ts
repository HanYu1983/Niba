import {  RelatedPlayerSideKeyword } from ".";
import { TPlayerID } from "./PlayerID";

// basyou
export type BattleAreaKeyword = "宇宙エリア" | "地球エリア";

// 場
export type BaKeyword = "戦闘エリア（左）" | "戦闘エリア（右）" | "配備エリア";

// 場所
export type BaSyouKeyword =
    | "本国"
    | "捨て山"
    | "Gゾーン"
    | "ジャンクヤード"
    | "手札"
    | "ハンガー"
    | "取り除かれたカード"
    | "プレイされているカード"
    | BaKeyword;

function isBa(k: BaSyouKeyword): boolean {
    switch (k) {
        case "戦闘エリア（右）":
        case "戦闘エリア（左）":
        case "配備エリア":
            return true;
        default:
            return false;
    }
}

export type AbsoluteBaSyou = {
    id: "AbsoluteBaSyou";
    value: [TPlayerID, BaSyouKeyword];
};

export type RelatedBaSyou = {
    id: "RelatedBaSyou";
    value: [RelatedPlayerSideKeyword | "持ち主", BaSyouKeyword];
};

export type TBaSyou = AbsoluteBaSyou | RelatedBaSyou;

function getBaSyouID(baSyou: AbsoluteBaSyou) {
    return JSON.stringify(baSyou.value);
}

function getBaSyou(id: string): AbsoluteBaSyou {
    return {
        id: "AbsoluteBaSyou",
        value: JSON.parse(id),
    };
}

export default {
    getBaSyou,
    getBaSyouID,
    isBa
}