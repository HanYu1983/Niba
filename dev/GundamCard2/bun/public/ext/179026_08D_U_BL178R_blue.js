// 179026_08D_U_BL178R_blue
// R
// GUNDAM
// ガンダム［†］
// ガンダム系　MS　WB隊　専用「アムロ・レイ」
// 戦闘配備　速攻　〔０〕：改装［ガンダム系］
// 『常駐』：このセットグループは、緑のロールコストを持つ、敵軍カードの効果の対象にならない。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『常駐』：このセットグループは、緑のロールコストを持つ、敵軍カードの効果の対象にならない。",
            title: ["自動型", "常駐"],
            testEnvs: [
                {
                    createCards: [
                        ["自軍", "戦闘エリア1", [["179026_08D_U_BL178R_blue", 1]]]
                    ]
                }
            ],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn, ToolFn }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                return [
                    {
                        title: ["このセットグループは、_緑のロールコストを持つ、敵軍カードの効果の対象にならない", ["緑"]],
                        cardIds: [cardId]
                    },
                ];
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
