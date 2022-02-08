import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179019_01A_C_WT010C_white
// 黄昏の魔弾
// 強化
// （戦闘フェイズ）：自軍ユニット１枚は、ターン終了時まで「速攻」または「高機動」を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "黄昏の魔弾",
  characteristic: "強化".split("　"),
  category: "コマンド",
  color: "白",
  rollCost: ["白"],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（戦闘フェイズ）：[自軍ユニット１枚は、ターン終了時まで「速攻」]または「高機動」[を得る]。",
      timing: ["戦闘フェイズ"],
      varCtxID: "varCtxID1",
      additionalRequire: [
        createRollCostRequire(1, "白"),
        {
          id: "RequireTarget",
          targets: {
            自軍ユニット１枚: {
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
                x: { id: "カード", value: "自軍ユニット１枚" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "自軍ユニット１枚" },
                y: ["ユニット"],
              }),
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "自軍ユニット１枚",
              target: "自軍ユニット１枚",
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
                id: "ActionAddGlobalCardText",
                cards: { id: "カード", value: "自軍ユニット１枚" },
                cardStateID: "ターン終了時まで「速攻」を得る。",
                cardTextState: {
                  id: "カードのテキスト",
                  value: [
                    {
                      id: "",
                      enabled: true,
                      cardText: createTokuSyuKouKaText(["速攻"], {}),
                    },
                    {
                      id: "",
                      enabled: true,
                      cardText: getCardTextMacro({
                        id: "ターン終了時までの場合",
                        feedbackAction: [
                          {
                            id: "ActionDeleteGlobalCardText",
                            cardStateID: "ターン終了時まで「速攻」を得る。",
                          },
                        ],
                      }),
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（戦闘フェイズ）：[自軍ユニット１枚は]、ターン終了時まで「速攻」または[「高機動」を得る]。",
      timing: ["戦闘フェイズ"],
      varCtxID: "varCtxID1",
      additionalRequire: [
        createRollCostRequire(1, "白"),
        {
          id: "RequireTarget",
          targets: {
            自軍ユニット１枚: {
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
                x: { id: "カード", value: "自軍ユニット１枚" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "自軍ユニット１枚" },
                y: ["ユニット"],
              }),
            ],
          },
        },
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddGlobalCardText",
                cards: { id: "カード", value: "自軍ユニット１枚" },
                cardStateID: "ターン終了時まで「高機動」を得る。",
                cardTextState: {
                  id: "カードのテキスト",
                  value: [
                    {
                      id: "",
                      enabled: true,
                      cardText: createTokuSyuKouKaText(["高機動"], {}),
                    },
                    {
                      id: "",
                      enabled: true,
                      cardText: getCardTextMacro({
                        id: "ターン終了時までの場合",
                        feedbackAction: [
                          {
                            id: "ActionDeleteGlobalCardText",
                            cardStateID: "ターン終了時まで「高機動」を得る。",
                          },
                        ],
                      }),
                    },
                  ],
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
