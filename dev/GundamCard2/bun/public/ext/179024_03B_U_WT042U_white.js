function createRollCostRequire(costNum, color) {
    let ret = {};
    for (let i = 0; i < costNum; ++i) {
        const key = `${i}[${color}]`;
        ret = {
            ...ret,
            [key]: {
                title: ["RollColor", color],
                actions: [
                    {
                        title: ["_ロールする", "ロール"],
                        vars: [key]
                    }
                ]
            }
        };
    }
    return ret;
}
export const prototype = {
    texts: [{
            id: "",
            title: ["使用型", ["自軍", "ダメージ判定ステップ"]],
            description: "（自軍ダメージ判定ステップ）〔１〕：このカードは交戦中の場合、ターン終了時まで＋１／＋１／＋１を得る。または、このカードが非交戦中の場合、敵軍ユニット１枚の上に－１／－１／－１コイン１個を乗せる。",
            conditions: {
                ...createRollCostRequire(1, null),
                "このカードが非交戦中の場合、敵軍ユニット１枚": {
                    title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                        const cardId = DefineFn.EffectFn.getCardID(effect);
                        if (GameStateFn.isBattle(ctx, cardId, null)) {
                            return null;
                        }
                        return GameStateFn.createConditionTitleFn({
                            title: ["Entity", {
                                    atBa: true,
                                    side: "敵軍",
                                    is: ["ユニット"],
                                    count: 1
                                }]
                        })(ctx, effect, { Options });
                    }.toString()
                },
                "このカードは交戦中の場合|または、このカードが非交戦中の場合": {
                    actions: [
                        {
                            title: ["このカードが_戦闘エリアにいる場合", ["戦闘エリア1", "戦闘エリア2"]]
                        }
                    ]
                }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {
                                const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                                    logicTreeAction: {
                                        actions: [
                                            {
                                                title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                                                    const cardId = DefineFn.EffectFn.getCardID(effect);
                                                    if (GameStateFn.isBattle(ctx, cardId, null)) {
                                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, effect, [
                                                            {
                                                                title: ["＋x／＋x／＋xを得る", [1, 1, 1]],
                                                                cardIds: [cardId]
                                                            }
                                                        ], GameStateFn.createStrBaSyouPair(ctx, cardId), Options);
                                                        return ctx;
                                                    }
                                                    return GameStateFn.createActionTitleFn({
                                                        title: ["_－１／－１／－１コイン_１個を乗せる", [-1, -1, -1], 1],
                                                        vars: ["このカードが非交戦中の場合、敵軍ユニット１枚"]
                                                    })(ctx, effect, { Options });
                                                }.toString()
                                            }
                                        ]
                                    }
                                });
                                ctx = GameStateFn.addStackEffect(ctx, newE);
                                return ctx;
                            }.toString()
                        }
                    ]
                }
            ],
        }],
};
