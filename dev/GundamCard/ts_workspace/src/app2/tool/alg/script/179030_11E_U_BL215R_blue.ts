import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { RequireCustomID } from "../../tool/basic/requireCustom";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179030_11E_U_BL215R_blue
// 閃光のハサウェイ
// 戦闘配備　〔１〕：改装［ペーネロペー系］
//『恒常』：このカードが自軍手札にある状態で、青のGサインを持つ自軍ユニットが破壊されて廃棄された場合、〔１〕を支払う事ができる。その場合、このカードを、自軍配備エリアにリロール状態で出す。
//『起動』：このカードが場に出た場合、自軍ジャンクヤードにある、青のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。

const prototype: CardPrototype = {
  title: "閃光のハサウェイ",
  characteristic: "オデュッセウス系　MS　専用「レーン・エイム」".split("　"),
  category: "ユニット",
  color: "青",
  texts: [
    createTokuSyuKouKaText(["戦闘配備"], { cost: 0 }),
    createTokuSyuKouKaText(["改装", "ペーネロペー系"], { cost: 1 }),
    {
      id: "自動型",
      category: "恒常",
      description:
        "『恒常』：このカードが自軍手札にある状態で、青のGサインを持つ自軍ユニットが破壊されて廃棄された場合、〔１〕を支払う事ができる。その場合、このカードを、自軍配備エリアにリロール状態で出す。",
      block: {
        require: {
          id: "RequireCustom",
          customID: {
            id: "このカードが自軍手札にある状態",
          } as RequireCustomID,
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
                        targets: {},
                        action: [
                          {
                            id: "ActionMoveCardToPosition",
                            cards: {
                              id: "このカード",
                            },
                            baSyou: {
                              id: "場所",
                              baSyou: {
                                id: "RelatedBaSyou",
                                value: ["自軍", "配備エリア"],
                              },
                            },
                          },
                        ],
                      },
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
};

module.exports = prototype;
