import { Query, Text } from ".";
import { TokuSyuKouKa } from "../model/basic";
import { RequireCustomID } from "../model/gameContext/doRequireCustom";

const _protoID = "73423";

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。
// （注：このカードが場に出た時にも起動する）

let _seqID = 0;

export function createTokuSyuKouKaText(
  toku: TokuSyuKouKa,
  options: { cost?: number }
): Text {
  switch (toku[0]) {
    case "サイコミュ": {
      const [title, damage] = toku;
      return {
        text: `〔${options.cost || 0}〕：サイコミュ［${damage}`,
        category: {
          id: "使用型",
        },
        block: {
          require: {
            id: "RequireAnd",
            and: [
              {
                id: "RequireSiYouTiming",
                siYouTiming: ["防御ステップ"],
              },
              {
                id: "RequireTarget",
                targets: [],
                action: [{ id: "ActionConsumeG", count: options.cost || 0 }],
              },
              {
                id: "RequireCustom",
                customID: {
                  id: "このカードと同じエリアに、「特徴:x」を持つ自軍キャラがいる",
                  x: "NT",
                } as RequireCustomID,
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
                      id: "ConditionCardIsRole",
                      role: "ユニット",
                    },
                    // TODO: 交戦中
                  ],
                },
                action: [{ id: "ActionSetTarget", targetID: "cardA" }],
              },
            ],
          },
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                feedback: [
                  {
                    id: "FeedbackTargetAction",
                    targetID: "cardA",
                    action: [
                      // X damage
                    ],
                  },
                ],
              },
            },
          ],
        },
      };
    }
    case "範囲兵器": {
      const [title, damage] = toku;
      return {
        text: `〔${options.cost || 0}〕：範囲兵器［${damage}`,
        category: {
          id: "使用型",
        },
        block: {
          contextID: `createTokuSyuKouKaText_${_seqID++}`, // TODO uuid
          require: {
            id: "RequireAnd",
            and: [
              {
                id: "RequireSiYouTiming",
                siYouTiming: ["ダメージ判定ステップ"],
              },
              {
                id: "RequireTarget",
                targets: [],
                action: [{ id: "ActionConsumeG", count: options.cost || 0 }],
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
                      id: "ConditionCardIsRole",
                      role: "ユニット",
                    },
                    // TODO: 交戦中
                    // TODO: X防禦力以下
                  ],
                },
                action: [{ id: "ActionSetTarget", targetID: "cardA" }],
              },
            ],
          },
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
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
      };
    }
    case "改装": {
      const [title, tokuTyou] = toku;
      return {
        text: `〔${options.cost || 0}〕：改装［${tokuTyou}`,
        category: {
          id: "特殊効果",
          tokuSyuKouKa: toku,
        },
        block: {
          require: {
            id: "RequireAnd",
            and: [
              {
                id: "RequireSiYouTiming",
                siYouTiming: ["戦闘フェイズ"],
              },
              {
                id: "RequireTarget",
                targets: [],
                action: [{ id: "ActionConsumeG", count: options.cost || 0 }],
              },
              {
                id: "RequireTarget",
                targets: [{ id: "このカード" }],
                action: [
                  {
                    id: "ActionSetTarget",
                    targetID: "cardA",
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
                      id: "ConditionOr",
                      or: [
                        {
                          id: "ConditionCardOnBaSyou",
                          baSyou: {
                            id: "RelatedBaSyou",
                            value: ["自軍", "手札"],
                          },
                        },
                        {
                          id: "ConditionCardOnBaSyou",
                          baSyou: {
                            id: "RelatedBaSyou",
                            value: ["自軍", "ハンガー"],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCardOnCategory",
                      category: "ユニット",
                    },
                    {
                      id: "ConditionCardHasTokuTyou",
                      value: tokuTyou,
                    },
                  ],
                },
                action: [
                  { id: "ActionSetFace", faceDown: false },
                  { id: "ActionSetTarget", targetID: "cardB" },
                ],
              },
              {
                id: "RequireTarget",
                targets: [],
                action: [
                  {
                    id: "ActionCreateArrayFromSourceTargetID",
                    sourceTargetID: ["cardA", "cardB"],
                    targetID: "cardAB",
                  },
                ],
              },
            ],
          },
          feedback: [
            {
              id: "FeedbackTargetAction",
              targetID: "cardAB",
              action: [
                {
                  id: "ActionOKiKaeRu",
                },
              ],
            },
          ],
        },
      };
    }
    default: {
      return {
        text: "",
        category: {
          id: "使用型",
        },
        block: {},
      };
    }
  }
}

const texts: Text[] = [
  {
    text: "〔０〕：改装［ブルーフレーム系］",
    category: {
      id: "特殊効果",
      tokuSyuKouKa: ["改装", "ブルーフレーム系"],
    },
    block: {
      require: {
        id: "RequireTarget",
        targets: [],
        action: [
          { id: "ActionConsumeG", count: 0 },
          // add text
        ],
      },
    },
  },
  {
    text: "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。",
    category: {
      id: "自動型",
      category: "起動",
    },
    block: {},
  },
];

module.exports.texts = [];

module.exports.query = (q: Query): void => {
  switch (q.id) {
    case "QueryText": {
    }
  }
};
