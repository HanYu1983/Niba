import { createRollCostRequire } from "../../tool/basic/blockPayload";
import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179008_02A_U_WT034U_white
// アストレイ ブルーフレーム
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。
// （注：このカードが廃棄される時にも起動する）

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null, null],
  texts: [
    createTokuSyuKouKaText(["改装", "ブルーフレーム系"], { cost: 0 }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。（注：このカードが廃棄される時にも起動する）",
      block: {
        // TODO: 「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合
        require: {
          id: "RequireJsonfp",
          targets: {},
          condition: {
            if: [
              {
                "->": [
                  {
                    cardCondition: {
                      id: "「特徴：X」を持つ自軍ユニットが、「改装」の効果で廃棄される場合",
                      x: "アストレイ系",
                      cardID: {
                        "->": [
                          "$input",
                          { getter: "blockPayload" },
                          { getter: "cause" },
                          { getter: "id" },
                          { "==": "「改装」の効果で廃棄される場合" },
                        ],
                      },
                    },
                  },
                  {
                    "->": [
                      "$input",
                      { getter: "blockPayload" },
                      { getter: "cause" },
                      { getter: "id" },
                      { "==": "「改装」の効果で廃棄される場合" },
                    ],
                  },
                  {
                    "->": [
                      "$input",
                      { getter: "blockPayload" },
                      { getter: "cause" },
                      { getter: "cardID" },
                      {
                        cardController: "$input",
                      },
                      {
                        "==": {
                          "->": [
                            {
                              thisCard: "$input",
                            },
                            {
                              cardController: "$input",
                            },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    "->": [
                      "$input",
                      { getter: "blockPayload" },
                      { getter: "cause" },
                      { getter: "cardID" },
                      { cardCh: null },
                      {
                        "==": {
                          "->": [{ thisCard: null }, { cardController: null }],
                        },
                      },
                    ],
                  },
                  { reduce: "and" },
                ],
              },
            ],
          },
          action: [],
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
                          id: "ActionDraw",
                          count: 1,
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

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
