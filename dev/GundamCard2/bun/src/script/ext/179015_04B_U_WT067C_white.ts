// 179015_04B_U_WT067C_white
// アストレイ ブルーフレーム セカンドG
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 速攻　〔０〕：改装［ブルーフレーム系］
// 〔２〕：クロスウェポン［アストレイ系］
// （クロスウェポンのルール＞（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）

import { CardColor, CardPrototype } from "../../game/define/CardPrototype";
import { Condition } from "../../game/define/CardText";

export const prototype: CardPrototype = {
  
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