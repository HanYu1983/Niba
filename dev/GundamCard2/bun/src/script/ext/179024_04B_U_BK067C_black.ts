// 179024_04B_U_BK067C_black
// ジム・クゥエル［ヘイズル予備機］
// ヘイズル系　MS　T3部隊
// 強襲　〔０〕：改装［ヘイズル系］
// （敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。

import { title } from "process";
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { createRollCostRequire } from "../../game/define/CardText";
import { RelatedBaSyou, RelatedBaSyouFn } from "../../game/define/BaSyou";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "（敵軍帰還ステップ）〔黒１〕：「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主の手札に移す。",
      title: ["使用型", ["敵軍", "帰還ステップ"]],
      conditions: {
        ...createRollCostRequire(1, "黒"),
        "「特徴：T3部隊」を持つ自軍ユニット１枚": {
          title: ["Entity", {
            hasChar: ["T3部隊"],
            side: "自軍",
            is: ["ユニット"],
            count: 1
          }]
        }
      },
      logicTreeActions: [
        {
          actions: [
            {
              title: ["Action", { move: RelatedBaSyouFn.of("持ち主", "手札") }],
              vars: ["「特徴：T3部隊」を持つ自軍ユニット１枚"]
            }
          ]
        }
      ]
    },
  ],
};
