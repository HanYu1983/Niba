import { logCategory } from "../../tool/logger";
import { PlayerA, PlayerB, PlayerID, PlayerIDFn } from "../define/PlayerID";
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeyword, BaSyouKeywordFn } from "../define/BaSyou";
import { addImmediateEffect, getEffect } from "../gameState/EffectStackComponent";
import { checkIsBattle } from "../gameState/IsBattleComponent";
import { Flow } from "./Flow";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { setActiveEffectID, cancelActiveEffectID, doActiveEffect, deleteImmediateEffect, setActiveLogicID } from "./effect";
import { PhaseFn } from "../define/Timing";
import { doPlayerAttack } from "../gameState/player";
import { doTriggerEvent } from "../gameState/doTriggerEvent";
import { ToolFn } from "../tool";
import { updateCommand } from "../gameState/updateCommand";
import { getItem, getItemController, getItemIdsByBasyou, isCard, isCardLike, isChip, isCoin, Item, shuffleItems } from "../gameState/ItemTableComponent";
import { TableFns } from "../../tool/table";
import { assertTipForUserSelection, setCardTipStrBaSyouPairs, setTipSelectionForUser } from "../gameState/doEffect";
import { EffectFn } from "../define/Effect";
import { mapItemState } from "../gameState/ItemStateComponent";
import { ItemStateFn } from "../define/ItemState";
import { GameState } from "../gameState/GameState";
import { flow, lift } from "ramda";
import { getCard } from "../gameState/CardTableComponent";
import { getCoin, getCoinIds, getCoinOwner } from "../gameState/CoinTableComponent";
import { createEntityIterator, EntityFn } from "../gameState/Entity";
import { createMinusDestroyEffectAndPush } from "../gameState/doItemSetDestroy";
import { doCutInDestroyEffectsAndClear } from "../gameState/doCutInDestroyEffectsAndClear";
import { setNextPhase } from "../gameState/getNextPhase";
import { getPhase } from "../gameState/PhaseComponent";
import { createAttackPhaseRuleEffect } from "../gameState/createAttackPhaseRuleEffect";
import { createDamageRuleEffect } from "../gameState/createDamageRuleEffect";
import { createReturnRuleEffect } from "../gameState/createReturnRuleEffect";
import { createDrawPhaseRuleEffect } from "../gameState/createDrawPhaseRuleEffect";
import { createRerollPhaseRuleEffect } from "../gameState/createRerollPhaseRuleEffect";

