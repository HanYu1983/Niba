// 179024_B2B_C_BK054C_black
// ロング・ブレードライフル
// 移動　補強
// （戦闘フェイズ）：破壊されているカード１枚を廃棄する。その場合、カード２枚を引く。
import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";

export const prototype: CardPrototype = {
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

function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): { [key: string]: Condition } {
  let ret: { [key: string]: Condition } = {}
  for (let i = 0; i < costNum; ++i) {
      const key = `${i}[${color}]`
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
  return ret
}