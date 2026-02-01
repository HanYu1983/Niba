export const prototype = {
    commandText: {
        id: "",
        description: "（戦闘フェイズ）：自軍ユニット１～２枚は、ターン終了時まで「高機動」、＋３／＋３／＋３を得る。",
        title: ["使用型", ["戦闘フェイズ"]],
        conditions: {
            "自軍ユニット１～２枚": {
                title: ["Entity", {
                        at: ["戦闘エリア1", "戦闘エリア2", "配備エリア"],
                        side: "自軍",
                        is: ["ユニット"],
                        min: 1,
                        max: 2
                    }]
            },
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                            const cardId = DefineFn.EffectFn.getCardID(effect);
                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍ユニット１～２枚", cardId);
                            for (const pair of pairs) {
                                ctx = GameStateFn.doItemSetGlobalEffectsUntilEndOfTurn(ctx, effect, [
                                    { title: ["AddText", { id: ToolFn.getUUID(), title: ["特殊型", ["高機動"]] }], cardIds: [pair[0]] },
                                    { title: ["＋x／＋x／＋xを得る", [3, 3, 3]], cardIds: [pair[0]] }
                                ], pair, Options);
                            }
                            return ctx;
                        }.toString()
                    },
                ]
            }
        ],
    },
};
