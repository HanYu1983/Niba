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

// 179003_01A_U_BK008U_black
// U
// V
// シャッコー
// シャッコー系　MS
// （ダメージ判定ステップ）〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "シャッコー",
  characteristic: "シャッコー系　MS".split("　"),
  category: "ユニット",
  color: "黒",
  rollCost: ["黒", "黒", null],
  battlePoint: [4, 1, 4],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(2, "黒")],
    }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "〔２〕：このカードが戦闘ダメージで破壊されている場合、このカードを、破壊を無効にした上で自軍Gにする。",
      timing: ["ダメージ判定ステップ"],
      additionalRequire: [
        createRollCostRequire(2, null),
        {
          id: "RequireTarget",
          targets: {},
          condition: getConditionMacro({
            id: "このカードがx的idで破壊されている場合",
            x: { id: "戦闘ダメージ", playerID: "" },
          }),
        },
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionInvalidateDistroy",
                cards: {
                  id: "カード",
                  value: { path: [{ id: "このカード" }] },
                },
              },
              {
                id: "ActionMoveCardToPosition",
                cards: {
                  id: "カード",
                  value: { path: [{ id: "このカード" }] },
                },
                baSyou: {
                  id: "場所",
                  value: [{ id: "RelatedBaSyou", value: ["自軍", "Gゾーン"] }],
                },
              },
            ],
          },
        ],
      },
    }),
  ],
};

module.exports = prototype;
