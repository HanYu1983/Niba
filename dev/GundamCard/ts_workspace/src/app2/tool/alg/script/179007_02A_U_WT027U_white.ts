import { getCustomFunctionString } from "../../../../tool/helper";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCard,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179007_02A_U_WT027U_white
// アストレイ レッドフレーム
// アストレイ系　レッドフレーム系　MS　専用「ロウ・ギュール」
// 〔０〕：改装［レッドフレーム系］
// ＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞

const prototype: CardPrototype = {
  title: "アストレイ レッドフレーム",
  characteristic: "アストレイ系　レッドフレーム系　MS　専用「ロウ・ギュール」".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  texts: [
    createTokuSyuKouKaText(["改装", "レッドフレーム系"], {}),
    {
      id: "使用型",
      timing: ["戦闘フェイズ"],
      description:
        "＜（戦闘フェイズ）〔１〕：このカードが、Gである状態で、白のGサインを持つ自軍Gが２枚以上ある場合、このカードを、ユニットとして自軍配備エリアにリロール状態で出す＞",
      block: {
        require: {
          id: "RequireEvent"
          // TODO
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddBlock",
                type: "立即",
                block: {
                  require: {
                    id: "RequireAnd",
                    and: [
                      createRollCostRequire(1, null),
                      {
                        id: "RequireTarget",
                        targets: {
                          白のGサインを持つ自軍G: {
                            id: "腳本",
                            value: ""
                          }
                        },
                        condition: {
                          id: "ConditionAnd",
                          and: [{
                            id: "ConditionCompareRole",
                            value: [
                              {
                                id: "「カード」的角色",
                                value: {
                                  path: [{ id: "カード", value: { path: [{ id: "このカード" }] } }, "的角色"]
                                }
                              },
                              "==",
                              {
                                id: "「カード」的角色", value: ["グラフィック"]
                              }
                            ]
                          },
                          {
                            id: "ConditionCompareNumber",
                            value: [
                              { id: "數字", value: { path: [{ id: "參照", value: "白のGサインを持つ自軍G" }, "的陣列長度"] } },
                              ">=",
                              { id: "數字", value: [2] }
                            ]
                          }]
                        }
                      }
                    ]
                  },
                  feedback: [
                    {
                      id: "FeedbackAction", action: [{
                        id: "ActionMoveCardToPosition",
                        cards: {
                          id: "カード",
                          value: {
                            path: [{ id: "このカード" }]
                          }
                        },
                        baSyou: {
                          id: "場所",
                          value: [{ id: "RelatedBaSyou", value: ["自軍", "配備エリア"] }]
                        }
                      }]
                    }
                  ]
                }
              },
            ],
          },
        ],
      },
    },
  ],
};

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
