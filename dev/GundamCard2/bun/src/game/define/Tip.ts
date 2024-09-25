import { AbsoluteBaSyou } from "./BaSyou";
import { GameError, TargetMissingError } from "./GameError";

export type StrBaSyouPair = [string, AbsoluteBaSyou]

export type TipTitleTextRef = {
    cardId: string,
    textId: string,
}

export type TipTitle =
    | ["カード", StrBaSyouPair[], StrBaSyouPair[]]
    | ["テキスト", TipTitleTextRef[], TipTitleTextRef[]]
    | ["StringOptions", string[], string[]]

export type Tip = {
    title: TipTitle,
    count?: number,
    min?: number,
    max?: number,
    cheatCardIds?: string[],
};

export const TipFn = {
    getWant(tip: Tip) {
        switch (tip.title[0]) {
            case "カード":
                return tip.title[1]
            case "テキスト":
                return tip.title[1]
            case "StringOptions":
                return tip.title[1]
        }
    },
    getSelection(tip: Tip) {
        switch (tip.title[0]) {
            case "カード":
                return tip.title[2]
            case "テキスト":
                return tip.title[2]
            case "StringOptions":
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
        }
    },
    checkTipSatisfies(tip: Tip): TargetMissingError | null {
        const selection = this.getSelection(tip)
        if (tip.count != null && tip.count != selection.length) {
            return new GameError(`count ${selection.length} not right: ${tip.title[0]}/${tip.count}`)
        }
        if (tip.min != null && selection.length < tip.min) {
            return new GameError(`min ${selection.length} not right: ${tip.title[0]}/${tip.min}`)
        }
        if (tip.max != null && selection.length > tip.max) {
            return new GameError(`max ${selection.length} not right: ${tip.title[0]}/${tip.max}`)
        }
        return null;
    }
}