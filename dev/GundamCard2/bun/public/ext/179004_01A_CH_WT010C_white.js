// 179004_01A_CH_WT010C_white
// ミゲル・アイマン
// 男性　子供　CO
// 速攻
// 『起動』：このセットグループのユニットは、戦闘ダメージを受けた場合、破壊される。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このセットグループのユニットは、戦闘ダメージを受けた場合、破壊される。",
            title: ["自動型", "起動"],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                const evt = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                if (evt.title[0] == "戦闘ダメージを受けた場合" && evt.cardIds?.includes(cardId)) {
                    ctx = GameStateFn.doItemSetDestroyBasic(ctx, { id: "破壊する", playerID: cardController }, cardId, Options);
                }
                return ctx;
            }.toString()
        }
    ],
};
