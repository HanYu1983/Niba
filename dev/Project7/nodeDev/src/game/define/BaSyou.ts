import { RelatedPlayerSideKeyword } from ".";
import { getOpponentPlayerID, PlayerID } from "./PlayerID";

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

export function isBa(k: BaSyouKeyword): boolean {
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
    value: [PlayerID, BaSyouKeyword];
};

export const AbsoluteBaSyouFn = {
    toString(baSyou: AbsoluteBaSyou) {
        return JSON.stringify(baSyou.value);
    },
    fromString(id: string): AbsoluteBaSyou {
        return {
            id: "AbsoluteBaSyou",
            value: JSON.parse(id),
        };
    },
    of(p: PlayerID, k: BaSyouKeyword): AbsoluteBaSyou {
        return {
            id: "AbsoluteBaSyou",
            value: [p, k]
        }
    },
    setBaSyouKeyword(baSyou: AbsoluteBaSyou, kw: BaSyouKeyword): AbsoluteBaSyou {
        return this.of(baSyou.value[0], kw);
    },
    setPlayerID(baSyou: AbsoluteBaSyou, p: PlayerID): AbsoluteBaSyou {
        return this.of(p, baSyou.value[1]);
    },
    setOpponentPlayerID(baSyou: AbsoluteBaSyou): AbsoluteBaSyou {
        return this.of(getOpponentPlayerID(baSyou.value[0]), baSyou.value[1]);
    },
}

export type RelatedBaSyou = {
    id: "RelatedBaSyou";
    value: [RelatedPlayerSideKeyword | "持ち主", BaSyouKeyword];
};

export type BaSyou = AbsoluteBaSyou | RelatedBaSyou;