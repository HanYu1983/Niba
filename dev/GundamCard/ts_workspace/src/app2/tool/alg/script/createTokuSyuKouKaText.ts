import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { CardText, TokuSyuKouKa } from "../../tool/basic/basic";
import { RequireCustomID } from "../../tool/basic/requireCustom";

let _seqID = 0;
export function createTokuSyuKouKaText(
  toku: TokuSyuKouKa,
  options: { cost?: number }
): CardText {
  switch (toku[0]) {
    case "供給":
      return {
        id: "特殊型",
        description: toku,
        texts: [
          {
            id: "使用型",
            timing: ["自軍", "攻撃ステップ"],
            description: JSON.stringify(toku),
            block: {
              contextID: `createTokuSyuKouKaText_${_seqID++}`,
              require: {
                id: "RequireAnd",
                and: [
                  createRollCostRequire(options.cost || 0, null),
                  {
                    id: "RequireTarget",
                    targets: {
                      cards: {
                        id: "カード",
                        value: [],
                      },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        {
                          id: "ConditionCardPropertyCompare",
                          value: [
                            {
                              id: "TargetTypeNumber",
                              value: {
                                path: [
                                  { id: "TargetTypeRef", value: "cards" },
                                  "value.length",
                                ],
                              },
                            },
                            "==",
                            {
                              id: "TargetTypeNumber",
                              value: [1],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyComparePlayer",
                          value: [
                            {
                              id: "プレーヤー",
                              value: {
                                path: [
                                  { id: "カード", value: "cards" },
                                  "Controller",
                                ],
                              },
                            },
                            "==",
                            {
                              id: "プレーヤー",
                              value: {
                                path: [
                                  {
                                    id: "カード",
                                    value: {
                                      path: [{ id: "このカード" }],
                                    },
                                  },
                                  "Controller",
                                ],
                              },
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareRole",
                          value: [
                            {
                              id: "TargetTypeCardRole",
                              value: "cards",
                            },
                            "==",
                            {
                              id: "TargetTypeCardRole",
                              value: ["ユニット"],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareCard",
                          value: [
                            {
                              id: "カード",
                              value: "cards",
                            },
                            "!=",
                            {
                              id: "カード",
                              value: {
                                path: [{ id: "このカード" }],
                              },
                            },
                          ],
                        },
                      ],
                    },
                  },
                ],
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddBlock",
                      type: "堆疊",
                      block: {
                        feedback: [
                          {
                            id: "FeedbackAction",
                            action: [
                              {
                                id: "ActionReroll",
                                cards: {
                                  id: "カード",
                                  value: "cards",
                                },
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
    case "サイコミュ": {
      const [_, damage] = toku;
      return {
        id: "特殊型",
        description: toku,
        texts: [
          {
            id: "使用型",
            timing: ["防御ステップ"],
            description: JSON.stringify(toku),
            block: {
              contextID: `createTokuSyuKouKaText_${_seqID++}`,
              require: {
                id: "RequireAnd",
                and: [
                  createRollCostRequire(options.cost || 0, null),
                  {
                    id: "RequireCustom",
                    customID: {
                      id: "このカードと同じエリアに、「特徴:{x}」を持つ自軍キャラがいる",
                      x: "NT",
                    } as RequireCustomID,
                  },
                  {
                    id: "RequireTarget",
                    targets: {
                      targetCard: {
                        id: "カード",
                        value: [],
                      },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        {
                          id: "ConditionCardPropertyComparePlayer",
                          value: [
                            {
                              id: "プレーヤー",
                              value: {
                                path: [
                                  { id: "カード", value: "targetCard" },
                                  "Controller",
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
                                    value: {
                                      path: [{ id: "このカード" }],
                                    },
                                  },
                                  "Controller",
                                ],
                              },
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareRole",
                          value: [
                            {
                              id: "TargetTypeCardRole",
                              value: "targetCard",
                            },
                            "==",
                            {
                              id: "TargetTypeCardRole",
                              value: ["ユニット"],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareBoolean",
                          value: [
                            {
                              id: "TargetTypeBoolean",
                              value: {
                                path: [
                                  { id: "カード", value: "targetCard" },
                                  "交戦中",
                                ],
                              },
                            },
                            "==",
                            {
                              id: "TargetTypeBoolean",
                              value: [true],
                            },
                          ],
                        },
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source: "targetCard",
                        target: "targetCard",
                      },
                    ],
                  },
                  {
                    id: "RequireTarget",
                    targets: {
                      damage: {
                        id: "TargetTypeDamage",
                        value: damage,
                      },
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source: "damage",
                        target: "damage",
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
                      id: "ActionAddBlock",
                      type: "堆疊",
                      block: {
                        feedback: [
                          {
                            id: "FeedbackAction",
                            action: [
                              {
                                id: "ActionUnitDamage",
                                cards: {
                                  id: "カード",
                                  value: "targetCard",
                                },
                                value: "damage",
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
    }
    case "範囲兵器": {
      const [title, damage] = toku;
      return {
        id: "特殊型",
        description: toku,
        texts: [
          {
            id: "使用型",
            timing: ["ダメージ判定ステップ"],
            description: JSON.stringify(toku),
            block: {
              contextID: `createTokuSyuKouKaText_${_seqID++}`,
              require: {
                id: "RequireAnd",
                and: [
                  createRollCostRequire(options.cost || 0, null),
                  {
                    id: "RequireTarget",
                    targets: {
                      targetCard: {
                        id: "カード",
                        value: [],
                      },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        {
                          id: "ConditionCardPropertyCompareCard",
                          value: [
                            {
                              id: "カード",
                              value: "targetCard",
                            },
                            "交戦中",
                            {
                              id: "カード",
                              value: {
                                path: [
                                  {
                                    id: "このカード",
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareRole",
                          value: [
                            {
                              id: "TargetTypeCardRole",
                              value: "targetCard",
                            },
                            "==",
                            {
                              id: "TargetTypeCardRole",
                              value: ["ユニット"],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareBoolean",
                          value: [
                            {
                              id: "TargetTypeBoolean",
                              value: "targetCard",
                            },
                            "==",
                            {
                              id: "TargetTypeBoolean",
                              value: [true],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompare",
                          value: [
                            {
                              id: "TargetTypeNumber",
                              value: {
                                path: [
                                  {
                                    id: "カード",
                                    value: "targetCard",
                                  },
                                  "防御力",
                                ],
                              },
                            },
                            "<=",
                            {
                              id: "TargetTypeNumber",
                              value: [damage],
                            },
                          ],
                        },
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source: "targetCard",
                        target: "targetCard",
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
                      id: "ActionAddBlock",
                      type: "堆疊",
                      block: {
                        feedback: [
                          {
                            id: "FeedbackAction",
                            action: [
                              {
                                id: "ActionDestroy",
                                cards: {
                                  id: "カード",
                                  value: "targetCard",
                                },
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
    }
    case "改装": {
      const [title, tokuTyou] = toku;
      return {
        id: "特殊型",
        description: toku,
        texts: [
          {
            id: "使用型",
            timing: ["戦闘フェイズ"],
            description: JSON.stringify(toku),
            block: {
              contextID: `createTokuSyuKouKaText_${_seqID++}`,
              require: {
                id: "RequireAnd",
                and: [
                  createRollCostRequire(options.cost || 0, null),
                  {
                    id: "RequireTarget",
                    targets: {
                      cardA: {
                        id: "カード",
                        value: { path: [{ id: "このカード" }] },
                      },
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source: "cardA",
                        target: "cardA",
                      },
                    ],
                  },
                  {
                    id: "RequireTarget",
                    targets: {
                      cardB: { id: "カード", value: [] },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        {
                          id: "ConditionOr",
                          or: [
                            {
                              id: "ConditionCardPropertyCompareBaSyou",
                              value: [
                                {
                                  id: "場所",
                                  value: {
                                    path: [
                                      {
                                        id: "カード",
                                        value: "cardB",
                                      },
                                      "の場所",
                                    ],
                                  },
                                },
                                "==",
                                {
                                  id: "場所",
                                  value: [
                                    {
                                      id: "RelatedBaSyou",
                                      value: ["自軍", "手札"],
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              id: "ConditionCardPropertyCompareBaSyou",
                              value: [
                                {
                                  id: "場所",
                                  value: {
                                    path: [
                                      {
                                        id: "カード",
                                        value: "cardB",
                                      },
                                      "の場所",
                                    ],
                                  },
                                },
                                "==",
                                {
                                  id: "場所",
                                  value: [
                                    {
                                      id: "RelatedBaSyou",
                                      value: ["自軍", "ハンガー"],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardPropertyCompareRole",
                          value: [
                            {
                              id: "TargetTypeCardRole",
                              value: "targetCard",
                            },
                            "==",
                            {
                              id: "TargetTypeCardRole",
                              value: ["ユニット"],
                            },
                          ],
                        },
                        {
                          id: "ConditionCardHasTokuTyou",
                          source: "cardB",
                          value: tokuTyou,
                        },
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetFace",
                        cards: {
                          id: "カード",
                          value: "cardB",
                        },
                        faceDown: {
                          id: "TargetTypeBoolean",
                          value: [false],
                        },
                      },
                      {
                        id: "ActionSetTarget",
                        source: "cardB",
                        target: "cardB",
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
                      id: "ActionAddBlock",
                      type: "堆疊",
                      block: {
                        feedback: [
                          {
                            id: "FeedbackAction",
                            action: [
                              {
                                id: "ActionOKiKaeRu",
                                cardA: {
                                  id: "カード",
                                  value: "cardA",
                                },
                                cardB: {
                                  id: "カード",
                                  value: "cardB",
                                },
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
    }
    default: {
      return {
        id: "特殊型",
        description: toku,
        texts: [],
      };
    }
  }
}

// TODO: 合計國力 <= 自軍G的數量
// TODO: 詢問自軍G數量時還要帶入詢問原因（比如：為了改裝）

// 下一行可以解釋成：獲得「在詢問自軍G數量並原因為改裝時，自軍G的數量當成+1」的效果
// 『常駐』：このカードは、このカードの「改装」の効果において自軍Gとしても扱う事ができる。

// 下一行可以解釋成：獲得「在詢問卡片合計國力並原因為play時，帶入卡的條件為（自軍手札、レジェンド、ユニット）時，合計國力當成-1」的效果
// 『常駐』：自軍手札にある、「特徴：レジェンド」を持つ全てのユニットは、合計国力－１してプレイできる。（注：合計国力はマイナスの値にはならない）

// 179019_B1A_U_BL111R_blue
// 下一行代表毎張卡都要實做事件。當指定的卡出場時，加一個flag。在詢問時判斷有沒有flag來回傳效果
// 或是
// 當Z出場時，獲得「在詢問卡片合計國力並原因為play時，合計國力當力-3. 回合結束時移除」的效果
// 『恒常』：このカードは、「特徴：Ζ系」を持つ自軍ユニットが場に出たターン中にプレイする場合、合計国力－３してプレイできる。

// 『恒常』：このカードが自軍ジャンクヤードにある状態で、「特徴：陸戦型ガンダム系」を持つ自軍ユニットが場に出た場合、〔青１〕を支払う事ができる。その場合、このカードを自軍配備エリアにロール状態で出す。

// 下一行代表在feedback中加入1個起動型block在時間-1的位置，-1代表暫時性能力，處理完後要刪除。而自動型能力是不刪除的。
// 『起動』：青のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。

// 處理恒常、起動
// 遊戲一開始就將所有能力加入block到時間0的位置
// 每次事件來時，就重設cause中的事件並且doBlockRequire在所有時間為0的block
// doBlockRequire成功的就立刻執行doBlockFeedback
// 每次事件只問1次

// 處理常駐
// 遊戲一開始就將所有恒常能力加入block到時間0的位置
// 不代入事件。可以隨時doBlockRequire
// doBlockRequire成功的就立刻執行doBlockFeedback
// 但要注意：feedback的效果是重覆執行多次也沒關係的。比如，加入全場效果時要帶入唯一的ID

// 事件
// 出場時（哪張卡、哪個場）、進入區域時（戰鬥區或配置區）、play卡時（哪張卡、特徵有什麼)

// playCard當成使用型技能
// require為 有快速 或 沒快速並在配置階段
// require為 有stay並選擇配置區或setgroup 或 沒有stay並選擇setgroup
// feedback為 出場並横置。觸發出場事件
// 這張卡的戰配（起動型技能）會成立並且將卡片直立

// 處理使用型 （未完成）
// 和處理恒常、起動一樣
// 只是事件等同於帶

// ========================= Ver 2
// 每個text都是獨立的運算元，內容分為使用型區塊和事件型區塊
// 使用型區塊代表play card或play text的使用型技能
// 事件型區塊代表3個種類的自動型技能
// 在每次事件發生時，事件型區塊的所有block都要跑一次require, 看哪些require成功，成功後立刻加入效果堆疊。所以事件型區塊的block的第一層require只能判斷事件是否成立
// 使用型區塊在每個回合時問有那些卡可以play，第1層require就是play效果（展示一張卡、支付cost），feedback將「出場效果」加入效果堆疊。這個require的狀態直接在text中處理就行(ex. doTextBlock)
// 不管是哪一個區塊的block, 它的feedback也可以將新增匿名的text到text列表中，因為每個text都是一個運算元，所以可以處理像是回合結束時移除之類的效果
//
