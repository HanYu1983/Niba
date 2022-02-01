import { getCustomFunctionString } from "../../../../tool/helper";
import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { getCardTextMacro, getConditionMacro } from "./cardTextMacro";
import {
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  Phase,
  TIMING_CHART,
} from "../../tool/basic/basic";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

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
                id: "ConditionCompareBoolean",
                value: [
                  {
                    id: "布林",
                    value: {
                      path: [
                        { id: "カード", value: "非交戦中の自軍ユニット１枚" },
                        "在「交戦中」？",
                      ],
                    },
                  },
                  "==",
                  {
                    id: "布林",
                    value: [false],
                  },
                ],
              },
              {
                id: "ConditionJsonfp",
                program: {
                  $cardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "cardID" },
                      { log: "cardID" },
                    ],
                  },
                  pass1: {
                    if: [
                      {
                        "->": [
                          "$in.ctx",
                          { getDestroyReason: "$cardID" },
                          { stringify: null },
                          { log: "stringify" },
                          { "==": "{}" },
                        ],
                      },
                      {},
                      { error: "必須被破壞" },
                    ],
                  },
                },
              },
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
