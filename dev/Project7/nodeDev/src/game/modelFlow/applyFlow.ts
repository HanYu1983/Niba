import { GameContext, updateCommand } from ".";
import { log2 } from "../../tool/logger";
import { PlayerA, PlayerB, AbsoluteBaSyou, getBaSyouID, getOpponentPlayerID, getNextTiming } from "../define";
import { addImmediateEffect, iterateEffect } from "../model/EffectStackComponent";
import { triggerTextEvent, updateDestroyEffect, GameState, handleAttackDamage } from "../model/GameState";
import { checkIsBattle } from "../model/IsBattleComponent";
import { Flow } from "./Flow";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { setActiveEffectID, cancelActiveEffectID, doEffect, deleteImmediateEffect } from "./handleEffect";

function setGameActiveEffectID(
    ctx: GameContext,
    playerID: string,
    effectID: string
): GameContext {
    const gameState = setActiveEffectID(ctx.gameState, playerID, effectID)
    return {
        ...ctx,
        gameState: gameState
    };
}

function cancelGameActiveEffectID(
    ctx: GameContext,
    playerID: string
): GameContext {
    const gameState = cancelActiveEffectID(ctx.gameState, playerID)
    return {
        ...ctx,
        gameState: gameState
    };
}

function doGameEffect(
    ctx: GameContext,
    playerID: string,
    effectID: string
): GameContext {
    const gameState = doEffect(ctx.gameState, playerID, effectID)
    return {
        ...ctx,
        gameState: gameState
    }
}

export function deleteGameImmediateEffect(
    ctx: GameContext,
    playerID: string,
    effectID: string
  ): GameContext {
    let gameState = deleteImmediateEffect(ctx.gameState, playerID, effectID)
    return {
      ...ctx,
      gameState: gameState
    };
  }

