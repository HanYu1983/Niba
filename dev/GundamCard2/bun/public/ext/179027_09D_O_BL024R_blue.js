// 179027_09D_O_BL024R_blue
// R
// Z
// 刻を超えて
// 展開
// 『起動』：このカードがプレイされて、キャラがセットされていないユニットにセットされた場合、自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚を、そのユニットにセットできる。その後、自軍本国をシャッフルする。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードがプレイされて、キャラがセットされていないユニットにセットされた場合、自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚を、そのユニットにセットできる。その後、自軍本国をシャッフルする。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "配備エリア", { id: "char", protoID: "179027_09D_O_BL024R_blue" }, null],
                    addCards: [
                        ["自軍", "配備エリア", [{ id: "unit", protoID: "unit" }]],
                    ],
                    createCards: [
                        ["自軍", "本国", [["charBlue", 2]]],
                    ],
                    setGroupParent: { "char": "unit" },
                    eventTitle: ["このカードがプレイされて、キャラがセットされていないユニットにセットされた場合"],
                    checkFn(ctx, { DefineFn, GameStateFn }) {
                        if (GameStateFn.getSetGroup(ctx, "unit").length != 3) {
                            throw new Error();
                        }
                    },
                }
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn }) {
                const event = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                if (event.title[0] == "このカードがプレイされて、キャラがセットされていないユニットにセットされた場合" && event.cardIds?.includes(cardId)) {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        isOption: true,
                        conditions: {
                            "自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚": {
                                title: ["Entity", {
                                        see: [DefineFn.RelatedBaSyouFn.of("自軍", "本国"), 1, 50],
                                        is: ["キャラクター"],
                                        hasGSignColor: ["青"],
                                        max: 1
                                    }]
                            }
                        },
                        logicTreeAction: {
                            actions: [
                                {
                                    title: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn, Options }) {
                                        const cardId = DefineFn.EffectFn.getCardID(effect);
                                        const cardController = GameStateFn.getItemController(ctx, cardId);
                                        const targetUnitId = GameStateFn.getSetGroupRoot(ctx, cardId);
                                        if (targetUnitId == cardId) {
                                            throw new Error("targetUnitId == cardId");
                                        }
                                        const pairs = GameStateFn.getCardTipStrBaSyouPairs(ctx, "自軍本国のカードを全て見て、その中にある、青のGサインを持つキャラ１枚", DefineFn.EffectFn.getCardID(effect));
                                        if (pairs.length == 0) {
                                            throw new Error("pairs.length == 0");
                                        }
                                        const [charId, charBasyou] = pairs[0];
                                        ctx = GameStateFn.doItemMoveBasic(ctx, GameStateFn.getItemBaSyou(ctx, targetUnitId), [charId, charBasyou], Options);
                                        const isRoll = GameStateFn.getCard(ctx, targetUnitId).isRoll || false;
                                        ctx = GameStateFn.mapCard(ctx, charId, is => ({ ...is, isRoll: isRoll }));
                                        ctx = GameStateFn.setSetGroupParent(ctx, targetUnitId, charId);
                                        ctx = GameStateFn.shuffleItems(ctx, DefineFn.AbsoluteBaSyouFn.of(cardController, "本国"));
                                        return ctx;
                                    }.toString()
                                }
                            ]
                        }
                    });
                    ctx = GameStateFn.addImmediateEffectIfCanPayCost(ctx, newE);
                }
                return ctx;
            }.toString()
        }
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
