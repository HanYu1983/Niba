export const prototype = {
    texts: [
        {
            id: "",
            title: ["自動型", "起動"],
            description: "『起動』：このカードが場に出た場合、敵軍手札１枚を無作為に廃棄する。",
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const evt = DefineFn.EffectFn.getEvent(effect);
                if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
                }
                else {
                    return ctx;
                }
                const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                    conditions: {
                        "敵軍手札１枚": {
                            title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                const cardId = DefineFn.EffectFn.getCardID(effect);
                                const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
                                    side: "敵軍",
                                    at: ["手札"],
                                    count: 1,
                                }, { ges: Options.ges });
                                return tip;
                            }.toString()
                        },
                    },
                    logicTreeAction: {
                        actions: [
                            {
                                title: ["_ロールする", "廃棄"],
                                vars: ["敵軍手札１枚"]
                            }
                        ]
                    }
                });
                ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                return ctx;
            }.toString(),
        },
        {
            id: "",
            description: "『起動』：場、または手札から、敵軍ジャンクヤードにユニットが移動した場合、セットカードがセットされていない、G以外の敵軍カード１枚を破壊する。",
            title: ["自動型", "起動"],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                const opponentPlayerId = DefineFn.PlayerIDFn.getOpponent(cardController);
                const evt = DefineFn.EffectFn.getEvent(effect);
                if (evt.title[0] == "GameEventOnMove"
                    && (DefineFn.BaSyouKeywordFn.isBa(DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[1]))
                        || DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(evt.title[1]) == "手札")
                    && DefineFn.AbsoluteBaSyouFn.eq(evt.title[2], DefineFn.AbsoluteBaSyouFn.of(opponentPlayerId, "ジャンクヤード"))
                    && evt.cardIds?.some(itemId => GameStateFn.getItemRuntimeCategory(ctx, itemId) == "ユニット")) {
                }
                else {
                    return ctx;
                }
                const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                    conditions: {
                        "セットカードがセットされていない、G以外の敵軍カード": {
                            title: ["Entity", {
                                    atBa: true,
                                    side: "敵軍",
                                    is: DefineFn.CardCategoryFn.createRemaining(["グラフィック"]),
                                    hasSetCard: false,
                                    count: 1,
                                }]
                        }
                    },
                    logicTreeAction: {
                        actions: [
                            {
                                title: ["_ロールする", "破壞"],
                                vars: ["セットカードがセットされていない、G以外の敵軍カード"]
                            }
                        ]
                    }
                });
                ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                return ctx;
            }.toString()
        }
    ]
};
