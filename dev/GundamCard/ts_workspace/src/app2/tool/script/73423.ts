import { Query, Text } from ".";
import { TextCategory } from "../model/basic";
import { GameContext } from "../model/gameContext";
import { wrapRequireKey } from "../model/scriptContext";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。
// （注：このカードが場に出た時にも起動する）
const texts: Text[] = [
  createTokuSyuKouKaText(["改装", "ブルーフレーム系"], { cost: 0 }),
  {
    text: "play card",
    category: {
      id: "使用型",
    },
    block: {
      require: {
        id: "RequireTarget",
        targets: {
          cards: { id: "このカード" },
          faceDown: { id: "TargetTypeYesNo", boolean: false },
          baSyou: {
            id: "場所",
            baSyou: { id: "RelatedBaSyou", value: ["自軍", "配備エリア"] },
          },
        },
        condition: {
          id: "ConditionOr",
          or: [
            // has quick
            // or
            // no quick && timing == "配置階段"
          ],
        },
        action: [
          {
            id: "ActionSetFace",
            cards: "cards",
            faceDown: "faceDown",
          },
          {
            id: "ActionSetTarget",
            source: "cards",
            target: "cards",
          },
          {
            id: "ActionSetTarget",
            source: "baSyou",
            target: "baSyou",
          },
        ],
      },
      feedback: [
        {
          id: "FeedbackAction",
          action: [
            {
              id: "ActionMoveCardToPosition",
              cards: "cards",
              baSyou: "baSyou",
            },
          ],
        },
      ],
    },
  },
  {
    text: "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。",
    category: {
      id: "自動型",
      category: [
        "起動",
        "「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合",
      ],
    },
    block: {
      feedback: [
        {
          id: "FeedbackAddBlock",
          block: {
            require: wrapRequireKey({
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
                    color: {
                      id: "カードの色",
                      color: "白",
                    },
                  },
                  action: [
                    {
                      id: "ActionConsumeG",
                      cards: "cards",
                      color: "color",
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
                      id: "ActionSetTarget",
                      source: "５以下の防御力を持つ敵軍ユニット１枚",
                      target: "５以下の防御力を持つ敵軍ユニット１枚",
                    },
                  ],
                },
              ],
            }),
            feedback: [
              {
                id: "FeedbackAction",
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
      ],
    },
  },
];

module.exports.query = (ctx: GameContext, q: Query): Query => {
  switch (q.id) {
    case "QueryText": {
      q.texts = texts;
      break;
    }
  }
  return q;
};
