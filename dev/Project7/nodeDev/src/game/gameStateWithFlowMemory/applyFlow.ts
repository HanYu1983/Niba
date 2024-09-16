import { log } from "../../tool/logger";
import { PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { addImmediateEffect, addStackEffect, getEffect } from "../gameState/EffectStackComponent";
import { triggerEvent, updateDestroyEffect, doPlayerAttack } from "../gameState/GameState";
import { checkIsBattle } from "../gameState/IsBattleComponent";
import { Flow } from "./Flow";
import { GameStateWithFlowMemory, updateCommand } from "./GameStateWithFlowMemory";
import { setActiveEffectID, cancelActiveEffectID, doActiveEffect, deleteImmediateEffect } from "./handleEffect";
import { TimingFn } from "../define/Timing";

let idSeq = 0;
export function applyFlow(
    ctx: GameStateWithFlowMemory,
    playerID: string,
    flow: Flow
): GameStateWithFlowMemory {
    log("applyFlow", playerID, flow);
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
        case "FlowDoEffect": {
            if (flow.effectID == null) {
                throw new Error("effectID not found");
            }
            ctx = doActiveEffect(ctx, playerID, flow.effectID);
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
            // 每執行完一次效果，就更新指令
            ctx = updateCommand(ctx);
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
                log("applyFlow", "已經執行過triggerTextEvent");
                return ctx;
            }
            ctx = triggerEvent(ctx, flow.event) as GameStateWithFlowMemory;
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasTriggerEvent: true,
                },
            };
            return ctx;
        case "FlowUpdateCommand":
            ctx = updateCommand(ctx);
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
            {
                // 處理遊戲開始的效果
                if (ctx.flowMemory.state != "playing") {
                    switch (ctx.flowMemory.state) {
                        case "prepareDeck": {
                            {
                                const plyrID = PlayerA;
                                const baSyou: AbsoluteBaSyou = AbsoluteBaSyouFn.of(plyrID, "本国")
                                const fromCS =
                                    ctx.table.cardStack[AbsoluteBaSyouFn.toString(baSyou)];
                                ctx = {
                                    ...ctx,
                                    table: {
                                        ...ctx.table,
                                        cardStack: {
                                            ...ctx.table.cardStack,
                                            [AbsoluteBaSyouFn.toString(baSyou)]: fromCS.sort(
                                                () => Math.random() - 0.5
                                            ),
                                        },
                                    },
                                };
                            }
                            {
                                const plyrID = PlayerB;
                                const baSyou: AbsoluteBaSyou = AbsoluteBaSyouFn.of(plyrID, "本国")
                                const fromCS =
                                    ctx.table.cardStack[AbsoluteBaSyouFn.toString(baSyou)];
                                ctx = {
                                    ...ctx,
                                    table: {
                                        ...ctx.table,
                                        cardStack: {
                                            ...ctx.table.cardStack,
                                            [AbsoluteBaSyouFn.toString(baSyou)]: fromCS.sort(
                                                () => Math.random() - 0.5
                                            ),
                                        },
                                    },
                                };
                            }
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
                            ctx = {
                                ...ctx,
                                timing: [0, ["リロールフェイズ", "フェイズ開始"]],

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
            }
            // 傷判的規定效果一結束就收集所有破壞的卡並建立破壞而廢棄的效果
            if (
                ctx.timing[1][0] == "戦闘フェイズ" &&
                ctx.timing[1][1] == "ダメージ判定ステップ" &&
                ctx.timing[1][2] == "規定の効果"
            ) {
                // 更新所有破壞而廢棄的效果
                // 若有產生值，在下一步時主動玩家就要拿到決定解決順序的指令
                ctx = updateDestroyEffect(ctx) as GameStateWithFlowMemory;
            }
            // 回合結束時切換主動玩家
            if (
                ctx.timing[1][0] == "戦闘フェイズ" &&
                ctx.timing[1][1] == "ターン終了時" &&
                ctx.timing[1][2] == "効果終了。ターン終了"
            ) {
                if (ctx.activePlayerID == null) {
                    throw new Error("activePlayerID not found");
                }
                ctx = {
                    ...ctx,
                    activePlayerID: PlayerIDFn.getOpponent(ctx.activePlayerID),
                };
            }
            // 下一步
            {
                const nextTiming = TimingFn.getNext(ctx.timing);
                ctx = {
                    ...ctx,
                    timing: nextTiming,
                };
            }
            // p34
            // 戰鬥階段的每個步驟開始時，確認是否交戰中
            if (
                ctx.timing[1][0] == "戦闘フェイズ" &&
                ctx.timing[1][2] == "ステップ開始"
            ) {
                ctx = checkIsBattle(ctx) as GameStateWithFlowMemory
            }
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
            // 自動更新指令
            ctx = updateCommand(ctx);
            return ctx;
        }
        case "FlowAddBlock": {
            let block = flow.block;
            block = {
                ...block,
                id: `FlowAddBlock_${idSeq++}`,
                reason: ["GameRule", flow.responsePlayerID],
                description: flow.description || "",
                //...(block.require ? { require: wrapRequireKey(block.require) } : null),
            };
            ctx = addImmediateEffect(ctx, block) as GameStateWithFlowMemory
            // ctx = {
            //   ...ctx,
            //   gameState: {
            //     ...ctx,
            //     immediateEffect: [block, ...ctx.immediateEffect],
            //   },
            // };
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasTriggerEvent: true,
                }
            };
            return ctx;
        }
        case "FlowHandleDamageStepRule": {
            // 傷害計算並造成傷害
            const attackPlayerID = ctx.activePlayerID;
            if (attackPlayerID == null) {
                throw new Error("attackPlayerID not found");
            }
            // 速度1
            ctx = doPlayerAttack(ctx, attackPlayerID, "戦闘エリア1", 1) as GameStateWithFlowMemory;
            ctx = doPlayerAttack(ctx, attackPlayerID, "戦闘エリア2", 1) as GameStateWithFlowMemory;
            // 速度2
            ctx = doPlayerAttack(ctx, attackPlayerID, "戦闘エリア1", 2) as GameStateWithFlowMemory;
            ctx = doPlayerAttack(ctx, attackPlayerID, "戦闘エリア2", 2) as GameStateWithFlowMemory;
            // set hasTriggerEvent
            ctx = {
                ...ctx,
                flowMemory: {
                    ...ctx.flowMemory,
                    hasTriggerEvent: true,
                },
            };
            return ctx;
        }
        case "FlowHandleReturnStepRule": {
            // TODO: 如果地形不適應，移到廢棄庫
            // {
            //   ctx = updateEffect(ctx);
            // }
            // const cardsInBattleArea = iterateCard(ctx.table).filter(
            //   (card) => {
            //     switch (getCardBaSyou(ctx, card.id).value[1]) {
            //       case "戦闘エリア2":
            //       case "戦闘エリア1":
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
            //     ctx.table,
            //     getBaSyouID(fromBaSyou),
            //     getBaSyouID(toBaSyou),
            //     card.id,
            //     null
            //   );
            //   return {
            //     ...ctx,
            //     gameState: {
            //       ...ctx,
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
            //     ...ctx,
            //     flowMemory: {
            //       ...ctx.flowMemory,
            //       hasTriggerEvent: true,
            //     },
            //   },
            // };
            return ctx;
        }
        case "FlowHandleStackEffectFinished": {
            ctx = triggerEvent(ctx, {
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
            const willAddedDestroyEffect = ctx.destroyEffect.filter((id1) => {
                return ctx.stackEffect.find((id) => id1 == id) == null;
            });
            if (flow.destroyEffect.length != willAddedDestroyEffect.length) {
                throw new Error("長度不符合");
            }
            // 移除破壞效果，全部移到堆疊
            ctx = clearDestroyEffects(ctx)
            for (const effect of flow.destroyEffect) {
                ctx = addStackEffect(ctx, effect) as GameStateWithFlowMemory
            }
            return {
                ...ctx,
                // 重設切入旗標，讓玩家再次切入
                flowMemory: {
                    ...ctx.flowMemory,
                    hasPlayerPassCut: {},
                },
            };
        }
        case "FlowHandleRerollPhaseRule": {
            // const activePlayerID = ctx.activePlayerID;
            // if (activePlayerID == null) {
            //   throw new Error("activePlayer not found");
            // }
            // // 先更新效果
            // ctx = updateEffect(ctx);
            // const myCards = iterateCard(ctx.table)
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
            //     ...ctx,
            //     flowMemory: {
            //       ...ctx.flowMemory,
            //       hasTriggerEvent: true,
            //     },
            //   },
            // };
            return ctx;
        }
    }
    return ctx;
}

function clearDestroyEffects(ctx: GameStateWithFlowMemory): GameStateWithFlowMemory {
    throw new Error("Function not implemented.");
}
