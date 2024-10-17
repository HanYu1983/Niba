import { lift } from "ramda";
import { RelatedPlayerSideKeyword } from ".";
import { PlayerA, PlayerB, PlayerID, PlayerIDFn } from "./PlayerID";

// basyou
export type BattleAreaKeyword = "宇宙エリア" | "地球エリア";

// 場
export type BaKeyword = "戦闘エリア1" | "戦闘エリア2" | "配備エリア";

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

export const BaSyouKeywordFn = {
    isBa(k: BaSyouKeyword): boolean {
        switch (k) {
            case "戦闘エリア2":
            case "戦闘エリア1":
            case "配備エリア":
                return true;
            default:
                return false;
        }
    },
    getAll(): BaSyouKeyword[] {
        return ["本国", "捨て山", "取り除かれたカード", "Gゾーン", "ジャンクヤード", "手札", "ハンガー", "戦闘エリア1", "戦闘エリア2", "配備エリア"]
    },
    getBaAll(): BaSyouKeyword[] {
        return BaSyouKeywordFn.getAll().filter(BaSyouKeywordFn.isBa)
    },
    getTextOn(): BaSyouKeyword[] {
        return BaSyouKeywordFn.getAll().filter(kw => ["本国", "取り除かれたカード", "捨て山"].includes(kw) == false)
    },
    getBattleArea(): BaSyouKeyword[] {
        return ["戦闘エリア1", "戦闘エリア2"]
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
    getBaSyouKeyword(baSyou: AbsoluteBaSyou): BaSyouKeyword {
        return baSyou.value[1]
    },
    setBaSyouKeyword(baSyou: AbsoluteBaSyou, kw: BaSyouKeyword): AbsoluteBaSyou {
        return AbsoluteBaSyouFn.of(baSyou.value[0], kw);
    },
    setPlayerID(baSyou: AbsoluteBaSyou, p: PlayerID): AbsoluteBaSyou {
        return AbsoluteBaSyouFn.of(p, baSyou.value[1]);
    },
    getPlayerID(baSyou: AbsoluteBaSyou): PlayerID {
        return baSyou.value[0]
    },
    setOpponentPlayerID(baSyou: AbsoluteBaSyou): AbsoluteBaSyou {
        return AbsoluteBaSyouFn.of(PlayerIDFn.getOpponent(baSyou.value[0]), baSyou.value[1]);
    },
    getAll(): AbsoluteBaSyou[] {
        return lift(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getAll())
    },
    getBaAll(): AbsoluteBaSyou[] {
        return lift(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getBaAll())
    },
    getTextOn(): AbsoluteBaSyou[] {
        return lift(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getTextOn())
    },
    getBattleArea(): AbsoluteBaSyou[] {
        return lift(AbsoluteBaSyouFn.of)(PlayerIDFn.getAll(), BaSyouKeywordFn.getBattleArea())
    },
    eq(left: AbsoluteBaSyou, right: AbsoluteBaSyou): boolean {
        return AbsoluteBaSyouFn.toString(left) == AbsoluteBaSyouFn.toString(right)
    }
}

export type RelatedBaSyou = {
    id: "RelatedBaSyou";
    value: [RelatedPlayerSideKeyword, BaSyouKeyword];
};

export const RelatedBaSyouFn = {
    of(side: RelatedPlayerSideKeyword, kw: BaSyouKeyword): RelatedBaSyou {
        return {
            id: "RelatedBaSyou",
            value: [side, kw]
        }
    }
}

export type BaSyou = AbsoluteBaSyou | RelatedBaSyou;