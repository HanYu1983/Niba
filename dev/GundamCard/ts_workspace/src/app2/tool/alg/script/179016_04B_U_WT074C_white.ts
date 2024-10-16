import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179016_04B_U_WT074C_white
// M1アストレイ
// アストレイ系　MS
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、プレイされて場に出た場合、〔２〕を支払う事ができる。その場合、カード１枚を引く。（注：このカードが場に出た時にも起動する）

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "M1アストレイ",
  characteristic: "アストレイ系　MS".split("　"),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null],
  battlePoint: [3, 1, 3],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、プレイされて場に出た場合、〔２〕を支払う事ができる。その場合、カード１枚を引く。（注：このカードが場に出た時にも起動する）",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "プレイされて場に出た場合", cardID: "" },
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
                      { log: "blockPayload" },
                      { getter: "cause" },
                      { getter: "gameEvent" },
                      { getter: "cardID" },
                    ],
                  },
                  $isThisCard: {
                    "->": ["$gameEventCardID", { "==": "$cardID" }],
                  },
                  $hasCharacteristic: {
                    "->": [
                      "$in.ctx",
                      { getCardCharacteristic: "$gameEventCardID" },
                      { filter: { "==": "アストレイ系" } },
                      { size: null },
                      { ">": 0 },
                    ],
                  },
                  pass0: {
                    if: [
                      {
                        "->": [
                          [
                            {
                              "->": [
                                "$in.ctx",
                                { getCardController: "$cardID" },
                              ],
                            },
                            {
                              "->": [
                                "$in.ctx",
                                { getCardController: "$gameEventCardID" },
                              ],
                            },
                          ],
                          { reduce: "==" },
                        ],
                      },
                      {},
                      {
                        error: "必須是自軍",
                      },
                    ],
                  },
                  pass1: {
                    if: [
                      {
                        "->": [
                          ["$isThisCard", "$hasCharacteristic"],
                          { reduce: "or" },
                        ],
                      },
                      {},
                      {
                        error:
                          "被換裝廢棄的卡必須是這張卡或是存在特徵アストレイ系",
                      },
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
                  isOption: true,
                  require: createRollCostRequire(2, null),
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

module.exports = prototype;