let idSeq = 0;
export function applyFlow(
    ctx: GameContext,
    playerID: string,
    flow: Flow
): GameContext {
    log2("applyFlow", playerID, flow);
    switch (flow.id) {
        case "FlowSetActiveEffectID": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            ctx = setGameActiveEffectID(ctx, playerID, flow.effectID);
            const isAllPassCut =
                !!ctx.gameState.flowMemory.hasPlayerPassCut[PlayerA] &&
                !!ctx.gameState.flowMemory.hasPlayerPassCut[PlayerB];
            // 如果不是雙方都結束，就重設
            if (isAllPassCut == false) {
                ctx = {
                    ...ctx,
                    gameState: {
                        ...ctx.gameState,
                        flowMemory: {
                            ...ctx.gameState.flowMemory,
                            hasPlayerPassCut: {},
                        },
                    },
                };
            }
            return ctx;
        }
        case "FlowCancelActiveEffectID": {
            return cancelGameActiveEffectID(ctx, playerID);
        }
        case "FlowDeleteImmediateEffect": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            return deleteGameImmediateEffect(ctx, playerID, flow.effectID);
        }
        case "FlowDoEffect": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            ctx = doGameEffect(ctx, playerID, flow.effectID);
            // 執行完效果時自動取消其中一方的結束宣告
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassPhase: {},
                    },
                },
            };
            // 清空支付狀態
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassPayCost: {},
                    },
                },
            };
            // 每執行完一次效果，就更新指令
            ctx = updateCommand(ctx);
            return ctx;
        }
        case "FlowPassPhase": {
            return {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassPhase: {
                            ...ctx.gameState.flowMemory.hasPlayerPassPhase,
                            [playerID]: true,
                        },
                    },
                },
            };
        }
        case "FlowCancelPassPhase":
            return {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassPhase: {
                            ...ctx.gameState.flowMemory.hasPlayerPassPhase,
                            [playerID]: false,
                        },
                    },
                },
            };
        case "FlowPassCut": {
            return {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassCut: {
                            ...ctx.gameState.flowMemory.hasPlayerPassCut,
                            [playerID]: true,
                        },
                    },
                },
            };
        }
        case "FlowCancelPassCut":
            return {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassCut: {
                            ...ctx.gameState.flowMemory.hasPlayerPassCut,
                            [playerID]: false,
                        },
                    },
                },
            };
        case "FlowTriggerTextEvent":
            if (ctx.gameState.flowMemory.hasTriggerEvent) {
                log2("applyFlow", "已經執行過triggerTextEvent");
                return ctx;
            }
            let gameState = triggerTextEvent(ctx.gameState, flow.event);
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                gameState: {
                    ...gameState as GameStateWithFlowMemory,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasTriggerEvent: true,
                    },
                },
            };
            return ctx;
        case "FlowUpdateCommand":
            ctx = updateCommand(ctx);
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasTriggerEvent: true,
                    },
                },
            };
            return ctx;
        case "FlowNextTiming": {
            {
                // 處理遊戲開始的效果
                if (ctx.gameState.flowMemory.state != "playing") {
                    switch (ctx.gameState.flowMemory.state) {
                        case "prepareDeck": {
                            {
                                const plyrID = PlayerA;
                                const baSyou: AbsoluteBaSyou = {
                                    id: "AbsoluteBaSyou",
                                    value: [plyrID, "本国"],
                                };
                                const fromCS =
                                    ctx.gameState.table.cardStack[getBaSyouID(baSyou)];
                                ctx = {
                                    ...ctx,
                                    gameState: {
                                        ...ctx.gameState,
                                        table: {
                                            ...ctx.gameState.table,
                                            cardStack: {
                                                ...ctx.gameState.table.cardStack,
                                                [getBaSyouID(baSyou)]: fromCS.sort(
                                                    () => Math.random() - 0.5
                                                ),
                                            },
                                        },
                                    },
                                };
                            }
                            {
                                const plyrID = PlayerB;
                                const baSyou: AbsoluteBaSyou = {
                                    id: "AbsoluteBaSyou",
                                    value: [plyrID, "本国"],
                                };
                                const fromCS =
                                    ctx.gameState.table.cardStack[getBaSyouID(baSyou)];
                                ctx = {
                                    ...ctx,
                                    gameState: {
                                        ...ctx.gameState,
                                        table: {
                                            ...ctx.gameState.table,
                                            cardStack: {
                                                ...ctx.gameState.table.cardStack,
                                                [getBaSyouID(baSyou)]: fromCS.sort(
                                                    () => Math.random() - 0.5
                                                ),
                                            },
                                        },
                                    },
                                };
                            }
                            ctx = {
                                ...ctx,
                                gameState: {
                                    ...ctx.gameState,
                                    flowMemory: {
                                        ...ctx.gameState.flowMemory,
                                        state: "whoFirst",
                                    },
                                },
                            };
                            break;
                        }
                        case "whoFirst": {
                            ctx = {
                                ...ctx,
                                gameState: {
                                    ...ctx.gameState,
                                    flowMemory: {
                                        ...ctx.gameState.flowMemory,
                                        state: "draw6AndConfirm",
                                    },
                                },
                            };
                            break;
                        }
                        case "draw6AndConfirm": {
                            ctx = {
                                ...ctx,
                                gameState: {
                                    ...ctx.gameState,
                                    timing: [0, ["リロールフェイズ", "フェイズ開始"]],
                                },
                            };
                            ctx = {
                                ...ctx,
                                gameState: {
                                    ...ctx.gameState,
                                    flowMemory: {
                                        ...ctx.gameState.flowMemory,
                                        state: "playing",
                                    },
                                },
                            };
                            break;
                        }
                    }
                    return ctx;
                }
            }
            // 傷判的規定效果一結束就收集所有破壞的卡並建立破壞而廢棄的效果
            if (
                ctx.gameState.timing[1][0] == "戦闘フェイズ" &&
                ctx.gameState.timing[1][1] == "ダメージ判定ステップ" &&
                ctx.gameState.timing[1][2] == "規定の効果"
            ) {
                // 更新所有破壞而廢棄的效果
                // 若有產生值，在下一步時主動玩家就要拿到決定解決順序的指令
                let gameState = updateDestroyEffect(ctx.gameState);
                ctx = {
                    ...ctx,
                    gameState: gameState as GameStateWithFlowMemory
                }
            }
            // 回合結束時切換主動玩家
            if (
                ctx.gameState.timing[1][0] == "戦闘フェイズ" &&
                ctx.gameState.timing[1][1] == "ターン終了時" &&
                ctx.gameState.timing[1][2] == "効果終了。ターン終了"
            ) {
                if (ctx.gameState.activePlayerID == null) {
                    throw new Error("activePlayerID not found");
                }
                ctx = {
                    ...ctx,
                    gameState: {
                        ...ctx.gameState,
                        activePlayerID: getOpponentPlayerID(ctx.gameState.activePlayerID),
                    },
                };
            }
            // 下一步
            {
                const nextTiming = getNextTiming(ctx.gameState.timing);
                ctx = {
                    ...ctx,
                    gameState: {
                        ...ctx.gameState,
                        timing: nextTiming,
                    },
                };
            }
            // p34
            // 戰鬥階段的每個步驟開始時，確認是否交戰中
            if (
                ctx.gameState.timing[1][0] == "戦闘フェイズ" &&
                ctx.gameState.timing[1][2] == "ステップ開始"
            ) {
                ctx = { ...ctx, gameState: checkIsBattle(ctx.gameState) as GameStateWithFlowMemory };
            }
            // 重設觸發flag
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasTriggerEvent: false,
                    },
                },
            };
            // 重設宣告結束的flag
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassPhase: {},
                    },
                },
            };
            // 自動更新指令
            ctx = updateCommand(ctx);
            return ctx;
        }
        case "FlowAddBlock": {
            let block = flow.block;
            block = {
                ...block,
                id: `FlowAddBlock_${idSeq++}`,
                cause: {
                    id: "BlockPayloadCauseGameRule",
                    playerID: flow.responsePlayerID,
                    description: flow.description || "",
                },
                //...(block.require ? { require: wrapRequireKey(block.require) } : null),
            };
            let gameState = addImmediateEffect(ctx.gameState, block)
            ctx = {
                ...ctx,
                gameState: gameState as GameStateWithFlowMemory
            }
            // ctx = {
            //   ...ctx,
            //   gameState: {
            //     ...ctx.gameState,
            //     immediateEffect: [block, ...ctx.gameState.immediateEffect],
            //   },
            // };
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasTriggerEvent: true,
                    },
                },
            };
            return ctx;
        }
        case "FlowHandleDamageStepRule": {
            // 傷害計算並造成傷害
            const attackPlayerID = ctx.gameState.activePlayerID;
            if (attackPlayerID == null) {
                throw new Error("attackPlayerID not found");
            }
            const guardPlayerID = getOpponentPlayerID(attackPlayerID);
            // 速度1
            let gameState = ctx.gameState as GameState
            gameState = handleAttackDamage(
                gameState,
                attackPlayerID,
                guardPlayerID,
                "戦闘エリア（左）",
                1
            );
            gameState = handleAttackDamage(
                gameState,
                attackPlayerID,
                guardPlayerID,
                "戦闘エリア（右）",
                1
            );
            // 速度2
            gameState = handleAttackDamage(
                gameState,
                attackPlayerID,
                guardPlayerID,
                "戦闘エリア（左）",
                2
            );
            gameState = handleAttackDamage(
                gameState,
                attackPlayerID,
                guardPlayerID,
                "戦闘エリア（右）",
                2
            );
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                gameState: {
                    ...gameState as GameStateWithFlowMemory,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasTriggerEvent: true,
                    },
                },
            };
            return ctx;
        }
        case "FlowHandleReturnStepRule": {
            // TODO: 如果地形不適應，移到廢棄庫
            // {
            //   ctx = updateEffect(ctx);
            // }
            // const cardsInBattleArea = iterateCard(ctx.gameState.table).filter(
            //   (card) => {
            //     switch (getCardBaSyou(ctx, card.id).value[1]) {
            //       case "戦闘エリア（右）":
            //       case "戦闘エリア（左）":
            //         return true;
            //       default:
            //         return false;
            //     }
            //   }
            // );
            // // 移動到配置區
            // ctx = cardsInBattleArea.reduce((ctx, card) => {
            //   const cardNotInBattleArea =
            //     cardsInBattleArea.map((c) => c.id).includes(card.id) == false;
            //   if (cardNotInBattleArea) {
            //     return ctx;
            //   }
            //   const cardController = getCardController(ctx, card.id);
            //   const fromBaSyou = getCardBaSyou(ctx, card.id);
            //   const toBaSyou: AbsoluteBaSyou = {
            //     ...fromBaSyou,
            //     value: [cardController, "配備エリア"],
            //   };
            //   const table = moveCard(
            //     ctx.gameState.table,
            //     getBaSyouID(fromBaSyou),
            //     getBaSyouID(toBaSyou),
            //     card.id,
            //     null
            //   );
            //   return {
            //     ...ctx,
            //     gameState: {
            //       ...ctx.gameState,
            //       table: table,
            //     },
            //   };
            // }, ctx);
            // // 横置
            // {
            //   ctx = mapCard(ctx, (card) => {
            //     const cardNotInBattleArea =
            //       cardsInBattleArea.map((c) => c.id).includes(card.id) == false;
            //     if (cardNotInBattleArea) {
            //       return card;
            //     }
            //     return {
            //       ...card,
            //       tap: true,
            //     };
            //   });
            // }
            // // set hasTriggerEvent
            // ctx = {
            //   ...ctx,
            //   gameState: {
            //     ...ctx.gameState,
            //     flowMemory: {
            //       ...ctx.gameState.flowMemory,
            //       hasTriggerEvent: true,
            //     },
            //   },
            // };
            return ctx;
        }
        case "FlowHandleStackEffectFinished": {
            let gameState = triggerTextEvent(ctx.gameState, {
                id: "カット終了時",
                effects: ctx.gameState.stackEffectMemory,
            });
            ctx = {
                ...ctx,
                gameState: {
                    ...gameState as GameStateWithFlowMemory,
                    stackEffectMemory: [],
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        shouldTriggerStackEffectFinishedEvent: false,
                    },
                },
            };
            return ctx;
        }
        case "FlowPassPayCost": {
            const effect = iterateEffect(ctx.gameState).find((e) => e.id == flow.effectID);
            if (effect == null) {
                throw new Error(`effectID not found:${flow.effectID}`);
            }
            //assertBlockPayloadTargetTypeValueLength(effect);
            ctx = {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassPayCost: {
                            ...ctx.gameState.flowMemory.hasPlayerPassPayCost,
                            [playerID]: true,
                        },
                    },
                },
            };
            return ctx;
        }
        case "FlowMakeDestroyOrder": {
            const willAddedDestroyEffect = ctx.gameState.destroyEffect.filter((a) => {
                return ctx.gameState.stackEffect.find((b) => a.id == b.id) == null;
            });
            if (flow.destroyEffect.length != willAddedDestroyEffect.length) {
                throw new Error("長度不符合");
            }
            return {
                ...ctx,
                gameState: {
                    ...ctx.gameState,
                    // 移除破壞效果，全部移到堆疊
                    destroyEffect: [],
                    stackEffect: [
                        ...willAddedDestroyEffect,
                        ...ctx.gameState.stackEffect,
                    ],
                    // 重設切入旗標，讓玩家再次切入
                    flowMemory: {
                        ...ctx.gameState.flowMemory,
                        hasPlayerPassCut: {},
                    },
                },
            };
        }
        case "FlowHandleRerollPhaseRule": {
            // const activePlayerID = ctx.gameState.activePlayerID;
            // if (activePlayerID == null) {
            //   throw new Error("activePlayer not found");
            // }
            // // 先更新效果
            // ctx = updateEffect(ctx);
            // const myCards = iterateCard(ctx.gameState.table)
            //   // 我控制的
            //   .filter((card) => {
            //     return getCardController(ctx, card.id) == activePlayerID;
            //   })
            //   // 可以重置的
            //   .filter((card) => {
            //     // 檢查是否可以重置
            //     // 必須在updateEffect之後呼叫才能確保卡片效果有在作用
            //     return isCanReroll(ctx, null, card.id);
            //   });
            // // 重置控制者為主動玩家的卡
            // ctx = mapCard(ctx, (card) => {
            //   const isNotMyCard = myCards.map((c) => c.id).includes(card.id) == false;
            //   if (isNotMyCard) {
            //     return card;
            //   }
            //   return {
            //     ...card,
            //     tap: false,
            //   };
            // });
            // // set hasTriggerEvent
            // ctx = {
            //   ...ctx,
            //   gameState: {
            //     ...ctx.gameState,
            //     flowMemory: {
            //       ...ctx.gameState.flowMemory,
            //       hasTriggerEvent: true,
            //     },
            //   },
            // };
            return ctx;
        }
    }
    return ctx;
}