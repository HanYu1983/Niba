export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードが攻撃に出撃した場合、自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、このカードの部隊の任意の順番にリロール状態で出す事ができる。",
            title: ["自動型", "起動"],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const evt = DefineFn.EffectFn.getEvent(effect);
                if (evt.title[0] == "このカードが攻撃に出撃した場合" && evt.cardIds?.includes(cardId)) {
                }
                else {
                    return ctx;
                }
                const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                    isOption: true,
                    conditions: {
                        "自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚": {
                            title: ["Entity", {
                                    see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 3],
                                    hasChar: ["ヘイズル系"],
                                    cardCategory: ["ユニット"],
                                    count: 1
                                }],
                        },
                        "このカードの部隊の任意の順番": {
                            title: ["Entity", {
                                    hasSelfCardId: true,
                                    isSetGroupRoot: true,
                                    max: 1
                                }]
                        }
                    },
                    logicTreeAction: {
                        actions: [
                            {
                                title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                    const cardId = DefineFn.EffectFn.getCardID(effect);
                                    const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国の上のカード１～３枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚", cardId);
                                    const pairs2 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "このカードの部隊の任意の順番", cardId);
                                    const cardBasyou = GameStateFn.getItemBaSyou(ctx, cardId);
                                    //const battleGroup = GameStateFn.getBattleGroup(ctx, cardBasyou)
                                    // 沒有選擇就是最後面
                                    const insertId = pairs2.length == 0 ?
                                        undefined :
                                        pairs2.map(p => p[0]).indexOf(pairs1[0][0]);
                                    for (const pair of pairs1) {
                                        ctx = GameStateFn.doItemMove(ctx, effect, cardBasyou, pair, { insertId: insertId, ges: Options.ges });
                                    }
                                    return ctx;
                                }.toString()
                            }
                        ]
                    }
                });
                ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                return ctx;
            }.toString(),
        }
    ]
};
