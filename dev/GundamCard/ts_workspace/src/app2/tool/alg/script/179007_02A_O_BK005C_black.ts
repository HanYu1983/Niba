import { getCustomFunctionString } from "../../../../tool/helper";
import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import {
  createRollCostRequire,
  RequireAnd,
  RequireTarget,
} from "../../tool/basic/blockPayload";
import { getCard } from "../../../../tool/table";
import { getCardTextMacro } from "./cardTextMacro";
import { DEFAULT_CARD_TEXT_SIYOU_KATA } from "../../tool/basic/basic";

// 179007_02A_O_BK005C_black
// C
// Z
// コロニーが落ちる日
// 破壊
// （帰還ステップ）〔黒３〕：自軍カード１枚を廃棄する。その場合、敵軍は、G以外の自分のカード１枚を選んで廃棄する。

let _idSeq = 0;
const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "コロニーが落ちる日",
  characteristic: "破壊".split("　"),
  category: "オペレーション",
  color: "黒",
  rollCost: [null, null, null, null, null],
  texts: [
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayOperation",
    }).cardText,
    getCardTextMacro({
      id: "PlayText",

      description:
        "（帰還ステップ）〔黒３〕：自軍カード１枚を廃棄する。その場合、敵軍は、G以外の自分のカード１枚を選んで廃棄する。",
      timing: ["帰還ステップ"],
      additionalRequire: [
        createRollCostRequire(3, "黒"),
        {
          id: "RequireAnd",
          and: [
            {
              id: "RequireTarget",
              targets: {
                自軍カード１枚: {
                  id: "カード",
                  value: [],
                  valueLengthInclude: [1],
                },
              },
              action: [
                {
                  id: "ActionSetTarget",
                  source: "自軍カード１枚",
                  target: "自軍カード１枚",
                },
              ],
            },
            {
              id: "RequireTarget",
              targets: {
                "敵軍は、G以外の自分のカード１枚": {
                  id: "カード",
                  value: [],
                  valueLengthInclude: [1],
                  responsePlayer: "敵軍",
                },
              },
              action: [
                {
                  id: "ActionSetTarget",
                  source: "敵軍は、G以外の自分のカード１枚",
                  target: "敵軍は、G以外の自分のカード１枚",
                },
              ],
            },
          ],
        },
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionDestroy",
                cards: { id: "カード", value: "自軍カード１枚" },
              },
              {
                id: "ActionDestroy",
                cards: {
                  id: "カード",
                  value: "敵軍は、G以外の自分のカード１枚",
                },
              },
            ],
          },
        ],
      },
    }).cardText,
  ],
};

module.exports = prototype;
