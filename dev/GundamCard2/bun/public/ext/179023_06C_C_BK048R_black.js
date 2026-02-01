// 179023_06C_C_BK048R_black
// 妄執の鈴音
// 破壊
// （戦闘フェイズ）：戦闘エリアにいる、セットカードがセットされている敵軍ユニット１枚を破壊する。
export const prototype = {
    commandText: {
        id: "",
        description: "（戦闘フェイズ）：戦闘エリアにいる、セットカードがセットされている敵軍ユニット１枚を破壊する。",
        title: ["使用型", ["戦闘フェイズ"]],
        conditions: {
            "戦闘エリアにいる、セットカードがセットされている敵軍ユニット１枚": {
                title: ["Entity", {
                        at: ["戦闘エリア1", "戦闘エリア2"],
                        hasSetCard: true,
                        side: "敵軍",
                        is: ["ユニット"],
                        count: 1,
                    }]
            }
        },
        logicTreeActions: [
            {
                actions: [
                    {
                        title: ["_ロールする", "破壞"],
                        vars: ["戦闘エリアにいる、セットカードがセットされている敵軍ユニット１枚"]
                    }
                ]
            }
        ]
    },
};
