
// 179028_10D_C_BL070N_blue
// N
// OO
// 希望の光
// 強化　再生

import { CardPrototype } from "../../game/define/CardPrototype";

// （常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。
export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      title: ["使用型", ["常時"]],
      description: "（常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。",
      conditions: {
        "交戦中の自軍ユニット１枚は": {
          title: ["Entity", { isBattle: true, side: "自軍", runtimeItemCategory: "ユニット", count: 1 }]
        },
        "非交戦中の自軍ユニット１枚の破壊": {
          title: ["Entity", { isBattle: false, side: "自軍", runtimeItemCategory: "ユニット", count: 1, isDestroy: true }]
        }
      },
      logicTreeActions: [
        {
          logicTree: {
            type: "Leaf",
            value: "交戦中の自軍ユニット１枚は"
          },
          actions: [
            {
              title: ["cutIn", [{
                title: ["ターン終了時まで「速攻」を得る。", [{ title: ["＋x／＋x／＋xを得る", [3, 3, 3]], cardIds: [] }]],
                vars: ["交戦中の自軍ユニット１枚は"]
              }]]
            }
          ]
        },
        {
          logicTree: {
            type: "Leaf",
            value: "非交戦中の自軍ユニット１枚"
          },
          actions: []
        }
      ]
    }
  ]
};
