// 179020_05C_CH_BL057U_blue
// U
// ΖΖ
// ルー・ルカ
// 女性　子供　NT　ガンダムチーム
// クイック
// 『恒常』：このカードは、戦闘エリアにいる自軍ユニットにもセットできる。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『恒常』：このカードは、戦闘エリアにいる自軍ユニットにもセットできる。",
            title: ["自動型", "恒常"],
            testEnvs: [
                {
                    phase: ["配備フェイズ", "フリータイミング"],
                    createCards: [
                        ["自軍", "手札", [["179020_05C_CH_BL057U_blue", 1]]],
                        ["自軍", "戦闘エリア1", [["unit", 1]]],
                        ["自軍", "Gゾーン", [["179020_05C_CH_BL057U_blue", 3]]]
                    ]
                },
            ],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                return [{ title: ["このカードは、戦闘エリアにいる自軍ユニットにもセットできる"], cardIds: [cardId] }];
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
