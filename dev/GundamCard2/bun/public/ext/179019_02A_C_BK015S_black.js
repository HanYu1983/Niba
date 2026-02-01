export const prototype = {
    texts: [
        {
            id: "",
            description: "『恒常』：このカードのプレイは、３以下の合計国力を持つ敵軍コマンドの効果では無効にならない。",
            title: ["自動型", "恒常"],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                return [{ title: ["3以下の合計国力を持つ敵軍コマンドの効果では無効にならない"], cardIds: [cardId] }];
            }.toString()
        }
    ],
    commandText: {
        id: "",
        description: "（自軍戦闘フェイズ）：G以外の、セットカードがセットされていない敵軍カード１枚を破壊する。",
        title: ["使用型", ["自軍", "戦闘フェイズ"]],
        conditions: {
            "G以外の、セットカードがセットされていない敵軍カード１枚": {
                title: ["Entity", {
                        atBa: true,
                        is: ["ACE", "オペレーション", "オペレーション(ユニット)", "キャラクター", "コマンド", "ユニット"],
                        hasSetCard: false,
                        side: "敵軍",
                        count: 1
                    }]
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: ["_ロールする", "破壞"],
                        vars: ["G以外の、セットカードがセットされていない敵軍カード１枚"]
                    }
                ]
            }
        ]
    },
};
