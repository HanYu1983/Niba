import { createRollCostRequire } from "../../tool/basic/blockPayload";
import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。
// （注：このカードが場に出た時にも起動する）

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
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。",
      block: {
        // TODO: 「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合
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

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};