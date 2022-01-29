import { getCustomFunctionString } from "../../../../tool/helper";
import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { getCardTextMacro } from "./cardTextMacro";
import { DEFAULT_CARD_TEXT_SIYOU_KATA } from "../../tool/basic/basic";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。（注：このカードが場に出た時にも起動する）

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null, null],
  texts: [
    createTokuSyuKouKaText(["改装", "ブルーフレーム系"], { cost: 0 }),
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayUnit",

      additionalRequire: [createRollCostRequire(1, "白")],
    }).cardText,
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。（注：このカードが場に出た時にも起動する）",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getCardTextMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "「改装」の効果で場に出た場合", cardID: "" },
              }).condition,
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
                        error: "必須是自軍機體",
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
                  require: {
                    id: "RequireAnd",
                    and: [
                      createRollCostRequire(2, "白"),
                      {
                        id: "RequireTarget",
                        targets: {
                          "５以下の防御力を持つ敵軍ユニット１枚": {
                            id: "カード",
                            value: [],
                            valueLengthInclude: [1],
                          },
                        },
                        condition: {
                          id: "ConditionAnd",
                          and: [
                            {
                              id: "ConditionComparePlayer",
                              value: [
                                {
                                  id: "プレーヤー",
                                  value: {
                                    path: [
                                      {
                                        id: "カード",
                                        value:
                                          "５以下の防御力を持つ敵軍ユニット１枚",
                                      },
                                      "的「コントローラー」",
                                    ],
                                  },
                                },
                                "!=",
                                {
                                  id: "プレーヤー",
                                  value: {
                                    path: [
                                      {
                                        id: "カード",
                                        value: { path: [{ id: "このカード" }] },
                                      },
                                      "的「コントローラー」",
                                    ],
                                  },
                                },
                              ],
                            },
                            {
                              id: "ConditionCompareCardCategory",
                              value: [
                                {
                                  id: "カードの種類",
                                  value: {
                                    path: [
                                      {
                                        id: "カード",
                                        value:
                                          "５以下の防御力を持つ敵軍ユニット１枚",
                                      },
                                      "的「種類」",
                                    ],
                                  },
                                },
                                "==",
                                {
                                  id: "カードの種類",
                                  value: ["ユニット"],
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
                                        id: "カード",
                                        value:
                                          "５以下の防御力を持つ敵軍ユニット１枚",
                                      },
                                      "的「防御力」",
                                    ],
                                  },
                                },
                                "<=",
                                {
                                  id: "數字",
                                  value: [5],
                                },
                              ],
                            },
                          ],
                        },
                        action: [
                          {
                            id: "ActionDestroy",
                            cards: {
                              id: "カード",
                              value: "５以下の防御力を持つ敵軍ユニット１枚",
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
