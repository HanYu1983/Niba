export const prototype = {
    commandText: {
        id: "",
        description: "（戦闘フェイズ）：自軍カード１枚を破壊する。その場合、カード２枚を引く。",
        title: ["使用型", ["戦闘フェイズ"]],
        conditions: {
            "自軍カード１枚": {
                title: ["Entity", {
                        side: "自軍",
                        atBa: true,
                        count: 1,
                    }],
                actions: [
                    {
                        title: ["_ロールする", "破壞"],
                        vars: ["自軍カード１枚"]
                    }
                ]
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: ["カード_１枚を引く", 2]
                    }
                ]
            }
        ]
    }
};
