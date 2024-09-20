import { log } from "../../tool/logger";
import { PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../define/BaSyou";
import { addImmediateEffect, addStackEffect, getEffect } from "../gameState/EffectStackComponent";
import { checkIsBattle } from "../gameState/IsBattleComponent";
import { Flow } from "./Flow";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { setActiveEffectID, cancelActiveEffectID, doActiveEffect, deleteImmediateEffect, clearDestroyEffects, updateDestroyEffect } from "./effect";
import { PhaseFn } from "../define/Timing";
import { doPlayerAttack } from "../gameState/player";
import { triggerEvent } from "../gameState/triggerEvent";
import { ToolFn } from "../tool";
import { updateCommand } from "./updateCommand";
import { getCardLikeItemIdsByBasyou } from "../gameState/ItemTableComponent";
import { TableFns } from "../../tool/table";

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
            if (flow.logicID == null) {
                throw new Error("logicID not found");
            }
            if (flow.logicSubID == null) {
                throw new Error("logicSubID not found");
            }
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
                            {
                                const from = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerA, "本国"))
                                const to = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerA, "手札"))
                                const cards = ctx.table.cardStack[from].slice(0, 6)
                                ctx.table.cardStack[to] = [...cards, ...(ctx.table.cardStack[to] || [])]
                            }
                            {
                                const from = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerB, "本国"))
                                const to = AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(PlayerB, "手札"))
                                const cards = ctx.table.cardStack[from].slice(0, 6)
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
            }
            // 傷判的規定效果一結束就收集所有破壞的卡並建立破壞而廢棄的效果
            if (
                ctx.phase[1][0] == "戦闘フェイズ" &&
                ctx.phase[1][1] == "ダメージ判定ステップ" &&
                ctx.phase[1][2] == "規定の効果"
            ) {
                // 更新所有破壞而廢棄的效果
                // 若有產生值，在下一步時主動玩家就要拿到決定解決順序的指令
                ctx = updateDestroyEffect(ctx) as GameStateWithFlowMemory;
            }
            // 回合結束時切換主動玩家
            if (
                ctx.phase[1][0] == "戦闘フェイズ" &&
                ctx.phase[1][1] == "ターン終了時" &&
                ctx.phase[1][2] == "効果終了。ターン終了"
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
                const nextTiming = PhaseFn.getNext(ctx.phase);
                ctx = {
                    ...ctx,
                    phase: nextTiming,
                };
            }
            // p34
            // 戰鬥階段的每個步驟開始時，確認是否交戰中
            if (
                ctx.phase[1][0] == "戦闘フェイズ" &&
                ctx.phase[1][2] == "ステップ開始"
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
            ctx = addImmediateEffect(ctx, flow.block) as GameStateWithFlowMemory
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
            const willAddedDestroyEffect = ctx.destroyEffect.filter((a) => {
                return ctx.stackEffect.find((id) => a.id == id) == null;
            });
            if (flow.destroyEffect.length != willAddedDestroyEffect.length) {
                throw new Error("長度不符合");
            }
            // 移除破壞效果，全部移到堆疊
            ctx = clearDestroyEffects(ctx) as GameStateWithFlowMemory
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
    }
    return ctx;
}