import { RelatedPlayerSideKeyword } from ".";
import { TLogicTree } from "../../tool/logicTree";
import { BaSyouKeyword } from "./BaSyou";
import { CardColor, CardCategory } from "./CardPrototype";
import { TEvent } from "./Event";
import { GlobalEffect } from "./GlobalEffect";
import { SiYouTiming } from "./Timing";

export type TBattleBonus = [number, number, number]

export type TTextTokuSyuKouKa =
    | ["高機動"]
    | ["速攻"]
    | ["サイコミュ", number]
    | ["強襲"]
    | ["範囲兵器", number]
    | ["ゲイン"]
    | ["改装", string]
    | ["共有", string]
    | ["供給"]
    | ["クロスウェポン", string]
    | ["PS装甲"]
    | ["クイック"]
    | ["戦闘配備"]
    | ["ステイ"]
    | ["1枚制限"];

export type TActionTitle = string | ["このカードをリロールする", "このカード" | string[], "リロール"]

export type TAction = {
    title: TActionTitle,
}

export type TConditionTitle =
    | string
    | ["(x)", number]
    | ["c(x)", CardColor, number]
    | ["本来の記述に｢特徴：(装弾)｣を持つ(自軍)(G)(１)枚", string, RelatedPlayerSideKeyword, CardCategory, number]
    | ["(戦闘エリア)にいる(敵軍)(ユニット)(１)～(２)枚", BaSyouKeyword, RelatedPlayerSideKeyword, CardCategory, number, number]
    | ["(交戦中)の(自軍)(ユニット)(１)枚", "交戦中" | "非交戦中", RelatedPlayerSideKeyword, CardCategory, number]

export type TCondition = {
    title: TConditionTitle,
    actions?: TAction[]
}

export type TSituationTitle = ["「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合", string, RelatedPlayerSideKeyword, CardCategory, RelatedPlayerSideKeyword, CardCategory, "ロール"]

// 『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。
export type TSituation = {
    title: TSituationTitle,
    cardID?: string
}

export type TTextBattleBonus = ["TTextBattleBonus", TBattleBonus]

export type TTextTitle =
    | ["自動型", "常駐" | "起動" | "恒常"]
    | ["使用型", SiYouTiming]
    | ["特殊型", TTextTokuSyuKouKa]
    | TTextBattleBonus
    | ["system"]

export type TLogicTreeCommand = {
    logicTree?: TLogicTree
    actions: TAction[]
}

export type TText = {
    title: TTextTitle
    description?: string
    conditions?: { [key: string]: TCondition }
    logicTreeCommands?: TLogicTreeCommand[]
    onEvent?: string,
    onSituation?: string
}

function getTextsFromTokuSyuKouKa(value: TTextTokuSyuKouKa): TText[] {
    return [];
}

const testTexts: TText[] = [
    {
        title: ["TTextBattleBonus", [3, 4, 2]]
    },
    {
        title: ["特殊型", ["サイコミュ", 3]],
        conditions: {
            "1": {
                title: ["c(x)", "緑", 3],
                actions: [{
                    title: ["このカードをリロールする", "このカード", "リロール"],
                }]
            }
        },
    },
    {
        title: ["特殊型", ["サイコミュ", 2]]
    },
    {
        title: ["使用型", ["自軍", "戦闘フェイズ"]],
        conditions: {
            "1": {
                title: ["(戦闘エリア)にいる(敵軍)(ユニット)(１)～(２)枚", "戦闘エリア（右）", "自軍", "ユニット", 1, 2],
                actions: [{
                    title: ["このカードをリロールする", "このカード", "リロール"],
                }]
            },
            "2": {
                title: function _() { }.toString(),
                actions: [
                    { title: function _() { }.toString() }
                ]
            }
        },
        logicTreeCommands: [
            {
                //logicTree: { type: "Leaf", value: "1" },
                actions: [
                    {
                        title: ["このカードをリロールする", "このカード", "リロール"],
                    },
                    {
                        title: function _(ctx: any, runtime: any, bridge: any): any {
                            const cardIds = ["abc"]
                            const action: TAction = { title: ["このカードをリロールする", cardIds, "リロール"] }
                            return bridge.getFunctionByAction(action)(ctx, runtime, bridge)
                        }.toString()
                    }
                ]
            }
        ],
        onEvent: function _(ctx: any, evt: TEvent, runtime: any) {
            if (Array.isArray(evt.title)) {
                if (evt.title[0] == "コインがx個以上になった場合") {
                    const [_, x] = evt.title;

                }
            }
        }.toString(),
        onSituation: function _(ctx: any, evt: TSituation, runtime: any): GlobalEffect[] {
            if (Array.isArray(evt.title)) {
                if (evt.title[0] == "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合") {
                    const [_, x] = evt.title;
                    const cardId = evt.cardID;
                }
            }
            return [{ type: "自軍Gとしてロール", cardIds: [runtime.getCardID()] }]
        }.toString(),
    }
]

export type GlobalEffectFn = (ctx: any, runtime: any, evt: TSituation | null, bridge: any) => GlobalEffect[];

function getGlobalEffectFn(ctx: TText): GlobalEffectFn {
    if (ctx.onSituation == null) {
        return function (ctx) {
            return ctx
        }
    }
    return eval(ctx.onSituation + ";_")
}

export default {
    getGlobalEffectFn, getTextsFromTokuSyuKouKa
}