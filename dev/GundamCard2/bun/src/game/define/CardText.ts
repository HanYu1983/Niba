import { always, ifElse, map, pipe, zipObj } from "ramda";
import { RelatedPlayerSideKeyword } from ".";
import { LogicTree, LogicTreeFn } from "../../tool/logicTree";
import { BaSyou, BaSyouKeyword } from "./BaSyou";
import { CardColor, CardCategory } from "./CardPrototype";
import { Effect } from "./Effect";
import { GameEvent } from "./GameEvent";
import { GlobalEffect } from "./GlobalEffect";
import { Phase, SiYouTiming } from "./Timing";
import { StrBaSyouPair, Tip } from "./Tip";
import { PlayerID } from "./PlayerID";
import { logCategory } from "../../tool/logger";

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
    | ["_ロールする", "ロール" | "リロール" | "打開" | "リロール" | "破壞" | "廃棄" | "破壊を無効" | "見"]
    | ["_１ダメージを与える", number]
    | ["_－１／－１／－１コイン_１個を乗せる", BattleBonus, number]
    | ["移除卡狀態_旗標", string]
    | ["ターン終了時まで「速攻」を得る。", GlobalEffect[]]
    | ["cutIn", Action[]]
    | ["カード_１枚を引く", number]
    | ["リロール状態で置き換える"]
    | ["合計国力〔x〕", number]
    | ["_敵軍_ユニットが_戦闘エリアにいる場合", RelatedPlayerSideKeyword, CardCategory, BaSyouKeyword[]]
    | ["這張卡在_戰區的場合", BaSyouKeyword[]]
    | ["這個效果1回合只能用1次"]
    | ["看自己_本國全部的卡", BaSyouKeyword]
    | ["triggerEvent", GameEvent]
    | ["_の_ハンガーに移す", RelatedPlayerSideKeyword, BaSyouKeyword]
    | ["_２ダメージを与える", number]
    | ["_敵軍本国に_１ダメージ", RelatedPlayerSideKeyword, number]
    | ["_黒のGサインを持つ_自軍_Gが_５枚以上ある場合", CardColor, RelatedPlayerSideKeyword, CardCategory, number]
    | ["Action", { move?: BaSyou }]

export type Action = {
    title: ActionTitle,
    vars?: string[],
}

export type ActionTitleFn = (ctx: any, effect: Effect, lib: any) => any;

export const ActionFn = {
    getTitleFn(ctx: Action): ActionTitleFn {
        if (typeof ctx.title != "string") {
            throw new Error("action.title must be string")
        }
        try {
            return eval(ctx.title + ";_")
        } catch (e) {
            console.log(`原字串:[${ctx.title}]`)
            throw e
        }
    }
}

export type EntitySearchOptions = {
    isBattle?: boolean,
    side?: RelatedPlayerSideKeyword,
    see?: [BaSyouKeyword, number, number],
    is?: CardCategory[],
    cardCategory?: CardCategory[],
    at?: BaSyouKeyword[],
    color?: CardColor[],
    isDestroy?: boolean,
    isSetGroup?: boolean,
    isCanSetCharacter?: boolean,
    hasSetCard?: boolean,
    hasSpecialEffect?: TextSpeicalEffect[],
    hasChar?: string[],
    count?: number,
    min?: number,
    max?: number,
    asMuchAsPossible?: boolean,
}

export type ConditionTitle =
    | string
    | ["RollColor", CardColor | null]
    | ["_戦闘エリアにいる_敵軍_ユニット_１～_２枚", BaSyouKeyword[], RelatedPlayerSideKeyword, CardCategory, number, number]
    | ["_交戦中の_自軍_ユニット_１枚", "交戦中" | "非交戦中" | null, RelatedPlayerSideKeyword, CardCategory, number]
    | ["_自軍_ユニット_１枚", RelatedPlayerSideKeyword, CardCategory, number]
    | ["このセットグループの_ユニットは", CardCategory]
    | ["_本来の記述に｢特徴：_装弾｣を持つ_自軍_G_１枚", boolean, string, RelatedPlayerSideKeyword, CardCategory, number]
    | ["_自軍手札、または自軍ハンガーにある、_６以下の合計国力を持つ_ユニット_１枚を", RelatedPlayerSideKeyword, number, CardCategory, number]
    | ["打開自軍手裡或指定HANGER中特徵_A並合計國力_x以下的_1張卡", string, number, number]
    | ["このカードの_本来のテキスト１つ", boolean, number]
    | ["_自軍_本國上的_1張卡", RelatedPlayerSideKeyword, BaSyouKeyword, number]
    | ["_自軍_本國找出特徵_A的_1張卡", RelatedPlayerSideKeyword, BaSyouKeyword, string, number]
    | ["這張卡交戰的防禦力_x以下的敵軍機體_1張", number, number]
    | ["_配備エリアにいる、「特徴：_T3部隊」を持つ_自軍_ユニット_１枚", BaSyouKeyword, string, RelatedPlayerSideKeyword, CardCategory, number]
    | ["_自軍_本国の上のカード_１～_４枚を見て、その中にある、「特徴：_ヘイズル系」を持つ_ユニット_１枚", RelatedPlayerSideKeyword, BaSyouKeyword, number, number, string, CardCategory, number]
    | ["_自軍_ジャンクヤードにある、_黒のGサインを持つ全てのカードは", RelatedPlayerSideKeyword, BaSyouKeyword, CardColor]
    | ["Entity", EntitySearchOptions]

