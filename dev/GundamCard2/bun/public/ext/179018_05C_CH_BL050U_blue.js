// 179018_05C_CH_BL050U_blue
// U
// ZZ
// エル・ビアンノ
// 女性　子供　ガンダムチーム
// クイック
// 『起動』：このカードが防御ステップ中に場に出た場合、「特徴：ガンダムチーム」を持つ自軍カードのセットグループ１つのユニットを、ユニットのいる戦闘エリアの任意の順番に、リロール状態で移す。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『起動』：このカードが防御ステップ中に場に出た場合、「特徴：ガンダムチーム」を持つ自軍カードのセットグループ１つのユニットを、ユニットのいる戦闘エリアの任意の順番に、リロール状態で移す。",
            title: ["自動型", "起動"],
            testEnvs: [
                {
                    thisCard: ["自軍", "配備エリア", { id: "", protoID: "179018_05C_CH_BL050U_blue" }, null],
                    eventTitle: ["このカードが場に出た場合"],
                    phase: ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
                    addCards: [
                        ["自軍", "戦闘エリア2", [{ id: "charHasGTeam", protoID: "179018_05C_CH_BL050U_blue" }]],
                        ["自軍", "戦闘エリア1", [{ id: "unit", protoID: "unit" }]]
                    ],
                    setGroupParent: { "charHasGTeam": "unit" }
                },
            ],
            onEvent: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                const event = DefineFn.EffectFn.getEvent(effect);
                const cardId = DefineFn.EffectFn.getCardID(effect);
                if (event.title[0] == "このカードが場に出た場合"
                    && event.cardIds?.includes(cardId)
                    && GameStateFn.getPhase(ctx)[1] == "防御ステップ") {
                    const newE = GameStateFn.createPlayTextEffectFromEffect(ctx, effect, {
                        conditions: {
                            "「特徴：ガンダムチーム」を持つ自軍カードのセットグループ１つのユニット": {
                                title: ["Entity", {
                                        atBa: true,
                                        isSetGroupHasChar: ["ガンダムチーム"],
                                        side: "自軍",
                                        is: ["ユニット"],
                                        count: 1
                                    }]
                            },
                            // TODO:
                            "ユニットのいる戦闘エリアの任意の順番": {
                                title: ["Entity", {
                                        isBattle: true,
                                        isSetGroupRoot: true,
                                        count: 1
                                    }]
                            },
                            "ユニットのいる戦闘エリアの任意の順番2": {
                                title: ["_交戦中の_敵軍部隊_１つ", null, "自軍", 1],
                            }
                        },
                        logicTreeAction: {
                            logicTree: {
                                type: "And",
                                children: [
                                    {
                                        type: "Leaf",
                                        value: "「特徴：ガンダムチーム」を持つ自軍カードのセットグループ１つのユニット"
                                    },
                                    {
                                        type: "Or",
                                        children: [
                                            {
                                                type: "Leaf",
                                                value: "ユニットのいる戦闘エリアの任意の順番"
                                            },
                                            {
                                                type: "Leaf",
                                                value: "ユニットのいる戦闘エリアの任意の順番2"
                                            }
                                        ]
                                    }
                                ]
                            },
                            actions: [
                                {
                                    title: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                                        const cardId = DefineFn.EffectFn.getCardID(effect);
                                        const pairs1 = GameStateFn.getCardTipStrBaSyouPairs(ctx, "「特徴：ガンダムチーム」を持つ自軍カードのセットグループ１つのユニット", cardId);
                                        const isInsert = GameStateFn.getItemState(ctx, cardId).tips["ユニットのいる戦闘エリアの任意の順番"];
                                        const isAppend = GameStateFn.getItemState(ctx, cardId).tips["ユニットのいる戦闘エリアの任意の順番2"];
                                        if (isInsert) {
                                            const inserts = DefineFn.TipFn.getSelection(isInsert);
                                            const insertToCardId = inserts[0][0];
                                            const to = GameStateFn.getItemBaSyou(ctx, insertToCardId);
                                            const idx = GameStateFn.getItemIdsByBasyou(ctx, to).indexOf(insertToCardId);
                                            if (idx == -1) {
                                                throw new Error();
                                            }
                                            for (const pair of pairs1) {
                                                ctx = GameStateFn.doItemMove(ctx, effect, to, pair, { ...Options, insertId: idx });
                                            }
                                        }
                                        else if (isAppend) {
                                            const basyous = DefineFn.TipFn.getSelection(isAppend);
                                            const to = basyous[0];
                                            for (const pair of pairs1) {
                                                ctx = GameStateFn.doItemMove(ctx, effect, to, pair, Options);
                                            }
                                        }
                                        else {
                                            throw new Error();
                                        }
                                        return ctx;
                                    }.toString()
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
