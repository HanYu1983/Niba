// 179901_CG_U_GN003P_green
// P
// GUNDAM
// ゲルググ
// ゲルググ系　MS
// 〔１〕ゲイン
import type { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { CardText, Condition } from "../../game/define/CardText";

export const prototype: CardPrototype = {};

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