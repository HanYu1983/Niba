// 179015_04B_O_BK010C_black
// C
// Z
// テスト小隊
// 移動
// （常時）〔R〕：配備エリアにいる、「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主のハンガーに移す。

import { CardPrototype } from "../../game/define/CardPrototype";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（常時）〔R〕：配備エリアにいる、「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主のハンガーに移す。",
      title: ["使用型", ["常時"]],
      conditions: {
        "〔R〕": {
          actions: [
            {
              title: ["_ロールする", "ロール"],
            }
          ]
        },
        "配備エリアにいる、「特徴：T3部隊」を持つ自軍ユニット１枚": {
          title: ["_配備エリアにいる、「特徴：_T3部隊」を持つ_自軍_ユニット_１枚", "配備エリア", "T3部隊", "自軍", "ユニット", 1]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["cutIn", [
                {
                  title: ["_の_ハンガーに移す", "自軍", "ハンガー"],
                  vars: ["配備エリアにいる、「特徴：T3部隊」を持つ自軍ユニット１枚"]
                }
              ]]
            }
          ]
        }
      ]
    },
  ],
};
