// 179029_B3C_C_BK071N_black
// 脱出機構
// 補強
// （戦闘フェイズ）：自軍カード１枚を破壊する。その場合、カード２枚を引く。
import { CardPrototype } from "../../game/define/CardPrototype";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（戦闘フェイズ）：自軍カード１枚を破壊する。その場合、カード２枚を引く。",
    title: ["使用型", ["戦闘フェイズ"]],
    conditions: {
      "自軍カード１枚": {
        title: ["Entity", {
          side: "自軍",
          at: ["戦闘エリア1", "戦闘エリア2", "配備エリア"],
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
