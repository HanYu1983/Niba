export const prototype = {
    texts: [
        {
            id: "",
            title: ["自動型", "恒常"],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                const cardIds = GameStateFn.getItemIds(ctx);
                const units = cardIds;
                return [
                    {
                        title: ["AddText", {
                                id: ToolFn.getUUID("testBPBonus"),
                                title: ["TextBattleBonus", [3, 3, 3]],
                            }],
                        cardIds: units
                    }
                ];
            }.toString()
        },
    ],
};
