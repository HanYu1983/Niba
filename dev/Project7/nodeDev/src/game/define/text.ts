import { always, ifElse, map, pipe, zipObj } from "ramda";
import { RelatedPlayerSideKeyword } from ".";
import { LogicTree, LogicTreeFn } from "../../tool/logicTree";
import { BaSyouKeyword } from "./BaSyou";
import { CardColor, CardCategory } from "./CardPrototype";
import { Effect } from "./Effect";
import { Event } from "./Event";
import { GlobalEffect } from "./GlobalEffect";
import { SiYouTiming, Timing } from "./Timing";
import { StrBaSyouPair, Tip } from "./Tip";
import { PlayerID } from "./PlayerID";

export type BattleBonus = [number, number, number]

export type TextSpeicalEffect =
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

export const TextSpeicalEffectFn = {
    isSameKeyword(left: TextSpeicalEffect, right: TextSpeicalEffect): boolean {
        return left[0] == right[0]
    }
}

export type ActionTitle =
    | string
    | ["(このカード)を(リロール)する", "このカード" | StrBaSyouPair[], "ロール" | "リロール"]
    | ["(１)ダメージを与える", number]
    | ["(－１／－１／－１)コイン(１)個を乗せる", BattleBonus, number]
    | ["移除卡狀態_旗標", string]

export type Action = {
    title: ActionTitle,
    var?: string
}

export type ActionTitleFn = (ctx: any, effect: Effect, lib: any) => any;

export const ActionFn = {
    getTitleFn(ctx: Action): ActionTitleFn {
        if (typeof ctx.title != "string") {
            throw new Error("action.title must be string")
        }
        return eval(ctx.title + ";_")
    }
}

export type ConditionTitle =
    | string
    | ["〔x〕", number]
    | ["c〔x〕", CardColor, number]
    | ["合計国力〔x〕", number]
    | ["本来の記述に｢特徴：(装弾)｣を持つ(自軍)(G)(１)枚", string, RelatedPlayerSideKeyword, CardCategory, number]
    | ["(戦闘エリア)にいる(敵軍)(ユニット)(１)～(２)枚", BaSyouKeyword[], RelatedPlayerSideKeyword, CardCategory, number, number]
    | ["(交戦中)の(自軍)(ユニット)(１)枚", "交戦中" | "非交戦中" | null, RelatedPlayerSideKeyword, CardCategory, number]
    | ["_自軍_ユニット_１枚", RelatedPlayerSideKeyword, CardCategory, number]

export type Condition = {
    title: ConditionTitle,
    actions?: Action[]
}

export type ConditionTitleFn = (ctx: any, effect: Effect, lib: any) => Tip[];

export const ConditionFn = {
    getTitleFn(ctx: Condition) {
        if (typeof ctx.title != "string") {
            throw new Error("condition.title must be string")
        }
        return eval(ctx.title + ";_")
    },
    getActionTitleFns(ctx: Condition, genActionFn: (title: Action) => ActionTitleFn): ActionTitleFn[] {
        if (ctx.actions == null) {
            return []
        }
        return ctx.actions.map(genActionFn)
    }
}

export type SituationTitle = ["「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合"]

// 『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。
export type Situation = {
    title: SituationTitle,
    cardID?: string
}

export type TextBattleBonus = ["TextBattleBonus", BattleBonus]

export type TextTitle =
    | ["自動型", "常駐" | "起動" | "恒常"]
    | ["使用型", SiYouTiming]
    | ["特殊型", TextSpeicalEffect]
    | TextBattleBonus
    | []

export type LogicTreeAction = {
    logicTree?: LogicTree
    actions: Action[]
}

export const LogicTreeActionFn = {
    getActionTitleFns(ctx: LogicTreeAction, genActionFn: (title: Action) => ActionTitleFn): ActionTitleFn[] {
        if (ctx.actions == null) {
            return []
        }
        return ctx.actions.map(genActionFn)
    }
}

export type OnEventTitle =
    | string
    | ["GameEventOnTimingDoAction", Timing, Action]

export type Text = {
    id?: string,
    title: TextTitle
    description?: string
    conditions?: { [key: string]: Condition }
    logicTreeActions?: LogicTreeAction[]
    onEvent?: OnEventTitle
    onSituation?: string
    isEnabledWhileG?: boolean
}

export type OnEventFn = ActionTitleFn

