import { getEffect, getTopEffect } from "../gameState/EffectStackComponent";
import { Flow } from "./Flow";
import { getActiveEffectID, getActiveLogicID, getActiveLogicSubID, getCommandEffecTips, getEffectIncludePlayerCommand } from "./effect";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";
import { PlayerA, PlayerB, PlayerIDFn } from "../define/PlayerID";
import { AbsoluteBaSyouFn } from "../define/BaSyou";
import { Effect, EffectFn } from "../define/Effect";
import { getPlayerCommandsFilterNoErrorDistinct } from "./updateCommand";
import { getAttackPhaseRuleEffect } from "../gameState/getAttackPhaseRuleEffect";
import { getDrawPhaseRuleEffect } from "../gameState/getDrawPhaseRuleEffect";
import { getRerollPhaseRuleEffect } from "../gameState/getRerollPhaseRuleEffect";
import { getDamageRuleEffect } from "../gameState/getDamageRuleEffect";
import { getReturnRuleEffect } from "../gameState/getReturnRuleEffect";
import { clearTipSelectionForUser, createCommandEffectTips, createEffectTips, getConditionTitleFn } from "../gameState/effect";
import { CommandEffecTipFn } from "../define/CommandEffectTip";
import { createBridge } from "../bridge/createBridge";
import { getActivePlayerID } from "../gameState/ActivePlayerComponent";

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
        const currentActiveEffect = getEffectIncludePlayerCommand(ctx, activeEffectID)
        if (currentActiveEffect == null) {
            throw new Error("activeEffectID not found");
        }
        // 是否決定了使用哪個邏輯
        const activeLogicID = getActiveLogicID(ctx)
        if (activeLogicID == null) {
            const controller = EffectFn.getPlayerID(currentActiveEffect);
            if (controller != playerID) {
                return [
                    {
                        id: "FlowObserveEffect",
                        effectID: activeEffectID,
                        description: `觀察正在支付的效果: ${currentActiveEffect.description}`
                    },
                ];
            }
            const cets = createCommandEffectTips(ctx, currentActiveEffect).filter(CommandEffecTipFn.filterNoError)
            // 必須至少有一個正確邏輯可用, 不然不能到這一步
            if (cets.length == 0) {
                throw new Error(`cets.length must > 0`);
            }
            // 讓效果擁用者選定邏輯
            return [
                {
                    id: "FlowSetActiveLogicID",
                    logicID: cets[0].logicID,
                    logicSubID: cets[0].logicSubID,
                    tips: cets,
                }
            ]
        }
        // 如果決定了邏輯, 那子元素的ID則已選定
        const activeLogicSubID = getActiveLogicSubID(ctx)
        if (activeLogicSubID == null) {
            throw new Error(`activeLogicSubID must exist now`)
        }
        const enablePayCost = true;
        if (enablePayCost) {
            const effectCreator = EffectFn.getPlayerID(currentActiveEffect);
            const tipOrErrors = createEffectTips(ctx, currentActiveEffect, activeLogicID, activeLogicSubID, { isCheckUserSelection: true })
            const toes = tipOrErrors.filter(toe => toe.errors.length != 0)
            const playerTips = toes.filter(info => {
                const condition = currentActiveEffect.text.conditions?.[info.conditionKey]
                if (condition?.relatedPlayerSideKeyword == "敵軍") {
                    return effectCreator != playerID
                }
                return effectCreator == playerID
            }).map(info => {
                if (info.tip == null) {
                    throw new Error(`info.tip must found`)
                }
                return {
                    id: "FlowSetTipSelection",
                    effectID: currentActiveEffect.id,
                    conditionKey: info.conditionKey,
                    tip: info.tip,
                    description: `select ${info.conditionKey}`
                } as Flow
            })
            // ======
            const isPass = !!ctx.flowMemory.hasPlayerPassPayCost[playerID];
            const isOpponentPass =
                !!ctx.flowMemory.hasPlayerPassPayCost[
                PlayerIDFn.getOpponent(playerID)
                ];
            if (isPass && isOpponentPass) {
                if (effectCreator != playerID) {
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
                        logicID: activeLogicID,
                        logicSubID: activeLogicSubID,
                    },
                ];
            } else if (isPass || isOpponentPass) {
                if (effectCreator == playerID) {
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
                        ...(playerTips.length ?
                            playerTips :
                            [{
                                id: "FlowPassPayCost",
                                effectID: activeEffectID,
                            }] as Flow[])
                    ];

                }
            }
            if (effectCreator != playerID) {
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
                ...(playerTips.length ?
                    playerTips :
                    [{
                        id: "FlowPassPayCost",
                        effectID: activeEffectID,
                    }] as Flow[])
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
            // Event no playerID
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
        const effect = myEffect[0]
        // temp test
        {
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length == 0) {
                throw new Error(`cets.length must not 0`)
            }
        }
        const optionEffect = myEffect.filter((v) => v.isOption == true);
        // temp test
        if (optionEffect.length) {
            const effect = optionEffect[0]
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length == 0) {
                throw new Error(`cets.length must not 0`)
            }
        }
        return [
            ...(myEffect.length
                ? [
                    {
                        id: "FlowSetActiveEffectID",
                        effectID: effect.id,
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
    const myCommandList = getPlayerCommandsFilterNoErrorDistinct(ctx, playerID).map(tip => tip.effect)
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
                    const effect = myCommandList[0]
                    // temp test
                    {
                        const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
                        if (cets.length == 0) {
                            throw new Error(`cets.length must not 0`)
                        }
                    }
                    return [
                        {
                            id: "FlowSetActiveEffectID",
                            effectID: effect.id,
                            tips: myCommandList,
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
        // temp test
        {
            const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
            if (cets.length == 0) {
                throw new Error(`cets.length must not 0`)
            }
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
                    const effect = myCommandList[0]
                    // temp test
                    {
                        const cets = createCommandEffectTips(ctx, effect).filter(CommandEffecTipFn.filterNoError)
                        if (cets.length == 0) {
                            throw new Error(`cets.length must not 0`)
                        }
                    }
                    return [
                        {
                            id: "FlowSetActiveEffectID",
                            effectID: effect.id,
                            description: "選擇一個指令",
                            tips: myCommandList,
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
            break;
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
                                    return [
                                        {
                                            id: "FlowAddBlock",
                                            description: `${phase[1]}規定效果`,
                                            block: getAttackPhaseRuleEffect(ctx, ctx.activePlayerID),
                                        },
                                    ];
                                case "防御ステップ": {
                                    return [
                                        {
                                            id: "FlowAddBlock",
                                            description: `${phase[1]}規定效果`,
                                            block: getAttackPhaseRuleEffect(ctx, PlayerIDFn.getOpponent(ctx.activePlayerID)),
                                        },
                                    ];
                                }
                                case "ダメージ判定ステップ":
                                    return [
                                        {
                                            id: "FlowAddBlock",
                                            description: `${phase[1]}規定效果`,
                                            block: getDamageRuleEffect(ctx, ctx.activePlayerID),
                                        },
                                    ];
                                case "帰還ステップ":
                                    return [
                                        {
                                            id: "FlowAddBlock",
                                            description: `${phase[1]}規定效果`,
                                            block: getReturnRuleEffect(ctx, playerID),
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