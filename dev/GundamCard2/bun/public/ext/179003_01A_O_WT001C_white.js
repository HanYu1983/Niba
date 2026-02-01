export const prototype = {
    texts: [
        {
            id: "",
            description: "（敵軍戦闘フェイズ）〔白２毎〕：自軍ユニット１枚は、ターン終了時まで「速攻」、または「高機動」１つを得る。",
            title: ["使用型", ["敵軍", "戦闘フェイズ"]],
            isEachTime: true,
            conditions: {
                ...createRollCostRequire(2, "白"),
                "自軍ユニット１枚": {
                    title: ["Entity", {
                            atBa: true,
                            side: "自軍",
                            is: ["ユニット"],
                            count: 1,
                        }]
                },
                "「速攻」、または「高機動」１つ": {
                    title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                        const ge1 = {
                            title: ["AddText", {
                                    id: `179003_01A_O_WT001C_white_gain_1`,
                                    title: ["特殊型", ["速攻"]],
                                    description: "速攻"
                                }],
                            cardIds: []
                        };
                        const ge2 = {
                            title: ["AddText", {
                                    id: `179003_01A_O_WT001C_white_gain_2`,
                                    title: ["特殊型", ["高機動"]],
                                    description: "高機動"
                                }],
                            cardIds: []
                        };
                        return {
                            title: ["GlobalEffects", [ge1, ge2], [ge1]],
                            count: 1
                        };
                    }.toString()
                }
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: ["cutIn", [
                                    {
                                        title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                            const cardId = DefineFn.EffectFn.getCardID(effect);
                                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ユニット１枚", cardId);
                                            const selections = GameStateFn.getCardTipSelection(ctx, "「速攻」、または「高機動」１つ", cardId);
                                            pairs.forEach(pair => {
                                                selections.forEach(ge => {
                                                    ge.cardIds = [pair[0]];
                                                    ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, effect, [ge], pair, Options);
                                                });
                                            });
                                            return ctx;
                                        }.toString()
                                    }
                                ]]
                        }
                    ]
                }
            ]
        }
    ],
};
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
