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
import { GameEventOnManualEventCustomID } from "../gameEventOnManualEventCustomID";
import { RequireCustomID } from "../../tool/basic/requireCustom";

// 179030_11E_U_BL210N_blue
// N
// CCA
// リ・ガズィ（ケーラ機）
// リ・ガズィ系　MS　専用「ケーラ・スゥ」
// 戦闘配備　〔１〕：改装［リ・ガズィ系］
// 『起動』：青のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "リ・ガズィ（ケーラ機）",
  characteristic: "リ・ガズィ系　MS　専用「ケーラ・スゥ」".split("　"),
  category: "ユニット",
  color: "青",
  rollCost: ["青", null, null, null],
  texts: [
    createTokuSyuKouKaText(["戦闘配備"], { cost: 0 }),
    createTokuSyuKouKaText(["改装", "リ・ガズィ系"], { cost: 1 }),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(1, "青")],
    }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：青のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。",
      block: {
        require: {
          id: "RequireAnd",
          and: [
            {
              id: "RequireCustom",
              customID: {
                id: "{color}のGサインを持つ自軍Gが{number}枚以上ある場合",
                color: "青",
                number: 4,
              } as RequireCustomID,
            },
            {
              id: "RequireEvent",
              // このカードが場に出た場合
            },
          ],
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
                cardStateID: "ターン終了時に、このカードを持ち主のGにできる",
                cardTextState: {
                  id: "カードのテキスト",
                  value: [
                    {
                      id: "179030_11E_U_BL210N_blue_ターン終了時に、このカードを持ち主のGにできる。_0",
                      enabled: true,
                      cardText: {
                        id: "自動型",
                        category: "起動",
                        description:
                          "ターン終了時に、このカードを持ち主のGにできる。",
                        block: {
                          require: {
                            id: "RequireEvent",
                            // ターン終了時に
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
                                                  value: ["持ち主", "Gゾーン"],
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                },
                                {
                                  id: "ActionDeleteGlobalCardText",
                                  cardStateID:
                                    "ターン終了時に、このカードを持ち主のGにできる。",
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

module.exports = prototype;
