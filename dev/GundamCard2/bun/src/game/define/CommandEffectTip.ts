import { Effect, EffectFn } from "./Effect"
import { Tip } from "./Tip"

export type TipOrErrors = {
    effectId: string,
    conditionKey: string,
    tip: Tip | null,
    errors: string[]
}

export const TipOrErrorsFn = {
    filterNoError(cet: TipOrErrors): boolean {
        return cet.errors.length == 0
    },
    filterError(cet: TipOrErrors): boolean {
        return cet.errors.length > 0
    },
    filterPlayerId(effects:{[key:string]:Effect},  playerID: string) {
        return (cet: TipOrErrors): boolean => {
            const effect = effects[cet.effectId]
            if(effect == null){
                throw new Error()
            }
            const effectCreator = EffectFn.getPlayerID(effect)
            const condition = effect.text.conditions?.[cet.conditionKey]
            if (condition?.relatedPlayerSideKeyword == "敵軍") {
                return effectCreator != playerID
            }
            return effectCreator == playerID
        }
    },
}

export type CommandEffectTip = {
    effectId: string,
    conditionKeys: string[],
    logicID: number,
    logicSubID: number,
    tipOrErrors: TipOrErrors[]
}

export const CommandEffecTipFn = {
    filterPlayerId(effects:{[key:string]:Effect}, playerID: string) {
        return (cet: CommandEffectTip): boolean => {
            const effect = effects[cet.effectId]
            if(effect == null){
                throw new Error()
            }
            return EffectFn.getPlayerID(effect) == playerID
        }
    },

    not(fn: (cet: CommandEffectTip) => boolean) {
        return (cet: CommandEffectTip): boolean => {
            return !fn(cet)
        }
    },

    filterNoError(cet: CommandEffectTip): boolean {
        return cet.tipOrErrors.every(toes => toes.errors.length == 0)
    },

    filterEffectDistinct(cet: CommandEffectTip, index: number, self: CommandEffectTip[]): boolean {
        return index === self.findIndex(c => c.effectId === cet.effectId)
    },
}