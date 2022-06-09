import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro, VAR_PLAY_CARD } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { RequireTarget } from "../../tool/basic/blockPayload";
import { CardColor } from "../../tool/basic/basic";

// 179028_10D_C_BL070N_blue
// N
// OO
// 希望の光
// 強化　再生
// （常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、非交戦中の自軍ユニット１枚の破壊を無効にする。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "希望の光",
  characteristic: "強化　再生".split("　"),
  category: "コマンド",
  color: "青",
  rollCost: ["青", null],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（常時）：交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る。または、[非交戦中の自軍ユニット１枚の破壊を無効にする]。",
      timing: ["常時"],
      varCtxID: "varCtxID1",
      additionalRequire: [
        createRollCostRequire(1, "青"),
        {
          id: "RequireTarget",
          targets: {
            非交戦中の自軍ユニット１枚: {
              id: "カード",
              value: [],
              valueLengthInclude: [1],
            },
          },
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "變量x的是y軍",
                x: { id: "カード", value: "非交戦中の自軍ユニット１枚" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "非交戦中の自軍ユニット１枚" },
                y: ["ユニット"],
              }),
              {
                id: "ConditionNot",
                not: getConditionMacro({
                  id: "變量x的是交戰中",
                  x: { id: "カード", value: "非交戦中の自軍ユニット１枚" },
                }),
              },
              getConditionMacro({
                id: "變量字串x的第一個元素是破壞中",
                x: "非交戦中の自軍ユニット１枚",
              }),
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "非交戦中の自軍ユニット１枚",
              target: "非交戦中の自軍ユニット１枚",
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
                id: "ActionInvalidateDistroy",
                cards: { id: "カード", value: "非交戦中の自軍ユニット１枚" },
              },
            ],
          },
        ],
      },
    }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（常時）：[交戦中の自軍ユニット１枚は、ターン終了時まで＋３／＋３／＋３を得る]。または、非交戦中の自軍ユニット１枚の破壊を無効にする。",
      timing: ["常時"],
      additionalRequire: [createRollCostRequire(1, "青")],
    }),
  ],
};

module.exports = prototype;
