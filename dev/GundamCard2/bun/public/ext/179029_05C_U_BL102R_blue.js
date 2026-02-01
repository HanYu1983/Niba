// 179029_05C_U_BL102R_blue
// R
// ZZ
// ΖΖガンダム（ハイ・メガ・キャノン）
// ΖΖ系　MS　ガンダムチーム　専用｢ジュドー・アーシタ｣
// 強襲　〔１〕：ゲイン　〔１〕：範囲兵器（３）　〔０〕：改装［ΖΖ系］
// 『起動』：このカードが、自軍効果で戦闘エリアに移動した場合、自軍G１枚を廃棄できる。その場合、 X以下の防御力を持つ敵軍ユニット１枚を破壊する。Xの値は、本来の記述に「特徴：ガンダムチーム」を持つ自軍Gの枚数と同じとする。（注：場以外の場所から戦闘エリアに出た場合も起動する）
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードが、自軍効果で戦闘エリアに移動した場合、自軍G１枚を廃棄できる。その場合、 X以下の防御力を持つ敵軍ユニット１枚を破壊する。Xの値は、本来の記述に「特徴：ガンダムチーム」を持つ自軍Gの枚数と同じとする。（注：場以外の場所から戦闘エリアに出た場合も起動する）",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "戦闘エリア2", { id: "thisCard", protoID: "179029_05C_U_BL102R_blue" }, null],
                    event: {
                        title: [
                            "GameEventOnMove",
                            { id: "AbsoluteBaSyou", value: ["自軍", "Gゾーン"] },
                            { id: "AbsoluteBaSyou", value: ["自軍", "戦闘エリア2"] }
                        ],
                        cardIds: ["thisCard"],
                        effect: {
                            id: "",
                            reason: ["PlayText", "PlayerA", "", ""],
                            text: {
                                id: "",
                                title: ["自動型", "起動"],
                            }
                        }
                    },
                    addCards: [
                        ["自軍", "Gゾーン", [{ id: "unit", protoID: "unit" }]],
                        ["敵軍", "戦闘エリア1", [{ id: "unit2", protoID: "unit" }]]
                    ],
                    createCards: [
                        ["自軍", "Gゾーン", [["179029_05C_U_BL102R_blue", 1]]]
                    ],
                    checkFn: function _(ctx, { GameStateFn }) {
                        if (GameStateFn.getItemState(ctx, "unit2").destroyReason == null) {
                            throw new Error();
                        }
                        if (GameStateFn.getItemBaSyou(ctx, "unit").value[1] != "ジャンクヤード") {
                            throw new Error();
                        }
                    }
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const cardController = GameStateFn.getItemController(ctx, cardId);
                const event = DefineFn.EffectFn.getEvent(effect);
                if (event.title[0] == "GameEventOnMove"
                    && (event.title[1].value[1] != "戦闘エリア1" && event.title[1].value[1] != "戦闘エリア2")
                    && (event.title[2].value[1] == "戦闘エリア1" || event.title[2].value[1] == "戦闘エリア2")
                    && event.cardIds?.includes(cardId)
                    && event.effect && event.effect.reason[0] != "GameRule" && DefineFn.EffectFn.getPlayerID(event.effect) == cardController) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        isOption: true,
                        conditions: {
                            "自軍G１枚": {
                                title: ["Entity", {
                                        at: ["Gゾーン"],
                                        side: "自軍",
                                        count: 1
                                    }],
                                actions: [
                                    {
                                        title: ["_ロールする", "廃棄"],
                                        vars: ["自軍G１枚"]
                                    }
                                ]
                            },
                            "X以下の防御力を持つ敵軍ユニット１枚": {
                                title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                    // Xの値は、本来の記述に「特徴：ガンダムチーム」を持つ自軍Gの枚数と同じとする
                                    const cardId = DefineFn.EffectFn.getCardID(effect);
                                    const cardController = GameStateFn.getItemController(ctx, cardId);
                                    const x = GameStateFn.getPlayerGIds(ctx, cardController)
                                        .filter(id => GameStateFn.getItemCharacteristic(ctx, id).indexOf("ガンダムチーム") != -1).length;
                                    return GameStateFn.createTipByEntitySearch(ctx, effect, {
                                        compareBattlePoint: ["防御力", "<=", x],
                                        atBa: true,
                                        side: "敵軍",
                                        is: ["ユニット"],
                                        count: 1
                                    }, Options);
                                }.toString()
                            }
                        },
                        logicTreeAction: {
                            actions: [
                                {
                                    title: ["_ロールする", "破壞"],
                                    vars: ["X以下の防御力を持つ敵軍ユニット１枚"]
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                return ctx;
            }.toString(),
        },
    ]
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
