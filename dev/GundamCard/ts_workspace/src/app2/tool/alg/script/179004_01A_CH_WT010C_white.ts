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

// 179004_01A_CH_WT010C_white
// ミゲル・アイマン
// 男性　子供　CO
// 速攻
// 『起動』：このセットグループのユニットは、戦闘ダメージを受けた場合、破壊される。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ミゲル・アイマン",
  characteristic: "男性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白"],
  battlePoint: [2, 1, 1],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    createTokuSyuKouKaText(["速攻"], {}),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：このセットグループのユニットは、戦闘ダメージを受けた場合、破壊される。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "戦闘ダメージを受けた場合", cardID: "" },
              }),
              {
                id: "ConditionJsonfp",
                program: {
                  $cardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "cardID" },
                    ],
                  },
                  $gameEventCardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "gameEvent" },
                      { getter: "cardID" },
                    ],
                  },
                  pass1: {
                    if: [
                      {
                        "->": [
                          "$in.ctx",
                          { getSetGroupRoot: "$cardID" },
                          { "==": "$gameEventCardID" },
                        ],
                      },
                      {},
                      { error: "必須是這個setGroup的unit" },
                    ],
                  },
                },
              },
            ],
          },
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddBlock",
                type: "立即",
                block: {
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionDestroy",
                          cards: {
                            id: "カード",
                            value: {
                              path: [
                                {
                                  id: "カード",
                                  value: { path: [{ id: "このカード" }] },
                                },
                                "のセットグループのユニット",
                              ],
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

module.exports = prototype;
