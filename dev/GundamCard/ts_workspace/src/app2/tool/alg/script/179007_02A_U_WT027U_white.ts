import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179007_02A_U_WT027U_white
// アストレイ レッドフレーム
// アストレイ系　レッドフレーム系　MS　専用「ロウ・ギュール」
// 〔０〕：改装［レッドフレーム系］
// ＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ レッドフレーム",
  characteristic:
    "アストレイ系　レッドフレーム系　MS　専用「ロウ・ギュール」".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [4, 1, 4],
  texts: [
    createTokuSyuKouKaText(["改装", "レッドフレーム系"], {}),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞",
      additionalRequire: [
        createRollCostRequire(1, null),
        {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionCompareRole",
            value: [
              {
                id: "「カード」的角色",
                value: {
                  path: [
                    {
                      id: "カード",
                      value: { path: [{ id: "このカード" }] },
                    },
                    "的角色",
                  ],
                },
              },
              "==",
              {
                id: "「カード」的角色",
                value: ["グラフィック"],
              },
            ],
          },
        },
        {
          id: "RequireTarget",
          targets: {
            白のGサインを持つ自軍G: {
              id: "カード",
              value: [],
            },
          },
          condition: {
            id: "ConditionAnd",
            and: [
              {
                id: "ConditionCompareCardColor",
                value: [
                  {
                    id: "カードの色",
                    value: {
                      path: [
                        {
                          id: "カード",
                          value: "白のGサインを持つ自軍G",
                        },
                        "的「色」",
                      ],
                    },
                  },
                  "==",
                  {
                    id: "カードの色",
                    value: ["白"],
                  },
                ],
              },
              getConditionMacro({
                id: "變量x的是y軍",
                x: { id: "カード", value: "白のGサインを持つ自軍G" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "白のGサインを持つ自軍G" },
                y: ["グラフィック"],
              }),
              {
                id: "ConditionCompareNumber",
                value: [
                  {
                    id: "數字",
                    value: {
                      path: [
                        {
                          id: "參照",
                          value: "白のGサインを持つ自軍G",
                        },
                        "的陣列長度",
                      ],
                    },
                  },
                  ">=",
                  { id: "數字", value: [2] },
                ],
              },
            ],
          },
        },
      ],
      timing: ["戦闘フェイズ"],
      feedbackBlock: {
        require: {
          id: "RequireAnd",
          and: [createRollCostRequire(1, null)],
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionMoveCardToPosition",
                cards: {
                  id: "カード",
                  value: {
                    path: [{ id: "このカード" }],
                  },
                },
                baSyou: {
                  id: "場所",
                  value: [
                    {
                      id: "RelatedBaSyou",
                      value: ["自軍", "配備エリア"],
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
