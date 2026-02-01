// 179025_07D_CH_BL079C_blue
// C
// GUNDAM
// ハヤト・コバヤシ
// 男性　子供　WB隊
// 『常駐』：このセットグループのユニットは、ロール状態でも防御に出撃できる。
export const prototype = {
    texts: [
        {
            id: "",
            description: "『常駐』：このセットグループのユニットは、ロール状態でも防御に出撃できる。",
            title: ["自動型", "常駐"],
            onSituation: function _(ctx, effect, { DefineFn, GameStateFn, Options }) {
                const cardId = DefineFn.EffectFn.getCardID(effect);
                const situation = DefineFn.EffectFn.getSituation(effect);
                if (situation != null) {
                    return [];
                }
                return [{ title: ["このセットグループのユニットは、ロール状態でも防御に出撃できる",], cardIds: [cardId] }];
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
