// 179028_10D_C_BL070N_blue
// N
// OO
// 希望の光
// 強化　再生
// （常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。
export const prototype = {
    commandText: {
        id: "",
        title: ["使用型", ["常時"]],
        description: "（常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。",
        testEnvs: [
            {
                addCards: [
                    ["自軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }]],
                    ["敵軍", "戦闘エリア1", [{ id: "unit2", protoID: "unit" }]]
                ],
                checkFn: function (ctx, { DefineFn, GameStateFn, Options }) {
                    if (Options.ges?.find(ge => ge.title[0] == "＋x／＋x／＋xを得る" && ge.cardIds.includes("unit")) == null) {
                        throw new Error();
                    }
                }
            },
            {
                thisCard: ["自軍", "配備エリア", { id: "unit", protoID: "unit" }, { destroyReason: { id: "戦闘ダメージ", playerID: "PlayerA" } }],
                checkFn: function (ctx, { DefineFn, GameStateFn, Options }) {
                    if (GameStateFn.getItemState(ctx, "unit").destroyReason != null) {
                        throw new Error();
                    }
                }
            }
        ],
        conditions: {
            "交戦中の自軍ユニット１枚は": {
                title: ["Entity", { isBattle: true, side: "自軍", is: ["ユニット"], count: 1 }]
            },
            "非交戦中の自軍ユニット１枚の破壊": {
                title: ["Entity", { isBattle: false, side: "自軍", is: ["ユニット"], count: 1, isDestroy: true }]
            }
        },
        // logicTreeActions只能支援一個元素, 不能多個
        logicTreeActions: [
            {
                logicTree: {
                    type: "Or",
                    children: [
                        {
                            type: "Leaf",
                            value: "交戦中の自軍ユニット１枚は"
                        },
                        {
                            type: "Leaf",
                            value: "非交戦中の自軍ユニット１枚の破壊"
                        }
                    ]
                },
                actions: [
                    {
                        title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                            const cardId = DefineFn.EffectFn.getCardID(effect);
                            const enable1 = DefineFn.ItemStateFn.hasTip(GameStateFn.getItemState(ctx, cardId), "交戦中の自軍ユニット１枚は");
                            if (enable1) {
                                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "交戦中の自軍ユニット１枚は", cardId);
                                for (const pair of pairs) {
                                    ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, effect, [{ title: ["＋x／＋x／＋xを得る", [3, 3, 3]], cardIds: [pair[0]] }], pair, Options);
                                }
                                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.clearTip(is, "交戦中の自軍ユニット１枚は"));
                            }
                            const enable2 = DefineFn.ItemStateFn.hasTip(GameStateFn.getItemState(ctx, cardId), "非交戦中の自軍ユニット１枚の破壊");
                            if (enable2) {
                                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "非交戦中の自軍ユニット１枚の破壊", cardId);
                                for (const pair of pairs) {
                                    ctx = GameStateFn.doItemSetDestroy(ctx, effect, null, pair, Options);
                                }
                                ctx = GameStateFn.mapItemState(ctx, cardId, is => DefineFn.ItemStateFn.clearTip(is, "非交戦中の自軍ユニット１枚の破壊"));
                            }
                            return ctx;
                        }.toString()
                    }
                ]
            },
        ]
    }
};
