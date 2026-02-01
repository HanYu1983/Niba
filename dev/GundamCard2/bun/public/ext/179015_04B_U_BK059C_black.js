// 179015_04B_U_BK059C_black
// C
// Z
// ガンダムTR-1［ヘイズル2号機］
// ヘイズル系　MS　T3部隊
// 強襲　〔０〕：改装［ヘイズル系］
// 『起動』：このカードが場に出た場合、自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、自軍ハンガーに移す事ができる。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードが場に出た場合、自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、自軍ハンガーに移す事ができる。",
            title: ["自動型", "起動"],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const evt = DefineFn.EffectFn.getEvent(effect);
                if (evt.title[0] == "このカードが場に出た場合" && evt.cardIds?.includes(cardId)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        isOption: true,
                        conditions: {
                            "自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚": {
                                title: ["Entity", {
                                        see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 4],
                                        hasChar: ["ヘイズル系"],
                                        cardCategory: ["ユニット"],
                                        max: 1,
                                    }],
                            }
                        },
                        logicTreeAction: {
                            actions: [
                                {
                                    title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                                    vars: ["自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚"]
                                },
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                    return ctx;
                }
                return ctx;
            }.toString()
        },
    ],
};
