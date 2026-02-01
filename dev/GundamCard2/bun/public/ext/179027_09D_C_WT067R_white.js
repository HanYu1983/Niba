export const prototype = {
    commandText: {
        id: "",
        description: "（自軍ターン）：任意の枚数の敵軍ユニットに、Xダメージを振り分けて与える。",
        title: ["使用型", ["自軍", "ターン"]],
        conditions: {
            "任意の枚数の敵軍ユニット": {
                title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                    const cardId = DefineFn.EffectFn.getCardID(effect);
                    const count = GameStateFn.getCardTipStrBaSyouPairs(ctx, DefineFn.TipFn.createTotalCostKey(), cardId).length;
                    return GameStateFn.createTipByEntitySearch(ctx, effect, {
                        atBa: true,
                        side: "敵軍",
                        is: ["ユニット"],
                        count: count,
                        isRepeat: true,
                    }, { ges: Options.ges });
                }.toString(),
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: ["_１ダメージを与える", 1],
                        vars: ["任意の枚数の敵軍ユニット"],
                        description: "任意の枚数の敵軍ユニット"
                    },
                ]
            }
        ],
    },
};
