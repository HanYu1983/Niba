import { createRollCostRequire, Require } from "../../tool/basic/blockPayload";
import {
  CardColor,
  CardText,
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  TokuSyuKouKa,
} from "../../tool/basic/basic";
import { RequireCustomID } from "../../tool/basic/requireCustom";
import { getRequireMacro } from "./getRequireMacro";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { CardTextState } from "../../tool/basic/gameContext";

var _seqID = 0;
export function createTokuSyuKouKaText(
  toku: TokuSyuKouKa,
  options: {
    cost?: number;
    costColor?: CardColor;
    crossWeaponTextStateIDs?: string[];
    cardTextStateID?: string;
  }
): CardText {
  switch (toku[0]) {
    case "PS装甲":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          {
            id: "自動型",
            category: "常駐",
            description: "",
            block: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddEffect",
                      effect: {
                        id: "GameEffectCustom",
                        customID: "機體出場時不用横置的效果",
                      },
                    },
                  ],
                },
              ],
            },
          },
          {
            id: "自動型",
            category: "起動",
            description: "",
            block: {
              require: {
                id: "RequireTarget",
                targets: {},
                condition: {
                  id: "ConditionCompareCard",
                  // TODO: 出現在戰場時
                  value: [
                    { id: "カード", value: { path: [{ id: "このカード" }] } },
                    "==",
                    {
                      id: "カード",
                      value: {
                        path: [
                          {
                            id: "手動事件發生時",
                            value: {
                              path: [{ id: "觸發這個事件的手動事件" }],
                            },
                          },
                          "プレイされて場に出た場合のカード",
                        ],
                      },
                    },
                  ],
                },
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    // 設置回家旗標
                  ],
                },
              ],
            },
          },
          {
            id: "自動型",
            category: "起動",
            description: "",
            block: {
              require: {
                id: "RequireTarget",
                targets: {},
                // 回合開始時,
                // 並且有旗標時
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    // 回手
                    // 刪除旗標
                  ],
                },
              ],
            },
          },
          {
            id: "自動型",
            category: "起動",
            description: "",
            block: {
              require: {
                id: "RequireTarget",
                targets: {},
                // 和供給或補給組成部隊時
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    // 刪除回家旗標
                  ],
                },
              ],
            },
          },
        ],
      };
    case "戦闘配備":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          {
            id: "自動型",
            category: "常駐",
            description: JSON.stringify(toku),
            block: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddEffect",
                      effect: {
                        id: "GameEffectCustom",
                        customID: "機體出場時不用横置的效果",
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    case "クイック":
      return {
        id: "特殊型",
        description: toku,
        texts: [
          {
            id: "自動型",
            category: "常駐",
            description: JSON.stringify(toku),
            block: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddEffect",
                      effect: {
                        id: "GameEffectCustom",
                        customID: "可以在任一時間使用的效果",
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    case "ステイ":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayCharacter(Stay)",
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
            ],
          }),
        ],
      };
    case "高機動":
      return {
        id: "特殊型",
        description: toku,
        texts: [
          {
            id: "自動型",
            category: "常駐",
            description: JSON.stringify(toku),
            block: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddEffect",
                      effect: {
                        id: "GameEffectCustom",
                        customID: "高機動",
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    case "速攻":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          {
            id: "自動型",
            category: "常駐",
            description: JSON.stringify(toku),
            block: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddEffect",
                      effect: {
                        id: "GameEffectCustom",
                        customID: "速攻",
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    case "強襲":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          {
            id: "自動型",
            category: "常駐",
            description: JSON.stringify(toku),
            block: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddEffect",
                      effect: {
                        id: "GameEffectCustom",
                        customID: "強襲",
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      };
    case "クロスウェポン":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayText",
            description:
              "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
            timing: ["戦闘フェイズ"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              {
                id: "RequireTarget",
                targets: {
                  "［ ］の特徴を持つ自軍ユニット１枚": {
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
                      x: {
                        id: "カード",
                        value: "［ ］の特徴を持つ自軍ユニット１枚",
                      },
                      y: "自軍",
                    }),
                    getConditionMacro({
                      id: "變量x的角色包含於y",
                      x: {
                        id: "カード",
                        value: "［ ］の特徴を持つ自軍ユニット１枚",
                      },
                      y: ["ユニット"],
                    }),
                    getConditionMacro({
                      id: "變量x的特徵包含於y",
                      x: {
                        id: "カード",
                        value: "［ ］の特徴を持つ自軍ユニット１枚",
                      },
                      y: [toku[1]],
                    }),
                  ],
                },
                action: [
                  {
                    id: "ActionSetTarget",
                    source: "［ ］の特徴を持つ自軍ユニット１枚",
                    target: "［ ］の特徴を持つ自軍ユニット１枚",
                  },
                ],
              },
            ],
            feedbackBlock: {
              require: {
                id: "RequireTarget",
                targets: {
                  本来のテキスト１つ: {
                    id: "カードのテキスト",
                    value: [],
                    valueLengthInclude: [1],
                    tipID: options.crossWeaponTextStateIDs || [],
                  },
                },
                action: [
                  {
                    id: "ActionSetTarget",
                    source: "本来のテキスト１つ",
                    target: "本来のテキスト１つ",
                  },
                ],
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionAddGlobalCardText",
                      cards: {
                        id: "カード",
                        value: "［ ］の特徴を持つ自軍ユニット１枚",
                      },
                      cardStateID:
                        "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、[このカードの本来のテキスト１つと同じテキストを得る]。ただし同じテキストは得られない）",
                      cardTextState: {
                        id: "カードのテキスト",
                        value: "本来のテキスト１つ",
                      },
                    },
                    {
                      id: "ActionAddGlobalCardText",
                      cards: {
                        id: "カード",
                        value: "［ ］の特徴を持つ自軍ユニット１枚",
                      },
                      cardStateID:
                        "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、[ターン終了時まで]、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                      cardTextState: {
                        id: "カードのテキスト",
                        value: [
                          {
                            id: "",
                            enabled: true,
                            cardText: getCardTextMacro({
                              id: "ターン終了時までの場合",
                              feedbackAction: [
                                {
                                  id: "ActionDeleteGlobalCardText",
                                  cardStateID:
                                    "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、[このカードの本来のテキスト１つと同じテキストを得る]。ただし同じテキストは得られない）",
                                },
                                {
                                  id: "ActionDeleteGlobalCardText",
                                  cardStateID:
                                    "（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、[ターン終了時まで]、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）",
                                },
                              ],
                            }),
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
          }),
        ],
      };
    case "ゲイン":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayText",

            description: JSON.stringify(toku),
            timing: ["ダメージ判定ステップ"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
              getRequireMacro({ id: "このカードが戦闘エリアにいる場合" }),
            ],
            feedbackBlock: {
              require: {
                id: "RequireAnd",
                and: [
                  // 翻開本國最上方的卡
                  {
                    id: "RequireTarget",
                    targets: {
                      自軍本國上的卡1張: {
                        id: "カード",
                        value: {
                          path: [
                            {
                              id: "カード",
                              value: {
                                path: [
                                  {
                                    id: "場所",
                                    value: [
                                      {
                                        id: "RelatedBaSyou",
                                        value: ["自軍", "本国"],
                                      },
                                    ],
                                  },
                                  "的「カード」",
                                ],
                              },
                            },
                            "の上のカードX枚",
                            1,
                          ],
                        },
                      },
                    },
                    // TODO: 比較G標誌
                    condition: {
                      id: "ConditionCompareString",
                      value: [
                        {
                          id: "字串",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "自軍本國上的卡1張",
                              },
                              "的「名称」",
                            ],
                          },
                        },
                        "==",
                        {
                          id: "字串",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: {
                                  path: [{ id: "このカード" }],
                                },
                              },
                              "的「名称」",
                            ],
                          },
                        },
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetFace",
                        cards: {
                          id: "カード",
                          value: "自軍本國上的卡1張",
                        },
                        faceDown: {
                          id: "布林",
                          value: [false],
                        },
                      },
                    ],
                  },
                  // 獲得的戰鬥修正
                  {
                    id: "RequireTarget",
                    targets: {
                      自軍本國上的卡1張的戰鬥修正: {
                        id: "戦闘修正",
                        value: {
                          path: [
                            {
                              id: "數字",
                              value: {
                                path: [
                                  {
                                    id: "カード",
                                    value: "自軍本國上的卡1張",
                                  },
                                  "的「ロールコストの合計値」",
                                ],
                              },
                            },
                            "の戦闘修正",
                          ],
                        },
                      },
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source: "自軍本國上的卡1張的戰鬥修正",
                        target: "自軍本國上的卡1張的戰鬥修正",
                      },
                    ],
                  },
                ],
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    // add battleBonus
                    // trigger manualEvent
                  ],
                },
              ],
            },
          }),
        ],
      };
    case "供給":
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayText",

            description: JSON.stringify(toku),
            timing: ["自軍", "攻撃ステップ"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
              {
                id: "RequireTarget",
                targets: {
                  cards: {
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
                              { id: "カード", value: "cards" },
                              "的「コントローラー」",
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
                              "的「コントローラー」",
                            ],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareRole",
                      value: [
                        {
                          id: "「カード」的角色",
                          value: "cards",
                        },
                        "==",
                        {
                          id: "「カード」的角色",
                          value: ["ユニット"],
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareCard",
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
                action: [
                  {
                    id: "ActionSetTarget",
                    source: "cards",
                    target: "cards",
                  },
                ],
              },
            ],
            feedbackBlock: {
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
          }),
        ],
      };
    case "サイコミュ": {
      const [_, damage] = toku;
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayText",
            description: JSON.stringify(toku),
            timing: ["防御ステップ"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
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
                      id: "ConditionComparePlayer",
                      value: [
                        {
                          id: "プレーヤー",
                          value: {
                            path: [
                              { id: "カード", value: "targetCard" },
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
                                value: {
                                  path: [{ id: "このカード" }],
                                },
                              },
                              "的「コントローラー」",
                            ],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareRole",
                      value: [
                        {
                          id: "「カード」的角色",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "targetCard",
                              },
                              "的角色",
                            ],
                          },
                        },
                        "==",
                        {
                          id: "「カード」的角色",
                          value: ["ユニット"],
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareBoolean",
                      value: [
                        {
                          id: "布林",
                          value: {
                            path: [
                              { id: "カード", value: "targetCard" },
                              "在「交戦中」？",
                            ],
                          },
                        },
                        "==",
                        {
                          id: "布林",
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
            ],
            feedbackBlock: {
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
                      damage: { id: "數字", value: [damage] },
                    },
                  ],
                },
              ],
            },
          }),
        ],
      };
    }
    case "範囲兵器": {
      const [title, damage] = toku;
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayText",
            description: JSON.stringify(toku),
            timing: ["ダメージ判定ステップ"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
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
                      id: "ConditionCompareCard",
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
                      id: "ConditionCompareRole",
                      value: [
                        {
                          id: "「カード」的角色",
                          value: "targetCard",
                        },
                        "==",
                        {
                          id: "「カード」的角色",
                          value: ["ユニット"],
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareBoolean",
                      value: [
                        {
                          id: "布林",
                          value: "targetCard",
                        },
                        "==",
                        {
                          id: "布林",
                          value: [true],
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
                                value: "targetCard",
                              },
                              "的「防御力」",
                            ],
                          },
                        },
                        "<=",
                        {
                          id: "數字",
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
            feedbackBlock: {
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
          }),
        ],
      };
    }
    case "改装": {
      const [title, tokuTyou] = toku;
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          getCardTextMacro({
            id: "PlayText",
            description: JSON.stringify(toku),
            timing: ["戦闘フェイズ"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
              {
                id: "RequireTarget",
                targets: {
                  被改裝置換的卡: {
                    id: "カード",
                    value: { path: [{ id: "このカード" }] },
                  },
                },
                condition: {
                  id: "ConditionCompareBaSyou",
                  value: [
                    {
                      id: "場所",
                      value: {
                        path: [
                          {
                            id: "カード",
                            value: { path: [{ id: "このカード" }] },
                          },
                          "的「場所」",
                        ],
                      },
                    },
                    "in",
                    {
                      id: "場所",
                      value: [
                        {
                          id: "RelatedBaSyou",
                          value: ["自軍", "配備エリア"],
                        },
                        {
                          id: "RelatedBaSyou",
                          value: ["自軍", "戦闘エリア（右）"],
                        },
                        {
                          id: "RelatedBaSyou",
                          value: ["自軍", "戦闘エリア（左）"],
                        },
                      ],
                    },
                  ],
                },
                action: [
                  {
                    id: "ActionSetTarget",
                    source: "被改裝置換的卡",
                    target: "被改裝置換的卡",
                  },
                ],
              },
              {
                id: "RequireAnd",
                and: [
                  {
                    id: "RequireTarget",
                    targets: {
                      改裝出場的卡: {
                        id: "カード",
                        value: [],
                        valueLengthInclude: [1],
                      },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        // {
                        //   id: "ConditionCompareCard",
                        //   value: [
                        //     { id: "カード", value: "改裝出場的卡" },
                        //     "!=",
                        //     { id: "カード", value: { path: [{ id: "このカード" }] } }
                        //   ]
                        // },
                        {
                          id: "ConditionCompareBaSyou",
                          value: [
                            {
                              id: "場所",
                              value: {
                                path: [
                                  {
                                    id: "カード",
                                    value: "改裝出場的卡",
                                  },
                                  "的「場所」",
                                ],
                              },
                            },
                            "in",
                            {
                              id: "場所",
                              value: [
                                {
                                  id: "RelatedBaSyou",
                                  value: ["自軍", "手札"],
                                },
                                {
                                  id: "RelatedBaSyou",
                                  value: ["自軍", "ハンガー"],
                                },
                              ],
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
                                    value: "改裝出場的卡",
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
                                  { id: "カード", value: "改裝出場的卡" },
                                  "的「合計国力」",
                                ],
                              },
                            },
                            "<=",
                            {
                              id: "數字",
                              value: {
                                path: [
                                  {
                                    id: "プレーヤー",
                                    value: {
                                      path: [
                                        { id: "カード", value: "改裝出場的卡" },
                                        "的「コントローラー」",
                                      ],
                                    },
                                  },
                                  "的「改装」的「合計国力」",
                                ],
                              },
                            },
                          ],
                        },
                        {
                          id: "ConditionCompareString",
                          value: [
                            {
                              id: "字串",
                              value: {
                                path: [
                                  { id: "カード", value: "改裝出場的卡" },
                                  "的「特徴」",
                                ],
                              },
                            },
                            "hasToken",
                            {
                              id: "字串",
                              value: [tokuTyou],
                            },
                          ],
                        },
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetFace",
                        cards: {
                          id: "カード",
                          value: "改裝出場的卡",
                        },
                        faceDown: {
                          id: "布林",
                          value: [false],
                        },
                      },
                      {
                        id: "ActionSetTarget",
                        source: "改裝出場的卡",
                        target: "改裝出場的卡",
                      },
                    ],
                  },
                ],
              },
            ],
            feedbackBlock: {
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionOKiKaeRu",
                      cardA: {
                        id: "カード",
                        value: "被改裝置換的卡",
                      },
                      cardB: {
                        id: "カード",
                        value: "改裝出場的卡",
                      },
                    },
                  ],
                },
              ],
            },
          }),
        ],
      };
    }
    case "共有": {
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
        texts: [
          {
            id: "自動型",
            category: "起動",
            description: "",
            block: {
              require: {
                id: "RequireTarget",
                targets: {},
                condition: {
                  id: "ConditionCompareCard",
                  value: [
                    { id: "カード", value: { path: [{ id: "このカード" }] } },
                    "==",
                    {
                      id: "カード",
                      value: {
                        path: [
                          {
                            id: "手動事件發生時",
                            value: {
                              path: [{ id: "觸發這個事件的手動事件" }],
                            },
                          },
                          "プレイされて場に出た場合のカード",
                        ],
                      },
                    },
                  ],
                },
                action: [
                  // 設置剛出場旗標
                ],
              },
            },
          },
          {
            id: "自動型",
            category: "起動",
            description: "",
            block: {
              require: {
                id: "RequireTarget",
                targets: {},
                // 回合開始時
                action: [
                  // 刪除剛出場旗標
                ],
              },
            },
          },
          getCardTextMacro({
            id: "PlayText",

            description: JSON.stringify(toku),
            timing: ["常時"],
            varCtxID: `createTokuSyuKouKaText_${_seqID++}`,
            additionalRequire: [
              createRollCostRequire(
                options.cost || 0,
                options.costColor || null
              ),
              // 剛出場旗標存在時
            ],
            feedbackBlock: {
              require: {
                id: "RequireTarget",
                targets: {
                  "「共有」出來的「カード」": {
                    id: "カード",
                    value: [],
                    valueLengthInclude: [1],
                  },
                },
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCompareBaSyou",
                      value: [
                        {
                          id: "場所",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "「共有」出來的「カード」",
                              },
                              "的「場所」",
                            ],
                          },
                        },
                        "==",
                        {
                          id: "場所",
                          value: [
                            {
                              id: "RelatedBaSyou",
                              value: ["自軍", "本国"],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareString",
                      value: [
                        {
                          id: "字串",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "「共有」出來的「カード」",
                              },
                              "的「特徴」",
                            ],
                          },
                        },
                        "hasToken",
                        {
                          id: "字串",
                          value: [toku[1]],
                        },
                      ],
                    },
                  ],
                },
              },
              feedback: [
                {
                  id: "FeedbackAction",
                  action: [
                    {
                      id: "ActionMoveCardToPosition",
                      cards: {
                        id: "カード",
                        value: "「共有」出來的「カード」",
                      },
                      baSyou: {
                        id: "場所",
                        value: [
                          {
                            id: "RelatedBaSyou",
                            value: ["自軍", "ハンガー"],
                          },
                        ],
                      },
                    },
                    // 本國洗牌
                  ],
                },
              ],
            },
          }),
        ],
      };
    }
    default: {
      return {
        id: "特殊型",
        description: toku,
        cardTextStateID: options.cardTextStateID,
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
