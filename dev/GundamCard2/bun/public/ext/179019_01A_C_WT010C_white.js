export const prototype = {
    commandText: {
        id: "",
        title: ["使用型", ["戦闘フェイズ"]],
        description: "（戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。",
        conditions: {
            "自軍ユニット１枚": {
                title: ["Entity", {
                        atBa: true,
                        side: "自軍",
                        is: ["ユニット"],
                        count: 1,
                    }]
            },
            "「速攻」または「高機動」": {
                title: function _(ctx, effect, { DefineFn, GameStateFn }) {
                    return {
                        title: ["StringOptions", ["速攻", "高機動"], ["速攻"]],
                        count: 1,
                    };
                }.toString()
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                            const cardId = DefineFn.EffectFn.getCardID(effect);
                            const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ユニット１枚", cardId);
                            const str2 = GameStateFn.getCardTipStrings(ctx, "「速攻」または「高機動」", cardId);
                            switch (str2[0]) {
                                case "速攻":
                                    for (const pair of pairs1) {
                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, effect, [{ title: ["AddText", { id: ToolFn.getUUID(), title: ["特殊型", ["速攻"]] }], cardIds: [pair[0]] }], pair, Options);
                                    }
                                    break;
                                case "高機動":
                                    for (const pair of pairs1) {
                                        ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, effect, [{ title: ["AddText", { id: ToolFn.getUUID(), title: ["特殊型", ["高機動"]] }], cardIds: [pair[0]] }], pair, Options);
                                    }
                                    break;
                            }
                            return ctx;
                        }.toString()
                    }
                ]
            }
        ],
    },
};
