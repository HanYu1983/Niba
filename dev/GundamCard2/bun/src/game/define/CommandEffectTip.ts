import { Effect, EffectFn } from "./Effect"
import { Tip } from "./Tip"

export type TipOrErrors = {
    effect: Effect,
    conditionKey: string,
    tip: Tip | null,
    errors: string[]
}

export const TipOrErrorsFn = {
    filterNoError(cet: TipOrErrors): boolean {
        return cet.errors.length == 0
    },
    filterPlayerId(playerID: string) {
        return (cet: TipOrErrors): boolean => {
            const condition = cet.effect.text.conditions?.[cet.conditionKey]
            if (condition?.relatedPlayerSideKeyword == "敵軍") {
                return playerID != playerID
            }
            return playerID == playerID
        }
    },
}

export type CommandEffectTip = {
    effect: Effect,
    logicID: number,
    logicSubID: number,
    tipOrErrors: TipOrErrors[]
}

export const CommandEffecTipFn = {
    filterPlayerId(playerID: string) {
        return (cet: CommandEffectTip): boolean => {
            return EffectFn.getPlayerID(cet.effect) == playerID
        }
    },

    filterNoError(cet: CommandEffectTip): boolean {
        return cet.tipOrErrors.every(toes => toes.errors.length == 0)
    },

    filterEffectDistinct(cet: CommandEffectTip, index: number, self: CommandEffectTip[]): boolean {
        return index === self.findIndex(c => c.effect.id === cet.effect.id)
    },
}