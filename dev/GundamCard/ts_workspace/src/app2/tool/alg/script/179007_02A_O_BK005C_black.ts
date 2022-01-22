import { getCustomFunctionString } from "../../../../tool/helper";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createPlayCardText } from "./createPlayCardText";

// 179007_02A_O_BK005C_black
// C
// Z
// コロニーが落ちる日
// 破壊
// （帰還ステップ）〔黒３〕：自軍カード１枚を廃棄する。その場合、敵軍は、G以外の自分のカード１枚を選んで廃棄する。

let _idSeq = 0
const prototype: CardPrototype = {
  title: "コロニーが落ちる日",
  characteristic: "破壊".split("　"),
  category: "オペレーション",
  color: "黒",
  rollCost: [null, null, null, null, null],
  texts: [
    {
      id: "使用型",
      timing: ["常時"],
      description: "（帰還ステップ）〔黒３〕：自軍カード１枚を廃棄する。その場合、敵軍は、G以外の自分のカード１枚を選んで廃棄する。",
      block: {
        contextID: `179007_02A_O_BK005C_black_${_idSeq++}`,
        require: {
          id: "RequireAnd",
          and: [
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
                      valueLengthInclude: [1]
                    }
                  },
                  action: [{ id: "ActionSetTarget", source: "自軍カード１枚", target: "自軍カード１枚" }]
                },
                {
                  id: "RequireTarget",
                  targets: {
                    "敵軍は、G以外の自分のカード１枚": {
                      id: "カード",
                      value: [],
                      valueLengthInclude: [1],
                      responsePlayer: { id: "プレーヤー", value: { path: [{ id: "敵軍" }] } }
                    }
                  },
                  action: [{ id: "ActionSetTarget", source: "敵軍は、G以外の自分のカード１枚", target: "敵軍は、G以外の自分のカード１枚" }]
                }
              ]
            }
          ]
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddBlock",
                type: "堆疊",
                block: {
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        { id: "ActionDestroy", cards: { id: "カード", value: "自軍カード１枚" } },
                        { id: "ActionDestroy", cards: { id: "カード", value: "敵軍は、G以外の自分のカード１枚" } }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ],
};

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
