import { PlayerA, PlayerB, getBaSyouID, getOpponentPlayerID, BlockPayload, BattleAreaKeyword } from "../define";
import { iterateEffect } from "../gameState/EffectStackComponent";
import { getBlockOwner } from "../gameState/GameState";
import { Flow } from "./Flow";
import { getActiveEffectID } from "./handleEffect";
import { getClientCommand } from "./getClientCommand";
import { GameStateWithFlowMemory } from "./GameStateWithFlowMemory";

export function queryFlow(ctx: GameStateWithFlowMemory, playerID: string): Flow[] {
    if (true) {
        const hasSomeoneLiveIsZero =
            [PlayerA, PlayerB]
                .map((pid) => {
                    return getBaSyouID({ id: "AbsoluteBaSyou", value: [pid, "本国"] });
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
        const currentActiveEffect = iterateEffect(ctx).find(
            (e) => e.id == activeEffectID
        );
        if (currentActiveEffect == null) {
            throw new Error("activeEffectID not found");
        }

        const enablePayCost = true;
        if (enablePayCost) {
            const controller = getBlockOwner(currentActiveEffect);
            const isPass = !!ctx.flowMemory.hasPlayerPassPayCost[playerID];
            const isOpponentPass =
                !!ctx.flowMemory.hasPlayerPassPayCost[
                getOpponentPlayerID(playerID)
                ];
            if (isPass && isOpponentPass) {
                if (controller != playerID) {
                    return [
                        {
                            id: "FlowObserveEffect",
                            effectID: activeEffectID,
                        },
                    ];
                }
                return [
                    {
                        id: "FlowDoEffect",
                        effectID: activeEffectID,
                    },
                ];
            } else if (isPass || isOpponentPass) {
                if (controller == playerID) {
                    if (isPass) {
                        return [
                            {
                                id: "FlowObserveEffect",
                                effectID: activeEffectID,
                            },
                        ];
                    }
                } else {
                    if (isOpponentPass == false) {
                        return [
                            {
                                id: "FlowObserveEffect",
                                effectID: activeEffectID,
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

        const controller = getBlockOwner(currentActiveEffect);
        if (controller != playerID) {
            return [
                {
                    id: "FlowWaitPlayer",
                    description: "等待對方支付ActiveEffectID",
                },
                {
                    id: "FlowObserveEffect",
                    effectID: activeEffectID,
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
            },
        ];
    }
    // 處理立即效果
    if (ctx.immediateEffect.length) {
        const isActivePlayer = ctx.activePlayerID == playerID;
        const myEffect: BlockPayload[] = [];
        const opponentEffect: BlockPayload[] = [];
        ctx.immediateEffect.forEach((effect) => {
            const controller = getBlockOwner(effect);
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
                        effectID: myEffect[0].id || null,
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
        switch (ctx.timing[1][0]) {
            case "戦闘フェイズ":
                switch (ctx.timing[1][1]) {
                    case "ダメージ判定ステップ":
                        switch (ctx.timing[1][2]) {
                            case "規定の効果":
                                break SelectDestroyOrder;
                        }
                }
                // 因為destroyEffect可以重復刷新，所以在加入到堆疊時，不能加入重復的
                const willAddedDestroyEffect = ctx.destroyEffect.filter(
                    (a) => {
                        return ctx.stackEffect.find((b) => a.id == b.id) == null;
                    }
                );
                if (willAddedDestroyEffect.length) {
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
                            destroyEffect: willAddedDestroyEffect,
                            description: "決定破壞廢棄效果的順序",
                        },
                    ];
                }
        }
    }
    const myCommandList = getClientCommand(ctx, playerID);
    // 處理堆疊效果，從最上方開始處理
    if (ctx.stackEffect.length) {
        // 取得最上方的效果
        const effect = ctx.stackEffect[0];
        if (effect.id == null) {
            throw new Error("effect.id not found");
        }
        // 取得效果的控制者
        const controller = getBlockOwner(effect);
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
                            effectID: myCommandList[0].id || "",
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
                        description: `等待對方結束或是取消[${ctx.timing}]結束`,
                    },
                ];
            }
            return [
                {
                    id: "FlowPassPhase",
                    description: `宣告[${ctx.timing}]結束`,
                },
                // 處理指令
                ...((): Flow[] => {
                    if (myCommandList.length == 0) {
                        return [];
                    }
                    return [
                        {
                            id: "FlowSetActiveEffectID",
                            effectID: myCommandList[0].id || null,
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
    const [id, phase] = ctx.timing;
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
                        case "フリータイミング": {
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
                                id: "GameEventOnTiming",
                                timing: ctx.timing,
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
                                    responsePlayerID: ctx.activePlayerID,
                                    description: `${phase[0]}規定效果`,
                                    block: {
                                        // feedback: [
                                        //   {
                                        //     id: "FeedbackAction",
                                        //     action: [
                                        //       {
                                        //         id: "ActionRuleDraw",
                                        //       },
                                        //     ],
                                        //   },
                                        // ],
                                    },
                                },
                            ];
                        case "リロールフェイズ":
                            // 如果已經觸發規定の効果
                            if (ctx.flowMemory.hasTriggerEvent) {
                                return [{ id: "FlowNextTiming" }];
                            }
                            return [
                                {
                                    id: "FlowHandleRerollPhaseRule",
                                    description: "執行「リロールフェイズ」",
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
                                        id: "GameEventOnTiming",
                                        timing: ctx.timing,
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
                                    const [leftArea, rightArea]: [
                                        BattleAreaKeyword,
                                        BattleAreaKeyword
                                    ] = ["地球エリア", "宇宙エリア"];
                                    const playerID =
                                        phase[1] == "攻撃ステップ"
                                            ? ctx.activePlayerID
                                            : getOpponentPlayerID(ctx.activePlayerID);
                                    return [
                                        {
                                            id: "FlowAddBlock",
                                            description: `${phase[1]}規定效果`,
                                            responsePlayerID: playerID,
                                            block: {
                                                isOption: true,
                                                // contextID: `${phase[1]}規定效果`,
                                                // require: {
                                                //   id: "RequireTarget",
                                                //   targets: {
                                                //     去左方的卡: {
                                                //       id: "カード",
                                                //       value: [],
                                                //     },
                                                //     去右方的卡: {
                                                //       id: "カード",
                                                //       value: [],
                                                //     },
                                                //   },
                                                //   condition: {
                                                //     id: "ConditionAnd",
                                                //     and: [
                                                //       getConditionMacro({
                                                //         id: "變量x的場所包含於y",
                                                //         x: { id: "カード", value: "去左方的卡" },
                                                //         y: [
                                                //           {
                                                //             id: "AbsoluteBaSyou",
                                                //             value: [playerID, "配備エリア"],
                                                //           },
                                                //         ],
                                                //       }),
                                                //       getConditionMacro({
                                                //         id: "變量x的角色包含於y",
                                                //         x: { id: "カード", value: "去左方的卡" },
                                                //         y: ["ユニット"],
                                                //       }),
                                                //       {
                                                //         id: "ConditionCompareString",
                                                //         value: [
                                                //           {
                                                //             id: "字串",
                                                //             value: {
                                                //               path: [
                                                //                 { id: "カード", value: "去左方的卡" },
                                                //                 "的「地形適性」",
                                                //               ],
                                                //             },
                                                //           },
                                                //           "hasToken",
                                                //           { id: "字串", value: ["宇宙エリア"] },
                                                //         ],
                                                //       },
                                                //       getConditionMacro({
                                                //         id: "變量x的場所包含於y",
                                                //         x: { id: "カード", value: "去右方的卡" },
                                                //         y: [
                                                //           {
                                                //             id: "AbsoluteBaSyou",
                                                //             value: [playerID, "配備エリア"],
                                                //           },
                                                //         ],
                                                //       }),
                                                //       getConditionMacro({
                                                //         id: "變量x的角色包含於y",
                                                //         x: { id: "カード", value: "去右方的卡" },
                                                //         y: ["ユニット"],
                                                //       }),
                                                //       {
                                                //         id: "ConditionCompareString",
                                                //         value: [
                                                //           {
                                                //             id: "字串",
                                                //             value: {
                                                //               path: [
                                                //                 { id: "カード", value: "去右方的卡" },
                                                //                 "的「地形適性」",
                                                //               ],
                                                //             },
                                                //           },
                                                //           "hasToken",
                                                //           { id: "字串", value: ["地球エリア"] },
                                                //         ],
                                                //       },
                                                //     ],
                                                //   },
                                                //   action: [
                                                //     {
                                                //       id: "ActionSetTarget",
                                                //       source: "去左方的卡",
                                                //       target: "去左方的卡",
                                                //     },
                                                //     {
                                                //       id: "ActionSetTarget",
                                                //       source: "去右方的卡",
                                                //       target: "去右方的卡",
                                                //     },
                                                //   ],
                                                // },
                                                // feedback: [
                                                //   {
                                                //     id: "FeedbackAction",
                                                //     action: [
                                                //       {
                                                //         id: "ActionMoveCardToPosition",
                                                //         cards: { id: "カード", value: "去左方的卡" },
                                                //         baSyou: {
                                                //           id: "場所",
                                                //           value: [
                                                //             {
                                                //               id: "AbsoluteBaSyou",
                                                //               value: [playerID, "戦闘エリア（左）"],
                                                //             },
                                                //           ],
                                                //         },
                                                //       },
                                                //       {
                                                //         id: "ActionMoveCardToPosition",
                                                //         cards: { id: "カード", value: "去右方的卡" },
                                                //         baSyou: {
                                                //           id: "場所",
                                                //           value: [
                                                //             {
                                                //               id: "AbsoluteBaSyou",
                                                //               value: [playerID, "戦闘エリア（右）"],
                                                //             },
                                                //           ],
                                                //         },
                                                //       },
                                                //     ],
                                                //   },
                                                // ],
                                            },
                                        },
                                    ];
                                }

                                case "ダメージ判定ステップ":
                                    // 如果已經觸發規定の効果
                                    if (ctx.flowMemory.hasTriggerEvent) {
                                        return [{ id: "FlowNextTiming" }];
                                    }
                                    return [
                                        {
                                            id: "FlowHandleDamageStepRule",
                                            description: "執行「ダメージ判定ステップ」",
                                        },
                                    ];
                                case "帰還ステップ":
                                    // 如果已經觸發規定の効果
                                    if (ctx.flowMemory.hasTriggerEvent) {
                                        return [{ id: "FlowNextTiming" }];
                                    }
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
                                        id: "GameEventOnTiming",
                                        timing: ctx.timing,
                                    },
                                },
                            ];
                    }
            }
            break;
    }
}