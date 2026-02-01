export const prototype = {
    commandText: {
        id: "",
        description: "（戦闘フェイズ）：破壊されているカード１枚を廃棄する。その場合、カード２枚を引く。",
        title: ["使用型", ["戦闘フェイズ"]],
        conditions: {
            "破壊されているカード１枚": {
                title: ["Entity", {
                        isDestroy: true,
                        count: 1,
                    }],
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: ["_ロールする", "廃棄"]
                    },
                    {
                        title: ["カード_１枚を引く", 2],
                    }
                ]
            }
        ]
    },
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
