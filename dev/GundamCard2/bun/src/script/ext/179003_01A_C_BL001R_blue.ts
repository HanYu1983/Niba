// 179003_01A_C_BL001R_blue
// R
// GUNDAM
// ガンダリウム合金
// 再生
// （戦闘フェイズ）：自軍ユニット１枚の破壊を無効にする。
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { StrBaSyouPair, Tip } from "../../game/define/Tip";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";

export const prototype: CardPrototype = {
  commandText: {
    id: "",
    description: "（戦闘フェイズ）：自軍ユニット１枚の破壊を無効にする。",
    title: ["使用型", ["戦闘フェイズ"]],
    testEnvs: [
      {
        thisCard: ["自軍", "配備エリア", { id: "", protoID: "unit" }, { destroyReason: { id: "破壊する", playerID: "PlayerA" } }]
      }
    ],
    conditions: {
      "自軍ユニット１枚の破壊": {
        title: ["Entity", {
          atBa: true,
          side: "自軍",
          is: ["ユニット"],
          isDestroy: true,
          count: 1
        }]
      },
    },
    logicTreeActions: [
      {
        actions: [
          {
            title: ["cutIn", [
              {
                title: ["_ロールする", "破壊を無効"],
                vars: ["自軍ユニット１枚の破壊"]
              }
            ]]
          }
        ]
      }
    ],
  },
};