export function applyFlow(
    ctx: GameStateWithFlowMemory,
    playerID: string,
    flow: Flow
): GameStateWithFlowMemory {
    logCategory("applyFlow", `${playerID} ${flow.id} ${flow.description}`, playerID, flow);
    switch (flow.id) {
        case "FlowSetActiveEffectID": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            ctx = setActiveEffectID(ctx, playerID, flow.effectID);
            const isAllPassCut =
                !!ctx.flowMemory.hasPlayerPassCut[PlayerA] &&
                !!ctx.flowMemory.hasPlayerPassCut[PlayerB];
            // 如果不是雙方都結束，就重設
            if (isAllPassCut == false) {
                ctx = {
                    ...ctx,
                    flowMemory: {
                        ...ctx.flowMemory,
                        hasPlayerPassCut: {},
                    },
                };
            }
            return ctx;
        }
        case "FlowCancelActiveEffectID": {
            return cancelActiveEffectID(ctx, playerID);
        }
        case "FlowDeleteImmediateEffect": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            return deleteImmediateEffect(ctx, playerID, flow.effectID);
        }
        case "FlowSetActiveLogicID": {
            return setActiveLogicID(ctx, flow.logicID, flow.logicSubID)
        }
        case "FlowDoEffect": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            if (flow.logicID == null) {
                throw new Error("logicID not found");
            }
            if (flow.logicSubID == null) {
                throw new Error("logicSubID not found");
            }
            //ctx = setTipSelectionForUser(ctx, getEffectIncludePlayerCommand(ctx, flow.effectID), flow.logicID, flow.logicSubID) as GameStateWithFlowMemory
            ctx = doActiveEffect(ctx, playerID, flow.effectID, flow.logicID, flow.logicSubID);
            // 執行完效果時自動取消其中一方的結束宣告
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassPhase: {},
                },
            };
            // 清空支付狀態
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassPayCost: {},
                },
            };
            // 負數修正破壞
            ctx = createMinusDestroyEffectAndPush(ctx) as GameStateWithFlowMemory;
            // 每執行完一次效果，就更新指令
            ctx = updateCommand(ctx) as GameStateWithFlowMemory;
            return ctx;
        }
        case "FlowPassPhase": {
            return {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassPhase: {
                        ...ctx.flowMemory.hasPlayerPassPhase,
                        [playerID]: true,
                    },
                },
            };
        }
        case "FlowCancelPassPhase":
            return {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassPhase: {
                        ...ctx.flowMemory.hasPlayerPassPhase,
                        [playerID]: false,
                    },
                },
            };
        case "FlowPassCut": {
            return {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassCut: {
                        ...ctx.flowMemory.hasPlayerPassCut,
                        [playerID]: true,
                    },
                }

            };
        }
        case "FlowCancelPassCut":
            return {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassCut: {
                        ...ctx.flowMemory.hasPlayerPassCut,
                        [playerID]: false,
                    },
                },
            };
        case "FlowTriggerTextEvent":
            if (ctx.flowMemory.hasTriggerEvent) {
                logCategory("applyFlow", "已經執行過triggerTextEvent");
                return ctx;
            }
            // 處理遊戲開始的效果
            if (ctx.flowMemory.state != "playing") {
                switch (ctx.flowMemory.state) {
                    case "prepareDeck": {
                        ctx = shuffleItems(ctx, AbsoluteBaSyouFn.of(PlayerA, "本国")) as GameStateWithFlowMemory
                        ctx = shuffleItems(ctx, AbsoluteBaSyouFn.of(PlayerB, "本国")) as GameStateWithFlowMemory
                        ctx = {
                            ...ctx,
                            flowMemory: {
                                ...ctx.flowMemory,
                                state: "whoFirst",
                            },
                        };
                        break;
                    }
                    case "whoFirst": {
                        ctx = {
                            ...ctx,
                            flowMemory: {
                                ...ctx.flowMemory,
                                state: "draw6AndConfirm",
                            },
                        };
                        break;
                    }
                    case "draw6AndConfirm": {
                        {
                            const from = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerA, "本国"))
                            const to = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerA, "手札"))
                            const cards = ctx.table.cardStack[from].slice(0, 6)
                            ctx.table.cardStack[from] = ctx.table.cardStack[from].slice(6)
                            ctx.table.cardStack[to] = [...cards, ...(ctx.table.cardStack[to] || [])]
                        }
                        {
                            const from = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerB, "本国"))
                            const to = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerB, "手札"))
                            const cards = ctx.table.cardStack[from].slice(0, 6)
                            ctx.table.cardStack[from] = ctx.table.cardStack[from].slice(6)
                            ctx.table.cardStack[to] = [...cards, ...(ctx.table.cardStack[to] || [])]
                        }
                        ctx = {
                            ...ctx,
                            phase: ["リロールフェイズ", "フェイズ開始"],
                        };
                        ctx = {
                            ...ctx,
                            flowMemory: {
                                ...ctx.flowMemory,
                                state: "playing",
                            },
                        };
                        break;
                    }
                }
                return ctx;
            }
            if (flow.event.title[0] == "GameEventOnTiming" && PhaseFn.eq(flow.event.title[1], ctx.phase)) {

            } else {
                throw new Error(`你要觸發的階段和現階段不符: ${flow.event.title[1]} != ${ctx.phase}`)
            }
            if (ctx.activePlayerID == null) {
                throw new Error("activePlayerID not found");
            }
            switch (ctx.phase[0]) {
                case "ドローフェイズ": {
                    switch (ctx.phase[1]) {
                        case "規定の効果": {
                            ctx = addImmediateEffect(ctx, createDrawPhaseRuleEffect(ctx, ctx.activePlayerID)) as GameStateWithFlowMemory
                            break
                        }
                        default: {
                            ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                        }
                    }
                    break
                }
                case "リロールフェイズ": {
                    switch (ctx.phase[1]) {
                        case "規定の効果": {
                            ctx = addImmediateEffect(ctx, createRerollPhaseRuleEffect(ctx, ctx.activePlayerID)) as GameStateWithFlowMemory
                            break
                        }
                        default: {
                            ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                        }
                    }
                    break
                }
                case "戦闘フェイズ": {
                    switch (ctx.phase[1]) {
                        case "攻撃ステップ": {
                            switch (ctx.phase[2]) {
                                case "規定の効果": {
                                    ctx = addImmediateEffect(ctx, createAttackPhaseRuleEffect(ctx, ctx.activePlayerID)) as GameStateWithFlowMemory
                                    break
                                }
                                // p34
                                // 戰鬥階段的每個步驟開始時，確認是否交戰中
                                case "ステップ開始": {
                                    ctx = checkIsBattle(ctx) as GameStateWithFlowMemory
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                }
                                default: {
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                }
                            }
                            break
                        }
                        case "防御ステップ": {
                            switch (ctx.phase[2]) {
                                case "規定の効果": {
                                    ctx = addImmediateEffect(ctx, createAttackPhaseRuleEffect(ctx, PlayerIDFn.getOpponent(ctx.activePlayerID))) as GameStateWithFlowMemory
                                    break
                                }
                                case "ステップ開始": {
                                    ctx = checkIsBattle(ctx) as GameStateWithFlowMemory
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                }
                                default: {
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                }
                            }
                            break
                        }
                        case "ダメージ判定ステップ": {
                            switch (ctx.phase[2]) {
                                case "規定の効果": {
                                    ctx = addImmediateEffect(ctx, createDamageRuleEffect(ctx, ctx.activePlayerID)) as GameStateWithFlowMemory
                                    break
                                }
                                case "ステップ開始": {
                                    ctx = checkIsBattle(ctx) as GameStateWithFlowMemory
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                }
                                default: {
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                }
                            }
                            break
                        }
                        case "帰還ステップ": {
                            switch (ctx.phase[2]) {
                                case "規定の効果": {
                                    ctx = addImmediateEffect(ctx, createReturnRuleEffect(ctx, ctx.activePlayerID)) as GameStateWithFlowMemory
                                    break
                                }
                                case "ステップ開始": {
                                    ctx = checkIsBattle(ctx) as GameStateWithFlowMemory
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                }
                                default: {
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                }
                            }
                            break
                        }
                        case "ターン終了時": {
                            switch (ctx.phase[2]) {
                                case "ダメージリセット":
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                case "効果解決":
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                case "手札調整":
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    break
                                case "効果終了。ターン終了": {
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                    if (ctx.activePlayerID == null) {
                                        throw new Error("activePlayerID not found");
                                    }
                                    // 回合結束時切換主動玩家
                                    ctx = {
                                        ...ctx,
                                        activePlayerID: PlayerIDFn.getOpponent(ctx.activePlayerID),
                                        turn: ctx.turn + 1
                                    };
                                    break
                                }
                                default: {
                                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                                }
                            }
                        }
                    }
                    break
                }
                default: {
                    ctx = doTriggerEvent(ctx, { title: ["GameEventOnTiming", ctx.phase] }) as GameStateWithFlowMemory;
                }
            }
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasTriggerEvent: true,
                },
            };
            return ctx;
        case "FlowUpdateCommand":
            ctx = updateCommand(ctx) as GameStateWithFlowMemory;
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasTriggerEvent: true,
                }
            };
            return ctx;
        case "FlowNextTiming": {
            // 下一步
            ctx = setNextPhase(ctx) as GameStateWithFlowMemory
            // 自動更新指令
            ctx = updateCommand(ctx) as GameStateWithFlowMemory;
            // 重設觸發flag
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasTriggerEvent: false,
                },
            };
            // 重設宣告結束的flag
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassPhase: {},
                }
            };
            return ctx;
        }
        // case "FlowAddBlock": {
        //     ctx = addImmediateEffect(ctx, flow.block) as GameStateWithFlowMemory
        //     // set hasTriggerEvent
        //     ctx = {
        //         ...ctx,
        //         flowMemory: {
        //             ...ctx.flowMemory,
        //             hasTriggerEvent: true,
        //         }
        //     };
        //     return ctx;
        // }
        case "FlowHandleStackEffectFinished": {
            ctx = doTriggerEvent(ctx, {
                title: ["カット終了時", ctx.stackEffectMemory]
            }) as GameStateWithFlowMemory;
            ctx = {
                ...ctx,
                stackEffectMemory: [],
                flowMemory: {
                    ...ctx.flowMemory,
                    shouldTriggerStackEffectFinishedEvent: false,
                },
            };
            return ctx;
        }
        case "FlowPassPayCost": {
            const effect = getEffect(ctx, flow.effectID)
            if (effect == null) {
                throw new Error(`effectID not found:${flow.effectID}`);
            }
            //assertBlockPayloadTargetTypeValueLength(effect);
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassPayCost: {
                        ...ctx.flowMemory.hasPlayerPassPayCost,
                        [playerID]: true,
                    },
                },
            };
            return ctx;
        }
        case "FlowMakeDestroyOrder": {
            // 移除破壞效果，全部移到堆疊
            ctx = doCutInDestroyEffectsAndClear(ctx, flow.destroyEffect.map(i => i.id)) as GameStateWithFlowMemory
            ctx = updateCommand(ctx) as GameStateWithFlowMemory
            return {
                ...ctx,
                // 重設切入旗標，讓玩家再次切入
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassCut: {},
                },
            };
        }
        case "FlowSetTipSelection": {
            const effect = getEffect(ctx, flow.effectID)
            const cardId = EffectFn.getCardID(effect)
            ctx = mapItemState(ctx, cardId, is => ItemStateFn.setTip(is, flow.conditionKey, flow.tip)) as GameStateWithFlowMemory
            assertTipForUserSelection(ctx, effect, cardId)
            return ctx
        }
    }
    return ctx;
}