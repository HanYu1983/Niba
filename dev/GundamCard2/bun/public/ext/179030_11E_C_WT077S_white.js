// 179030_11E_C_WT077S_white
// 少年が見据える先
// 展開　補強
// 『恒常』：このカードは、敵軍ユニットが３枚以上いる場合、合計国力ー２してプレイできる。
// （戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『恒常』：このカードは、敵軍ユニットが３枚以上いる場合、合計国力ー２してプレイできる。",
            title: ["自動型", "恒常"],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                const pairs = DefineFn.TipFn.getWant(GameStateFn.createTipByEntitySearch(ctx, effect, {
                    at: DefineFn.BaSyouKeywordFn.getBaAll(),
                    side: "敵軍",
                    is: ["ユニット"],
                    count: 3,
                }, { ges: Options.ges }));
                if (pairs.length >= 3) {
                    return [
                        {
                            title: ["合計国力_＋１してプレイできる", -2],
                            cardIds: [cardId]
                        },
                    ];
                }
                return [];
            }.toString()
        }
    ],
    commandText: {
        id: "",
        description: "（戦闘フェイズ）：自軍捨て山の上のカード１枚を、ロール状態で自軍Gにする。その後、カード２枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる。",
        title: ["使用型", ["戦闘フェイズ"]],
        conditions: {
            "自軍捨て山の上のカード１枚": {
                title: ["Entity", {
                        side: "自軍",
                        at: ["捨て山"],
                        count: 1,
                    }]
            },
            "この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる": {
                actions: [{ title: ["この記述の効果は、プレイヤー毎に１ターンに１回まで解決できる"] }]
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                            const cardId = DefineFn.EffectFn.getCardID(effect);
                            const cardController = GameStateFn.getItemController(ctx, cardId);
                            const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍捨て山の上のカード１枚", cardId);
                            for (const pair of pairs) {
                                ctx = GameStateFn.doItemSetRollStateBasic(ctx, true, pair[0], { ...Options });
                                ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(cardController, "Gゾーン"), pair, { ges: Options.ges });
                            }
                            ctx = GameStateFn.doPlayerDrawCard(ctx, effect, 2, cardController, Options);
                            return ctx;
                        }.toString()
                    }
                ]
            }
        ]
    },
};
