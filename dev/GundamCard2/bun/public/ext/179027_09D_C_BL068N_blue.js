export const prototype = {
    commandText: {
        id: "",
        description: "（常時）：カード１枚を引く。自軍捨て山のカードが０枚の場合、（さらに）カード１枚を引く。",
        title: ["使用型", ["常時"]],
        testEnvs: [
            {
                createCards: [
                    ["自軍", "本国", [["unit", 2]]]
                ]
            }
        ],
        logicTreeActions: [
            {
                actions: [
                    {
                        title: ["cutIn", [
                                {
                                    title: ["カード_１枚を引く", 1],
                                },
                                {
                                    title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                                        const cardId = DefineFn.EffectFn.getCardID(effect);
                                        const suteyamaLen = GameStateFn.getPlayerSuTeYaMaIds(ctx, GameStateFn.getItemController(ctx, cardId)).length;
                                        if (suteyamaLen == 0) {
                                            const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                                                logicTreeAction: {
                                                    actions: [
                                                        {
                                                            title: ["カード_１枚を引く", 1],
                                                        }
                                                    ]
                                                }
                                            });
                                            ctx = GameStateFn.addImmediateEffect(ctx, newE);
                                        }
                                        return ctx;
                                    }.toString(),
                                }
                            ]]
                    }
                ]
            }
        ],
    },
};
