import { CardPrototype, GameContext } from "../model/basic/gameContext";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。
// （注：このカードが場に出た時にも起動する）

const prototype: CardPrototype = {
  title: "アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
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
                  require: {
                    id: "RequireAnd",
                    and: [
                      // 〔白２〕を支払う事ができる
                      {
                        id: "RequireTarget",
                        targets: {
                          cards: {
                            id: "カード",
                            cardID: [null, null],
                          },
                        },
                        action: [
                          {
                            id: "ActionConsumeG",
                            cards: "cards",
                            color: {
                              id: "カードの色",
                              color: "白",
                            },
                          },
                        ],
                      },
                      {
                        id: "RequireTarget",
                        targets: {
                          "５以下の防御力を持つ敵軍ユニット１枚": {
                            id: "カード",
                            cardID: [null],
                          },
                        },
                        condition: {
                          id: "ConditionAnd",
                          and: [
                            {
                              id: "ConditionCardIsPlayerSide",
                              source: "５以下の防御力を持つ敵軍ユニット１枚",
                              playerSide: "敵軍",
                            },
                            {
                              id: "ConditionCardPropertyCompare",
                              source: "５以下の防御力を持つ敵軍ユニット１枚",
                              value: ["防御力", "<=", 5],
                            },
                          ],
                        },
                        action: [
                          {
                            id: "ActionDestroy",
                            cards: "５以下の防御力を持つ敵軍ユニット１枚",
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
