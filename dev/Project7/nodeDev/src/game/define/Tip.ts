import { AbsoluteBaSyou } from "./BaSyou";
import { GameError } from "./GameError";

export type TipTitle =
    | ["カード", [string, AbsoluteBaSyou][], [string, AbsoluteBaSyou][]]

export type Tip = {
    title: TipTitle,
    count?: number,
    min?: number,
    max?: number
};

export const TipFn = {
    checkTipSatisfies(tip: Tip): GameError | null {
        const selection = (() => {
            switch (tip.title[0]) {
                case "カード":
                    return tip.title[2]
            }
        })()
        if (tip.count != null && tip.count != selection.length) {
            return new GameError(`count not right`)
        }
        if (tip.min != null && selection.length < tip.min) {
            return new GameError(`min not right`)
        }
        if (tip.max != null && selection.length > tip.max) {
            return new GameError(`max not right`)
        }
        return null;
    }
}