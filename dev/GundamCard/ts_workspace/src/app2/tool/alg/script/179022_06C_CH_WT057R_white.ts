import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179022_06C_CH_WT057R_white
// 叢雲劾
// 男性　大人　CO
// 〔白２〕：共有［ブルーフレーム系］
// 『常駐』：このカードは、「専用機のセット」が成立するユニットにセットされている場合、「速攻」「強襲」を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "叢雲劾",
  characteristic: "男性　大人　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", "白", null, null],
  battlePoint: [2, 2, 2],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    createTokuSyuKouKaText(["共有", "ブルーフレーム系"], {
      cost: 2,
      costColor: "白",
    }),
    {
      id: "自動型",
      category: "常駐",
      description:
        "『常駐』：このカードは、「専用機のセット」が成立するユニットにセットされている場合、「速攻」「強襲」を得る。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: getConditionMacro({
            id: "このカードは、「専用機のセット」が成立するユニットにセットされている場合",
          }),
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
                cardStateID:
                  "『常駐』：このカードは、「専用機のセット」が成立するユニットにセットされている場合、「速攻」「強襲」を得る。",
                cardTextState: {
                  id: "TargetTypeCardTextState",
                  value: [
                    {
                      id: "",
                      enabled: true,
                      cardText: createTokuSyuKouKaText(["速攻"], {}),
                    },
                    {
                      id: "",
                      enabled: true,
                      cardText: createTokuSyuKouKaText(["強襲"], {}),
                    },
                    {
                      id: "",
                      enabled: true,
                      cardText: {
                        id: "自動型",
                        category: "常駐",
                        description: "",
                        block: {
                          require: {
                            id: "RequireTarget",
                            targets: {},
                            condition: {
                              id: "ConditionNot",
                              not: getConditionMacro({
                                id: "このカードは、「専用機のセット」が成立するユニットにセットされている場合",
                              }),
                            },
                          },
                          feedback: [
                            {
                              id: "FeedbackAction",
                              action: [
                                {
                                  id: "ActionDeleteGlobalCardText",
                                  cardStateID:
                                    "『常駐』：このカードは、「専用機のセット」が成立するユニットにセットされている場合、「速攻」「強襲」を得る。",
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
