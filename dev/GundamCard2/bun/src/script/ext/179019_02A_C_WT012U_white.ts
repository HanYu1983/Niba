// 179019_02A_C_WT012U_white
// U
// W
// 移動弾薬庫
// 破壊
// （ダメージ判定ステップ）：敵軍部隊１つに、４貫通ダメージを与える。
// （注：貫通ダメージは、部隊への戦闘ダメージと同様に処理する）

import { CardPrototype } from "../../game/define/CardPrototype";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（ダメージ判定ステップ）：敵軍部隊１つに、４貫通ダメージを与える。",
    title: ["使用型", ["ダメージ判定ステップ"]],
    conditions: {
      "敵軍部隊１つ": {
        title: ["_敵軍部隊_１つ", "敵軍", 1]
      }
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["_１貫通ダメージを与える", 4],
            vars: ["敵軍部隊１つ"]
          }
        ]
      }
    ],
  },
};