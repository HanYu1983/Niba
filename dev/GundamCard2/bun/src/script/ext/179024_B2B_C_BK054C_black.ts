// 179024_B2B_C_BK054C_black
// ロング・ブレードライフル
// 移動　補強
// （戦闘フェイズ）：破壊されているカード１枚を廃棄する。その場合、カード２枚を引く。

import { title } from "process";
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { createRollCostRequire } from "../../game/define/CardText";
import { RelatedBaSyou, RelatedBaSyouFn } from "../../game/define/BaSyou";

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
        // TODO, 順便將破壞效果從堆疊移除
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
