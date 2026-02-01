// 179030_11E_O_GN023N_green
// N
// CCA
// サイコミュテスト
// 破壊　装弾
// 『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。
// 『起動』：この記述の効果以外で、敵軍ユニットがダメージを受けた場合、戦闘エリアにいる敵軍ユニット１枚に１ダメージを与える。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。",
            title: ["自動型", "常駐"],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const situation = DefineFn.EffectFn.getSituation(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                if (situation && situation.title[0] == "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合") {
                    return [{ title: ["このカードを自軍Gとしてロールできる"], cardIds: [cardId] }];
                }
                return [];
            }.toString()
        },
        {
            id: "",
            description: "『起動』：この記述の効果以外で、敵軍ユニットがダメージを受けた場合、戦闘エリアにいる敵軍ユニット１枚に１ダメージを与える。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "配備エリア", { id: "", protoID: "179030_11E_O_GN023N_green" }, null],
                    addCards: [
                        ["敵軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }]],
                    ],
                    event: {
                        title: ["ユニットがダメージを受けた場合"],
                        cardIds: ["unit"],
                        effect: { id: "", reason: ["GameRule", null, {}], text: { id: "", title: [] } }
                    },
                    checkFn: function _(ctx, { DefineFn, GameStateFn }) {
                        if (GameStateFn.getItemState(ctx, "unit").damage != 1) {
                            throw new Error();
                        }
                    }
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const event = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                if (event.title[0] == "ユニットがダメージを受けた場合" &&
                    event.cardIds?.some(cardId => GameStateFn.getItemController(ctx, cardId) != cardController) &&
                    event.effect != null &&
                    event.effect.text.id != effect.text.id) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        conditions: {
                            "戦闘エリアにいる敵軍ユニット１枚": {
                                title: ["Entity", {
                                        at: ["戦闘エリア1", "戦闘エリア2"],
                                        side: "敵軍",
                                        is: ["ユニット"],
                                        count: 1
                                    }]
                            },
                        },
                        logicTreeAction: {
                            actions: [
                                {
                                    title: ["_１ダメージを与える", 1],
                                    vars: ["戦闘エリアにいる敵軍ユニット１枚"]
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                return ctx;
            }.toString(),
        }
    ],
};
