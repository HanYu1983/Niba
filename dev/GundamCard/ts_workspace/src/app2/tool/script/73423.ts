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
      timing: ["攻撃ステップ"],
    },
    block: {
      require: {
        id: "RequireAnd",
        and: [
          {
            id: "RequireTarget",
            targets: [{ id: "このカード" }],
            action: [
              {
                id: "ActionSetFace",
                faceDown: false,
              },
              {
                id: "ActionSetTarget",
                targetID: "a",
              },
            ],
          },
          {
            id: "RequireTarget",
            targets: [null],
            condition: {
              id: "ConditionOr",
              or: [
                // in spec basyou
                // has quick
                {
                  id: "ConditionAnd",
                  and: [
                    // no has quick
                    // timing in A
                  ],
                },
              ],
            },
            action: [
              {
                id: "ActionSetTarget",
                targetID: "b",
              },
            ],
          },
        ],
      },
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
                {
                  id: "RequireTarget",
                  targets: [],
                  action: [
                    {
                      id: "ActionConsumeG",
                      color: "白",
                      count: 2,
                    },
                  ],
                },
                {
                  id: "RequireTarget",
                  targets: [null],
                  condition: {
                    id: "ConditionAnd",
                    and: [
                      {
                        id: "ConditionCardIsPlayerSide",
                        playerSide: "敵軍",
                      },
                      {
                        id: "ConditionCardPropertyCompare",
                        value: ["防御力", "<=", 5],
                      },
                    ],
                  },
                  action: [
                    {
                      id: "ActionSetTarget",
                      targetID: "cardA",
                    },
                  ],
                },
              ],
            }),
            feedback: [
              {
                id: "FeedbackTargetAction",
                targetID: "cardA",
                action: [
                  {
                    id: "ActionDestroy",
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
