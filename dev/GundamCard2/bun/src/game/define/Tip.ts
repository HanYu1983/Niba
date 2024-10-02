import { title } from "process";
import { AbsoluteBaSyou } from "./BaSyou";
import { TipError, TargetMissingError } from "./GameError";
import { BattleBonus } from "./CardText";
import { CardPrototype } from "./CardPrototype";

export type StrBaSyouPair = [string, AbsoluteBaSyou]

export type TipTitleTextRef = {
    cardId: string,
    textId: string,
}

export type TipTitle =
    | ["カード", StrBaSyouPair[], StrBaSyouPair[]]
    | ["テキスト", TipTitleTextRef[], TipTitleTextRef[]]
    | ["BattleBonus", BattleBonus[], BattleBonus[]]
    | ["StringOptions", string[], string[]]

export type Tip = {
    title: TipTitle,
    count?: number,
    min?: number,
    max?: number,
    cheatCardIds?: string[],
    isRepeat?: boolean,
};

export const TipFn = {
    createTotalCostKey: ()=>"合計国力〔x〕",
    createConditionKeyOfPayColorX(proto: CardPrototype): string {
        if (proto.color == null) {
            throw new Error()
        }
        return `${proto.color}X`
    },
    getWant(tip: Tip) {
        switch (tip.title[0]) {
            case "カード":
            case "テキスト":
            case "StringOptions":
            case "BattleBonus":
                return tip.title[1]
        }
    },
    getSelection(tip: Tip) {
        switch (tip.title[0]) {
            case "カード":
            case "テキスト":
            case "StringOptions":
            case "BattleBonus":
                return tip.title[2]
        }
    },
    passWantToSelection(tip: Tip): Tip {
        switch (tip.title[0]) {
            case "カード":
                return {
                    ...tip,
                    title: [tip.title[0], tip.title[1], tip.title[1]]
                }
            case "テキスト":
                return {
                    ...tip,
                    title: [tip.title[0], tip.title[1], tip.title[1]]
                }
            case "StringOptions":
                return {
                    ...tip,
                    title: [tip.title[0], tip.title[1], tip.title[1]]
                }
            case "BattleBonus":
                return {
                    ...tip,
                    title: [tip.title[0], tip.title[1], tip.title[1]]
                }
        }
    },
    checkTipSatisfies(tip: Tip): TipError | null {
        const selection = this.getSelection(tip)
        if (tip.count != null && tip.count != selection.length) {
            return new TipError(`count ${selection.length} not right: ${tip.title[0]}/${tip.count}`)
        }
        if (tip.min != null && selection.length < tip.min) {
            return new TipError(`min ${selection.length} not right: ${tip.title[0]}/${tip.min}`)
        }
        if (tip.max != null && selection.length > tip.max) {
            return new TipError(`max ${selection.length} not right: ${tip.title[0]}/${tip.max}`)
        }
        return null;
    }
}