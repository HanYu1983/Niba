import { createRollCostRequire } from "../../tool/basic/blockPayload";
import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
} from "../../tool/basic/gameContext";
import { RequireCustomID } from "../../tool/basic/requireCustom";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179030_11E_U_BL215R_blue
// 閃光のハサウェイ
// 戦闘配備　〔１〕：改装［ペーネロペー系］
//『恒常』：このカードが自軍手札にある状態で、青のGサインを持つ自軍ユニットが破壊されて廃棄された場合、〔１〕を支払う事ができる。その場合、このカードを、自軍配備エリアにリロール状態で出す。
//『起動』：このカードが場に出た場合、自軍ジャンクヤードにある、青のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "閃光のハサウェイ",
  characteristic: "オデュッセウス系　MS　専用「レーン・エイム」".split("　"),
  category: "ユニット",
  color: "青",
  rollCost: ["青", "青", null, null],
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
                id: "ActionAddGlobalCardText",
                cards: {
                  id: "カード",
                  value: { path: [{ id: "このカード" }] },
                },
                cardState: {
                  ...DEFAULT_CARD_STATE,
                  id: "『恒常』：このカードが自軍手札にある状態で、青のGサインを持つ自軍ユニットが破壊されて廃棄された場合、〔１〕を支払う事ができる。その場合、このカードを、自軍配備エリアにリロール状態で出す。",
                  cardTextStates: [
                    {
                      id: "",
                      enabled: true,
                      cardText: {
                        id: "自動型",
                        category: "起動",
                        description: "",
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
                                    isOption: true,
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
                                                id: "カード",
                                                value: {
                                                  path: [
                                                    {
                                                      id: "このカード",
                                                    },
                                                  ],
                                                },
                                              },
                                              baSyou: {
                                                id: "場所",
                                                value: [
                                                  {
                                                    id: "RelatedBaSyou",
                                                    value: [
                                                      "自軍",
                                                      "配備エリア",
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
                                },
                              ],
                            },
                          ],
                        },
                      },
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

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};