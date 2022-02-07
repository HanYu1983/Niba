import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179022_06C_U_WT113R_white
// アストレイ ブルーフレーム セカンドG（スナイパーライフル）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：本来の記述に、「特徴：アストレイ系」を持つ自軍カードが場に出た場合、〔白１〕を支払う事ができる。その場合、敵軍ユニット１枚の上に、±０／±０／－１コイン２個を乗せる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム セカンドG（スナイパーライフル）",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null, null],
  battlePoint: [4, 2, 5],
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
        "『起動』：本来の記述に、「特徴：アストレイ系」を持つ自軍カードが場に出た場合、〔白１〕を支払う事ができる。その場合、敵軍ユニット１枚の上に、±０／±０／－１コイン２個を乗せる。",
      block: {
        contextID:
          "『起動』：本来の記述に、「特徴：アストレイ系」を持つ自軍カードが場に出た場合、〔白１〕を支払う事ができる。その場合、敵軍ユニット１枚の上に、±０／±０／－１コイン２個を乗せる。",
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "場に出た場合", cardID: "" },
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
                  require: {
                    id: "RequireAnd",
                    and: [
                      createRollCostRequire(1, "白"),
                      {
                        id: "RequireTarget",
                        targets: {
                          敵軍ユニット１枚: {
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
                              x: { id: "カード", value: "敵軍ユニット１枚" },
                              y: "敵軍",
                            }),
                            getConditionMacro({
                              id: "變量x的角色包含於y",
                              x: { id: "カード", value: "敵軍ユニット１枚" },
                              y: ["ユニット"],
                            }),
                          ],
                        },
                        action: [
                          {
                            id: "ActionSetTarget",
                            source: "敵軍ユニット１枚",
                            target: "敵軍ユニット１枚",
                          },
                        ],
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionAddCoinToCard",
                          cards: {
                            id: "カード",
                            value: "敵軍ユニット１枚",
                          },
                          coin: {
                            id: "CoinBattleBonus",
                            battleBonus: [0, 0, -1],
                          },
                          count: 2,
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