export type Condition = {
    title?: ConditionTitle,
    actions?: Action[],
    exceptItemSelf?: boolean,
    relatedPlayerSideKeyword?: RelatedPlayerSideKeyword,
}

export type ConditionTitleFn = (ctx: any, effect: Effect, lib: any) => Tip | null;

export const ConditionFn = {
    getTitleFn(ctx: Condition): ConditionTitleFn {
        if (ctx.title == null) {
            return () => {
                return null
            }
        }
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

export type OnEventFn = ActionTitleFn

export type OnEventTitle =
    | string
    | ["GameEventOnTimingDoAction", Phase, Action]

export type CardText = {
    id: string,
    title: TextTitle
    description?: string
    conditions?: { [key: string]: Condition }
    logicTreeActions?: LogicTreeAction[]
    onEvent?: OnEventTitle
    onSituation?: string
    isEnabledWhileG?: boolean,
    isEachTime?: boolean,
}

function getCondition(ctx: CardText, conditionId: string): Condition {
    if (ctx.conditions?.[conditionId] == null) {
        console.log(ctx.conditions)
        throw new Error(`condition not found: ${conditionId}`)
    }
    return ctx.conditions[conditionId]
}

export const CardTextFn = {
    getCondition: getCondition,

    getLogicTreeAction(ctx: CardText, id: number): LogicTreeAction {
        if (ctx.logicTreeActions?.[id] == null) {
            throw new Error(`logic not found: ${id}`)
        }
        return ctx.logicTreeActions[id]
    },

    getLogicTreeTreeLeafs(ctx: CardText, logicTreeCommand: LogicTreeAction): LogicTree[] {
        if (logicTreeCommand.logicTree == null) {
            const logicLeafs: LogicTree[] = Object.keys(ctx.conditions || {}).map(k => {
                const ret: LogicTree = {
                    type: "Leaf",
                    value: k
                }
                return ret
            })
            return logicLeafs
        }
        return [logicTreeCommand.logicTree]
    },

    getLogicTreeActionConditions(ctx: CardText, logicTreeCommand: LogicTreeAction): { [key: string]: Condition }[] {
        if (logicTreeCommand.logicTree == null) {
            const conditionIds = Object.keys(ctx.conditions || {})
            const conditions = conditionIds.map(conditionId => getCondition(ctx, conditionId))
            return [zipObj(conditionIds, conditions)]
        }
        const conditionIdsList = LogicTreeFn.enumerateAll(logicTreeCommand.logicTree) as string[][]
        logCategory("getLogicTreeActionConditions", logicTreeCommand.logicTree, conditionIdsList)
        return conditionIdsList.map(conditionIds => {
            const conditions = conditionIds.map(conditionId => getCondition(ctx, conditionId))
            return zipObj(conditionIds, conditions)
        })
    },

    getOnEventFn(ctx: CardText): OnEventFn {
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

export type OnSituationFn = (ctx: any, effect: Effect, lib: any) => GlobalEffect[];

export function getOnSituationFn(ctx: CardText): OnSituationFn {
    if (ctx.onSituation == null) {
        return function (ctx) {
            return []
        }
    }
    return eval(ctx.onSituation + ";_")
}

export function createRollCostRequire(
    costNum: number,
    color: CardColor | null
): { [key: string]: Condition } {
    let ret: { [key: string]: Condition } = {}
    for (let i = 0; i < costNum; ++i) {
        const key = `${i}[${color}]`
        ret = {
            ...ret,
            [key]: {
                title: ["RollColor", color],
                actions: [
                    {
                        title: ["_ロールする", "ロール"],
                        vars: [key]
                    }
                ]
            }
        };
    }
    return ret
}