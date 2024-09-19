import { getEffect, getTopEffect } from "../gameState/EffectStackComponent";
import { Flow } from "./Flow";
import { getActiveEffectID } from "./effect";
import { getPlayEffects } from "../gameState/getPlayEffects";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { AbsoluteBaSyouFn, BattleAreaKeyword } from "../define/BaSyou";
import { Effect, EffectFn } from "../define/Effect";
import { getPlayerCommandsFilterNoErrorDistinct } from "./updateCommand";
import { ToolFn } from "../tool";
import { getAttackPhaseRuleEffect } from "../gameState/getAttackPhaseRuleEffect";
import { getDrawPhaseRuleEffect } from "../gameState/getDrawPhaseRuleEffect";
import { getRerollPhaseRuleEffect } from "../gameState/getRerollPhaseRuleEffect";

export function queryFlow(ctx: GameStateWithFlowMemory, playerID: string): Flow[] {
    if (true) {
        const hasSomeoneLiveIsZero =
            [PlayerA, PlayerB]
                .map((pid) => {
                    return AbsoluteBaSyouFn.toString(AbsoluteBaSyouFn.of(pid, "本国"));
                })
                .map((baSyouID) => {
                    return ctx.table.cardStack[baSyouID] || [];
                })
                .filter((cards) => {
                    return cards.length == 0;
                }).length > 0;
        if (hasSomeoneLiveIsZero) {
            console.log(ctx);
            return [{ id: "FlowWaitPlayer", description: "遊戲結束" }];
        }
    }
    // 有玩家在支付卡片
    const activeEffectID = getActiveEffectID(ctx)
    if (activeEffectID != null) {
        const currentActiveEffect = getEffect(ctx, activeEffectID)
        if (currentActiveEffect == null) {
            throw new Error("activeEffectID not found");
        }
        const enablePayCost = true;
        if (enablePayCost) {
            const controller = EffectFn.getPlayerID(currentActiveEffect);
            const isPass = !!ctx.flowMemory.hasPlayerPassPayCost[playerID];
            const isOpponentPass =
                !!ctx.flowMemory.hasPlayerPassPayCost[
                PlayerIDFn.getOpponent(playerID)
                ];
            if (isPass && isOpponentPass) {
                if (controller != playerID) {
                    return [
                        {
                            id: "FlowObserveEffect",
                            effectID: activeEffectID,
                            description: `觀察正在支付的效果: ${currentActiveEffect.description}`
                        },
                    ];
                }
                return [
                    {
                        id: "FlowDoEffect",
                        effectID: activeEffectID,
                        logicID: 0,
                        logicSubID: 0,
                    },
                ];
            } else if (isPass || isOpponentPass) {
                if (controller == playerID) {
                    if (isPass) {
                        return [
                            {
                                id: "FlowObserveEffect",
                                effectID: activeEffectID,
                                description: `觀察正在支付的效果: ${currentActiveEffect.description}`
                            },
                        ];
                    }
                } else {
                    if (isOpponentPass == false) {
                        return [
                            {
                                id: "FlowObserveEffect",
                                effectID: activeEffectID,
                                description: `觀察正在支付的效果: ${currentActiveEffect.description}`
                            },
                        ];
                    }
                    return [
                        {
                            id: "FlowPassPayCost",
                            effectID: activeEffectID,
                        },
                    ];
                }
            }
            if (controller != playerID) {
                return [
                    {
                        id: "FlowWaitPlayer",
                        description: "等待對方支付ActiveEffectID",
                    },
                ];
            }
            return [
                {
                    id: "FlowCancelActiveEffectID",
                    description: "取消支付效果，讓其它玩家可以支付",
                },
                {
                    id: "FlowPassPayCost",
                    effectID: activeEffectID,
                },
            ];
        }

        const controller = EffectFn.getPlayerID(currentActiveEffect);
        if (controller != playerID) {
            return [
                {
                    id: "FlowWaitPlayer",
                    description: "等待對方支付ActiveEffectID",
                },
                {
                    id: "FlowObserveEffect",
                    effectID: activeEffectID,
                    description: `觀察正在支付的效果: ${currentActiveEffect.description}`
                },
            ];
        }
        return [
            {
                id: "FlowCancelActiveEffectID",
                description: "取消支付效果，讓其它玩家可以支付",
            },
            {
                id: "FlowDoEffect",
                effectID: activeEffectID,
                logicID: 0,
                logicSubID: 0
            },
        ];
    }
    // 處理立即效果
    if (ctx.immediateEffect.length) {
        const isActivePlayer = ctx.activePlayerID == playerID;
        const myEffect: Effect[] = [];
        const opponentEffect: Effect[] = [];
        ctx.immediateEffect.forEach((effectID) => {
            const effect = getEffect(ctx, effectID) as Effect
            const controller = EffectFn.getPlayerID(effect);
            if (controller == playerID) {
                myEffect.push(effect);
            } else {
                opponentEffect.push(effect);
            }
        });
        // 不是主動玩家的情況，要等主動玩家先處理完起動效果才行
        if (isActivePlayer == false) {
            if (opponentEffect.length) {
                return [
                    {
                        id: "FlowWaitPlayer",
                        description: "等待主動玩家處理起動效果",
                    },
                ];
            }
        }
        // 主動玩家
        if (myEffect.length == 0) {
            return [
                {
                    id: "FlowWaitPlayer",
                    description: "等待被動玩家處理起動效果",
                },
            ];
        }
        const optionEffect = myEffect.filter((v) => v.isOption == true);
        return [
            ...(myEffect.length
                ? [
                    {
                        id: "FlowSetActiveEffectID",
                        effectID: myEffect[0].id || "unknown",
                        description: "選擇一個起動效果",
                        tips: myEffect,
                    } as Flow,
                ]
                : []),
            ...(optionEffect.length
                ? [
                    {
                        id: "FlowDeleteImmediateEffect",
                        effectID: optionEffect[0].id,
                        description: "你可以放棄這些效果",
                        tips: optionEffect,
                    } as Flow,
                ]
                : []),
        ];
    }
    if (ctx.flowMemory.shouldTriggerStackEffectFinishedEvent) {
        const isActivePlayer = ctx.activePlayerID == playerID;
        if (isActivePlayer == false) {
            return [
                {
                    id: "FlowWaitPlayer",
                    description: "等待主動玩家處理",
                },
            ];
        }
        return [
            {
                id: "FlowHandleStackEffectFinished",
                description: "處理堆疊結束",
            },
        ];
    }
    // 破壞效果，如果效果多於1個，則讓主動玩家選擇順序
    SelectDestroyOrder: {
        switch (ctx.phase[1][0]) {
            case "戦闘フェイズ":
                switch (ctx.phase[1][1]) {
                    case "ダメージ判定ステップ":
                        switch (ctx.phase[1][2]) {
                            case "規定の効果":
                                break SelectDestroyOrder;
                        }
                }
                // 因為destroyEffect可以重復刷新，所以在加入到堆疊時，不能加入重復的
                const willAddedDestroyEffects = ctx.destroyEffect.filter(
                    (a) => {
                        return ctx.stackEffect.find((id) => a.id == id) == null;
                    }
                );
                if (willAddedDestroyEffects.length) {
                    const isActivePlayer = ctx.activePlayerID == playerID;
                    if (isActivePlayer == false) {
                        return [
                            {
                                id: "FlowWaitPlayer",
                                description: "等待主動玩家決定破壞廢棄效果的順序",
                            },
                        ];
                    }
                    return [
                        {
                            id: "FlowMakeDestroyOrder",
                            destroyEffect: willAddedDestroyEffects,
                            description: "決定破壞廢棄效果的順序",
                        },
                    ];
                }
        }
    }
    const myCommandList = getPlayerCommandsFilterNoErrorDistinct(ctx, playerID)
    // 處理堆疊效果，從最上方開始處理
    if (ctx.stackEffect.length) {
        // 取得最上方的效果
        const effect = getTopEffect(ctx);
        if (effect == null) {
            throw new Error("effect not found")
        }

        if (effect.id == null) {
            throw new Error("effect.id not found");
        }
        // 取得效果的控制者
        const controller = EffectFn.getPlayerID(effect);
        // 判斷切入流程
        const isAllPassCut =
            !!ctx.flowMemory.hasPlayerPassCut[PlayerA] &&
            !!ctx.flowMemory.hasPlayerPassCut[PlayerB];
        // 如果雙方玩家還沒放棄切入
        if (isAllPassCut == false) {
            // 如果我宣告了放棄切入，回傳取消
            const isPassCut = ctx.flowMemory.hasPlayerPassCut[playerID];
            if (isPassCut) {
                return [
                    {
                        id: "FlowCancelPassCut",
                    },
                ];
            }
            // 雙方現在都可以切入，但要判斷切入的優先權在誰那
            // 如果堆疊最上方的控制者是自己，則優先權在對方。必須等對方宣告放棄切入
            if (controller == playerID) {
                const opponentPlayerID = playerID == PlayerA ? PlayerB : PlayerA;
                const isOpponentPassCut =
                    ctx.flowMemory.hasPlayerPassCut[opponentPlayerID];
                if (!isOpponentPassCut) {
                    return [
                        {
                            id: "FlowWaitPlayer",
                            description: "現在的切入優先權在對方",
                        },
                    ];
                }
            }
            return [
                // 可以切入的指令
                ...((): Flow[] => {
                    if (myCommandList.length == 0) {
                        return [];
                    }
                    return [
                        {
                            id: "FlowSetActiveEffectID",
                            effectID: myCommandList[0].id || "unknown",
                            tips: myCommandList.map(i => i.effect),
                            description: "你可以切入",
                        },
                    ];
                })(),
                // 宣告放棄切入
                {
                    id: "FlowPassCut",
                },
            ];
        }
        // 雙方都已放棄切入，等待堆疊中的效果控制者處理
        if (controller != playerID) {
            return [
                {
                    id: "FlowWaitPlayer",
                    description: "等待效果控制者處理",
                },
            ];
        }
        return [
            {
                id: "FlowSetActiveEffectID",
                effectID: effect.id,
                description: "支付最上方的堆疊效果",
                tips: [effect],
            },
        ];
    }

    const handleFreeTiming = (): Flow[] => {
        const isAllPassPhase =
            !!ctx.flowMemory.hasPlayerPassPhase[PlayerA] &&
            !!ctx.flowMemory.hasPlayerPassPhase[PlayerB];
        if (isAllPassPhase == false) {
            if (ctx.flowMemory.hasPlayerPassPhase[playerID]) {
                return [
                    {
                        id: "FlowCancelPassPhase",
                        description: `等待對方結束或是取消[${ctx.phase}]結束`,
                    },
                ];
            }
            return [
                {
                    id: "FlowPassPhase",
                    description: `宣告[${ctx.phase}]結束`,
                },
                // 處理指令
                ...((): Flow[] => {
                    if (myCommandList.length == 0) {
                        return [];
                    }
                    return [
                        {
                            id: "FlowSetActiveEffectID",
                            effectID: myCommandList[0].id || "unknown",
                            description: "選擇一個指令",
                            tips: myCommandList.map(i => i.effect),
                        },
                    ];
                })(),
            ];
        }
        if (playerID != ctx.activePlayerID) {
            return [
                {
                    id: "FlowWaitPlayer",
                    description: "等待伺服器處理",
                },
            ];
        }
        return [
            {
                id: "FlowNextTiming",
            },
        ];
    };
    {
        // 處理遊戲開始的效果
        // 在FlowNextTiming處理
        if (ctx.flowMemory.state == "prepareDeck") {
            if (playerID != PlayerA) {
                return [
                    {
                        id: "FlowWaitPlayer",
                        description: "等待伺服器處理",
                    },
                ];
            }
            return [{ id: "FlowNextTiming", description: "準備卡組" }];
        }
        if (ctx.flowMemory.state == "whoFirst") {
            if (playerID != PlayerA) {
                return [
                    {
                        id: "FlowWaitPlayer",
                        description: "等待伺服器處理",
                    },
                ];
            }
            return [{ id: "FlowNextTiming", description: "PlayerA先攻" }];
        }
        if (ctx.flowMemory.state == "draw6AndConfirm") {
            if (playerID != PlayerA) {
                return [
                    {
                        id: "FlowWaitPlayer",
                        description: "等待伺服器處理",
                    },
                ];
            }
            return [{ id: "FlowNextTiming", description: "抽6張" }];
        }
    }
    const phase = ctx.phase;
    // 處理自由時間，必須雙方都宣告結束才能進行到下一步
    switch (phase[0]) {
        case "ドローフェイズ":
        case "リロールフェイズ":
        case "配備フェイズ":
            switch (phase[1]) {
                case "フリータイミング": {
                    return handleFreeTiming();
                }
            }
        case "戦闘フェイズ":
            switch (phase[1]) {
                case "攻撃ステップ":
                case "防御ステップ":
                case "帰還ステップ":
                case "ダメージ判定ステップ":
                    switch (phase[2]) {
                        case "フリータイミング":
                        case "フリータイミング2": {
                            return handleFreeTiming();
                        }
                    }
            }
            break;
    }
    // 之後的都是系統事件，由主動玩家呼叫
    if (playerID != ctx.activePlayerID) {
        return [
            {
                id: "FlowWaitPlayer",
                description: "等待伺服器處理",
            },
        ];
    }
    switch (phase[0]) {
        case "ドローフェイズ":
        case "リロールフェイズ":
        case "配備フェイズ":
            switch (phase[1]) {
                case "フェイズ開始":
                case "フェイズ終了":
                    // 如果已經觸發事件
                    if (ctx.flowMemory.hasTriggerEvent) {
                        return [{ id: "FlowNextTiming" }];
                    }
                    return [
                        {
                            id: "FlowTriggerTextEvent",
                            event: {
                                title: ["GameEventOnTiming", ctx.phase]
                            },
                        },
                    ];
                case "規定の効果":
                    // 如果已經觸發規定の効果
                    if (ctx.flowMemory.hasTriggerEvent) {
                        return [{ id: "FlowNextTiming" }];
                    }
                    switch (phase[0]) {
                        case "ドローフェイズ":
                            return [
                                {
                                    id: "FlowAddBlock",
                                    description: `${phase[0]}規定效果`,
                                    block: getDrawPhaseRuleEffect(ctx, playerID),
                                },
                            ];
                        case "リロールフェイズ":
                            return [
                                {
                                    id: "FlowAddBlock",
                                    description: `${phase[0]}規定效果`,
                                    block: getRerollPhaseRuleEffect(ctx, playerID),
                                },
                            ];
                    }
                    break;
            }
            break;
        case "戦闘フェイズ":
            switch (phase[1]) {
                case "攻撃ステップ":
                case "防御ステップ":
                case "帰還ステップ":
                case "ダメージ判定ステップ":
                    switch (phase[2]) {
                        case "ステップ開始":
                        case "ステップ終了":
                            // 如果已經觸發事件
                            if (ctx.flowMemory.hasTriggerEvent) {
                                return [{ id: "FlowNextTiming" }];
                            }
                            return [
                                {
                                    id: "FlowTriggerTextEvent",
                                    event: {
                                        title: ["GameEventOnTiming", ctx.phase]
                                    },
                                },
                            ];
                        case "規定の効果":
                            // 如果已經觸發規定の効果
                            if (ctx.flowMemory.hasTriggerEvent) {
                                return [{ id: "FlowNextTiming" }];
                            }
                            switch (phase[1]) {
                                case "攻撃ステップ":
                                case "防御ステップ": {
                                    return [
                                        {
                                            id: "FlowAddBlock",
                                            description: `${phase[1]}規定效果`,
                                            block: getAttackPhaseRuleEffect(ctx, playerID),
                                        },
                                    ];
                                }
                                case "ダメージ判定ステップ":
                                    return [
                                        {
                                            id: "FlowHandleDamageStepRule",
                                            description: "執行「ダメージ判定ステップ」",
                                        },
                                    ];
                                case "帰還ステップ":
                                    return [
                                        {
                                            id: "FlowHandleReturnStepRule",
                                            description: "執行「帰還ステップ」",
                                        },
                                    ];
                                default:
                                    throw new Error("unknown phase:" + phase[1]);
                            }
                            break;
                    }
                case "ターン終了時":
                    switch (phase[2]) {
                        case "ダメージリセット":
                        case "効果解決":
                        case "手札調整":
                            // 如果玩家手牌超過6張，丟到剩下6張
                            return [
                                { id: "FlowNextTiming", description: `TODO:執行${phase[2]}` },
                            ];
                        case "効果終了。ターン終了":
                            // 如果已經觸發事件
                            if (ctx.flowMemory.hasTriggerEvent) {
                                return [{ id: "FlowNextTiming" }];
                            }
                            return [
                                {
                                    id: "FlowTriggerTextEvent",
                                    event: {
                                        title: ["GameEventOnTiming", ctx.phase]
                                    },
                                },
                            ];
                    }
            }
            break;
    }
}