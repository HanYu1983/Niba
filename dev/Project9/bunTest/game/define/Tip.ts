import { AbsoluteBaSyou } from "./BaSyou";
import { TargetMissingError } from "./GameError";

export type StrBaSyouPair = [string, AbsoluteBaSyou]

export type TipTitle =
    | ["カード", StrBaSyouPair[], StrBaSyouPair[]]
    | ["合計国力〔x〕", string[]]
    | ["StringOptions", string[], string[]]

export type Tip = {
    title: TipTitle,
    count?: number,
    min?: number,
    max?: number
};

export const TipFn = {
    getSelection(tip: Tip) {
        switch (tip.title[0]) {
            case "カード":
                return tip.title[2]
            case "合計国力〔x〕":
                return tip.title[1]
            case "StringOptions":
                return tip.title[2]
        }
    },
    checkTipSatisfies(tip: Tip): TargetMissingError | null {
        const selection = this.getSelection(tip)
        if (tip.count != null && tip.count != selection.length) {
            return new TargetMissingError(`count not right`)
        }
        if (tip.min != null && selection.length < tip.min) {
            return new TargetMissingError(`min not right`)
        }
        if (tip.max != null && selection.length > tip.max) {
            return new TargetMissingError(`max not right`)
        }
        return null;
    }
}