export const TextFn = {
    getCondition(ctx: Text, conditionId: string): Condition {
        if (ctx.conditions?.[conditionId] == null) {
            throw new Error(`condition not found: ${conditionId}`)
        }
        return ctx.conditions[conditionId]
    },

    getLogicTreeAction(ctx: Text, id: number): LogicTreeAction {
        if (ctx.logicTreeActions?.[id] == null) {
            throw new Error(`logic not found: ${id}`)
        }
        return ctx.logicTreeActions[id]
    },

    getLogicTreeActionConditions(ctx: Text, logicTreeCommand: LogicTreeAction): { [key: string]: Condition }[] {
        // return pipe(
        //     ifElse(
        //         always(logicTreeCommand.logicTree == null),
        //         always([Object.keys(ctx.conditions || {})]),
        //         always(LogicTreeFn.enumerateAll(logicTreeCommand.logicTree!) as string[][])
        //     ),
        //     map(conditionIds => {
        //         const conditions = conditionIds.map(conditionId => this.getCondition(ctx, conditionId))
        //         return zipObj(conditionIds, conditions)
        //     })
        // )()
        if (logicTreeCommand.logicTree == null) {
            const conditionIds = Object.keys(ctx.conditions || {})
            const conditions = conditionIds.map(conditionId => this.getCondition(ctx, conditionId))
            return [zipObj(conditionIds, conditions)]
        }
        const conditionIdsList = LogicTreeFn.enumerateAll(logicTreeCommand.logicTree) as string[][]
        return conditionIdsList.map(conditionIds => {
            const conditions = conditionIds.map(conditionId => this.getCondition(ctx, conditionId))
            return zipObj(conditionIds, conditions)
        })
    },

    getOnEventFn(ctx: Text): OnEventFn {
        if (ctx.onEvent == null) {
            return function (a) {
                return a
            }
        }
        if (typeof ctx.onEvent != "string") {
            throw new Error("condition.title must be string")
        }
        return eval(ctx.onEvent + ";_")
    }
}

export function getTextsFromTokuSyuKouKa(value: TextSpeicalEffect): Text[] {
    return [];
}

const testTexts: Text[] = [
    {
        id: "",
        title: ["TextBattleBonus", [3, 4, 2]]
    },
    {
        id: "",
        title: ["特殊型", ["サイコミュ", 3]],
        conditions: {
            "1": {
                title: ["c〔x〕", "緑", 3]
            }
        },
    },
    {
        id: "",
        title: ["特殊型", ["サイコミュ", 2]]
    },
    {
        id: "",
        title: ["使用型", ["自軍", "戦闘フェイズ"]],
        conditions: {
            "1": {
                title: ["(戦闘エリア)にいる(敵軍)(ユニット)(１)～(２)枚", ["戦闘エリア2"], "自軍", "ユニット", 1, 2]

            },
            "2": {
                title: function _() { }.toString(),
                actions: [
                    { title: function _() { }.toString() }
                ]
            }
        },
        logicTreeActions: [
            {
                //logicTree: { type: "Leaf", value: "1" },
                actions: [
                    {
                        title: function _(ctx: any, runtime: any, bridge: any): any {
                            const action: Action = { title: ["(このカード)を(リロール)する", [], "リロール"] }
                            return bridge.getFunctionByAction(action)(ctx, runtime, bridge)
                        }.toString()
                    }
                ]
            }
        ],
        onEvent: function _(ctx: any, evt: Event, runtime: any) {
            if (Array.isArray(evt.title)) {
                if (evt.title[0] == "コインが(x)個以上になった場合") {
                    const [_, x] = evt.title;

                }
            }
        }.toString(),
        onSituation: function _(ctx: any, evt: Situation, runtime: any): GlobalEffect[] {
            if (Array.isArray(evt.title)) {
                if (evt.title[0] == "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合") {
                    const cardId = evt.cardID;
                }
            }
            return [{ title: ["自軍Gとしてロール"], cardIds: [runtime.getCardID()] }]
        }.toString(),
    }
]

export type OnSituationFn = (ctx: any, effect: Effect, lib: any) => GlobalEffect[];

export function getOnSituationFn(ctx: Text): OnSituationFn {
    if (ctx.onSituation == null) {
        return function (ctx) {
            return []
        }
    }
    return eval(ctx.onSituation + ";_")
}