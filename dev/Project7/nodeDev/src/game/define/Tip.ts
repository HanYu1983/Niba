import { AbsoluteBaSyou } from "./BaSyou";
import { TargetMissingError } from "./GameError";

export type StrBaSyouPair = [string, AbsoluteBaSyou]

export type TipTitle =
    | ["カード", StrBaSyouPair[], StrBaSyouPair[]]

export type Tip = {
    title: TipTitle,
    count?: number,
    min?: number,
    max?: number
};

export const TipFn = {
    checkTipSatisfies(tip: Tip): TargetMissingError | null {
        const selection = (() => {
            switch (tip.title[0]) {
                case "カード":
                    return tip.title[2]
            }
        })()
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