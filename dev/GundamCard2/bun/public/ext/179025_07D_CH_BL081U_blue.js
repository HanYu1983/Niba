// 179025_07D_CH_BL081U_blue
// U
// ZZ
// ジュドー・アーシタ
// 男性　子供　NT　ガンダムチーム
// <〔Ｒ〕：共有［ΖΖ系］>
// <（戦闘フェイズ）〔２〕：このカードがGである場合、｢特徴：ΖΖ系｣を持つ自軍ユニット３枚をロール状態で自軍Gにする。その場合、このカードと、本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚を抜き出し、１つのセットグループとして、自軍配備エリアにリロール状態で出す>
export const prototype = {
    __ignoreAutoTexts: true,
    texts: [
        {
            id: "",
            description: "<〔Ｒ〕：共有［ΖΖ系］>",
            title: ["特殊型", ["共有", "ΖΖ系"]],
            conditions: {
                "Ｒ": {
                    actions: [
                        {
                            title: ["_ロールする", "ロール"]
                        }
                    ]
                }
            },
            protectLevel: 2,
        },
        {
            id: "",
            description: " <（戦闘フェイズ）〔２〕：このカードがGである場合、｢特徴：ΖΖ系｣を持つ自軍ユニット３枚をロール状態で自軍Gにする。その場合、このカードと、本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚を抜き出し、１つのセットグループとして、自軍配備エリアにリロール状態で出す>",
            title: ["使用型", ["戦闘フェイズ"]],
            protectLevel: 2,
            testEnvs: [
                {
                    createCards: [
                        ["自軍", "Gゾーン", [["179025_07D_CH_BL081U_blue", 1], ["unit", 2]]],
                        ["自軍", "戦闘エリア2", [["179029_05C_U_BL104C_blue", 3]]]
                    ]
                }
            ],
            conditions: {
                ...createRollCostRequire(2, null),
                "このカードがGである場合": {
                    actions: [
                        {
                            title: ["Entity", {
                                    isThisCard: true,
                                    at: ["Gゾーン"],
                                    count: 1
                                }]
                        }
                    ]
                },
                "｢特徴：ΖΖ系｣を持つ自軍ユニット３枚": {
                    title: ["Entity", {
                            atBa: true,
                            hasChar: ["ΖΖ系"],
                            side: "自軍",
                            is: ["ユニット"],
                            count: 3
                        }]
                },
            },
            logicTreeActions: [
                {
                    actions: [
                        {
                            title: ["cutIn", [
                                    {
                                        title: ["_ロールする", "ロール"],
                                        vars: ["｢特徴：ΖΖ系｣を持つ自軍ユニット３枚"],
                                        isSkipTargetMissingError: true,
                                    },
                                    {
                                        title: ["_の_ハンガーに移す", "自軍", "Gゾーン"],
                                        vars: ["｢特徴：ΖΖ系｣を持つ自軍ユニット３枚"]
                                    },
                                    {
                                        title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                            const newE = DefineFn.EffectFn.fromEffectBasic(effect, {
                                                conditions: {
                                                    "本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚": {
                                                        title: ["Entity", {
                                                                at: ["Gゾーン"],
                                                                hasOriginChar: ["ΖΖ系"],
                                                                side: "自軍",
                                                                cardCategory: ["ユニット"],
                                                                count: 1
                                                            }]
                                                    }
                                                },
                                                logicTreeAction: {
                                                    actions: [
                                                        {
                                                            title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                                                const cardId = DefineFn.EffectFn.getCardID(effect);
                                                                const cardController = GameStateFn.getItemController(ctx, cardId);
                                                                const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "本来の記述に「特徴：ΖΖ系」を持つ自軍G１枚", cardId);
                                                                const pair = pairs[0];
                                                                if (pair == null) {
                                                                    throw new Error();
                                                                }
                                                                ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), pair, Options);
                                                                ctx = GameStateFn.doItemMove(ctx, effect, DefineFn.AbsoluteBaSyouFn.of(cardController, "配備エリア"), GameStateFn.createStrBaSyouPair(ctx, cardId), Options);
                                                                ctx = GameStateFn.doItemSetRollStateBasic(ctx, false, pair[0], { ...Options });
                                                                ctx = GameStateFn.doItemSetRollStateBasic(ctx, false, cardId, { ...Options });
                                                                ctx = GameStateFn.setSetGroupParent(ctx, pair[0], cardId);
                                                                return ctx;
                                                            }.toString()
                                                        }
                                                    ]
                                                }
                                            });
                                            ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE, { isSkipLimitCheck: true, isAssertConditionPass: true });
                                            return ctx;
                                        }.toString(),
                                    }
                                ]]
                        }
                    ]
                }
            ]
        }
    ],
};
function createRollCostRequire(costNum, color) {
    let ret = {};
    for (let i = 0; i < costNum; ++i) {
        const key = `${i}[${color}]`;
        ret = {
            ...ret,
            [key]: {
                title: ["RollColor", color],
                actions: [
                    {
                        title: ["_ロールする", "ロール"],
                        vars: [key]
                    }
                ]
            }
        };
    }
    return ret;
}
