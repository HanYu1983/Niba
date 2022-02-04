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
  texts: [
    createTokuSyuKouKaText(["改装", "レッドフレーム系"], {}),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",

      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    getCardTextMacro({
      id: "PlayText",

      description:
        "＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞",
      additionalRequire: [
        createRollCostRequire(1, null),
        // TODO: このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合
      ],
      timing: ["戦闘フェイズ"],
      feedbackBlock: {
        require: {
          id: "RequireAnd",
          and: [
            createRollCostRequire(1, null),
            {
              id: "RequireTarget",
              targets: {
                白のGサインを持つ自軍G: {
                  id: "腳本",
                  value: "",
                },
              },
              condition: {
                id: "ConditionAnd",
                and: [
                  {
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
