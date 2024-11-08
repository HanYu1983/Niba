import { TableFns } from "../../tool/table";
import { Effect } from "../define/Effect";
import { GameExtParams } from "../define/GameExtParams";
import { StrBaSyouPair } from "../define/Tip";
import { assertTargetMissingError } from "./assertTargetMissingError";
import { getCard, mapCard, setCard } from "./CardTableComponent";
import { GameState } from "./GameState";
import { getItemState, mapItemStateValues, setItemState } from "./ItemStateComponent";
import { isCard } from "./ItemTableComponent";

export function doItemSwap(ctx: GameState, effect: Effect, pair1: StrBaSyouPair, pair2: StrBaSyouPair, options: GameExtParams): GameState {
    assertTargetMissingError(ctx, effect, pair1, options)
    assertTargetMissingError(ctx, effect, pair2, options)
    const [itemId1] = pair1
    const [itemId2] = pair2
    return doItemSwapBasic(ctx, itemId1, itemId2, options)
}

export function doItemSwapBasic(ctx: GameState, itemId1: string, itemId2: string, options: GameExtParams): GameState {
    // 置換(p77)
    if (isCard(ctx, itemId1) && isCard(ctx, itemId2)) {
        const card1 = getCard(ctx, itemId1)
        const card2 = getCard(ctx, itemId2)
        // 只換protoID
        // 這裡要注意置換protoID時，交差武器的TextRef會跑掉
        ctx = setCard(ctx, card1.id, { ...card1, protoID: card2.protoID/*, isRoll: card2.isRoll*/ }) as GameState
        ctx = setCard(ctx, card2.id, { ...card2, protoID: card1.protoID/*, isRoll: card1.isRoll*/ }) as GameState

        // const is1 = getItemState(ctx, itemId1)
        // const is2 = getItemState(ctx, itemId2)
        // ctx = setItemState(ctx, is1.id, { ...is2, id: is1.id }) as GameState
        // ctx = setItemState(ctx, is2.id, { ...is1, id: is2.id }) as GameState
        // 交換TextRef的cardId
        ctx = mapItemStateValues(ctx, is => {
            let nextGE = is.globalEffects
            Object.keys(is.globalEffects).forEach(key => {
                const ge = is.globalEffects[key]
                if (ge.title[0] == "AddTextRef" && ge.title[1].cardId == card1.id) {
                    nextGE = {
                        ...nextGE,
                        [key]: {
                            ...ge,
                            title: ["AddTextRef", { ...ge.title[1], cardId: card2.id }]
                        }
                    }
                } else if (ge.title[0] == "AddTextRef" && ge.title[1].cardId == card2.id) {
                    nextGE = {
                        ...nextGE,
                        [key]: {
                            ...ge,
                            title: ["AddTextRef", { ...ge.title[1], cardId: card1.id }]
                        }
                    }
                }
            })
            return {
                ...is,
                globalEffects: nextGE
            }
        }) as GameState

        return ctx
    }
    throw new Error(`swapCard not yet support`)
}