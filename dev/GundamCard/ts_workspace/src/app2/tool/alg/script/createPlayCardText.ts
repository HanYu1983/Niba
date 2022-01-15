import { Action } from "../../tool/basic/action";
import {
  CardCategory,
  CardColor,
  CardText,
  SiYouTiming,
} from "../../tool/basic/basic";
import {
  BlockPayload,
  createRollCostRequire,
  RequireCustom,
} from "../../tool/basic/blockPayload";
import { CardPrototype } from "../../tool/basic/gameContext";
import { RequireCustomID } from "../../tool/basic/requireCustom";

let idSeq = 0;
export function createPlayCardText(
  prototype: CardPrototype,
  options: {
    isG?: boolean;
    command?: {
      description: string;
      timing: SiYouTiming;
      block: BlockPayload;
    };
  }
): CardText {
  if (options.isG) {
    return {
      id: "使用型",
      timing: ["自軍", "配備フェイズ"],
      description: `プレイ ${prototype.category}[${prototype.title}]當G`,
      block: {
        contextID: `createPlayCardText ${idSeq++}`,
        require: {
          id: "RequireAnd",
          and: [
            {
              id: "RequireTarget",
              targets: {
                "將要「プレイ」的卡": {
                  id: "カード",
                  value: {
                    path: [
                      {
                        id: "このカード",
                      },
                    ],
                  },
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
                          value: "將要「プレイ」的卡",
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
              action: [
                {
                  id: "ActionSetFace",
                  cards: {
                    id: "カード",
                    value: "將要「プレイ」的卡",
                  },
                  faceDown: {
                    id: "布林",
                    value: [false],
                  },
                },
                {
                  id: "ActionMoveCardToPosition",
                  cards: {
                    id: "カード",
                    value: "將要「プレイ」的卡",
                  },
                  baSyou: {
                    id: "場所",
                    value: [
                      {
                        id: "RelatedBaSyou",
                        value: ["自軍", "プレイされているカード"],
                      },
                    ],
                  },
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
                          id: "ActionMoveCardToPosition",
                          cards: {
                            id: "カード",
                            value: "將要「プレイ」的卡",
                          },
                          baSyou: {
                            id: "場所",
                            value: [
                              {
                                id: "RelatedBaSyou",
                                value: ["自軍", "Gゾーン"],
                              },
                            ],
                          },
                        },
                        {
                          id: "ActionRoll",
                          cards: {
                            id: "カード",
                            value: "將要「プレイ」的卡",
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
    };
  }

  // 合計國力另外計算
  const formatRollCost = (() => {
    const [ret] = prototype.rollCost.reduce(
      (
        [result, source],
        color
      ): [[CardColor, number][], (CardColor | null)[]] => {
        const number = source.filter((c) => c == color).length;
        return [
          color == null ? result : [...result, [color, number]],
          source.filter((c) => c != color),
        ];
      },
      [[], prototype.rollCost] as [[CardColor, number][], (CardColor | null)[]]
    );
    return ret;
  })();
  switch (prototype.category) {
    default:
    case "コマンド": {
      if (options.command == null) {
        throw new Error("你要建立指令內文，但沒有command");
      }
      return {
        id: "使用型",
        timing: options.command.timing,
        description: options.command.description,
        block: {
          contextID: `createPlayCardText ${idSeq++}`,
          require: {
            id: "RequireAnd",
            and: [
              ...formatRollCost.map(([color, num]) => {
                return createRollCostRequire(num, color);
              }),
              {
                id: "RequireTarget",
                targets: {
                  "將要「プレイ」的卡": {
                    id: "カード",
                    value: {
                      path: [
                        {
                          id: "このカード",
                        },
                      ],
                    },
                  },
                },
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCompareNumber",
                      value: [
                        {
                          id: "數字",
                          value: {
                            path: [
                              { id: "カード", value: "將要「プレイ」的卡" },
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
                                    {
                                      id: "カード",
                                      value: "將要「プレイ」的卡",
                                    },
                                    "的「コントローラー」",
                                  ],
                                },
                              },
                              "的「合計国力」",
                            ],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareBaSyou",
                      value: [
                        {
                          id: "場所",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "將要「プレイ」的卡",
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
                  ],
                },
                action: [
                  {
                    id: "ActionSetFace",
                    cards: {
                      id: "カード",
                      value: "將要「プレイ」的卡",
                    },
                    faceDown: {
                      id: "布林",
                      value: [false],
                    },
                  },
                  {
                    id: "ActionMoveCardToPosition",
                    cards: {
                      id: "カード",
                      value: "將要「プレイ」的卡",
                    },
                    baSyou: {
                      id: "場所",
                      value: [
                        {
                          id: "RelatedBaSyou",
                          value: ["自軍", "プレイされているカード"],
                        },
                      ],
                    },
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
                    ...options.command.block,
                    feedback: [
                      ...(options.command.block.feedback || []),
                      {
                        id: "FeedbackAction",
                        action: [
                          {
                            id: "ActionMoveCardToPosition",
                            cards: {
                              id: "カード",
                              value: "將要「プレイ」的卡",
                            },
                            baSyou: {
                              id: "場所",
                              value: [
                                {
                                  id: "RelatedBaSyou",
                                  value: ["自軍", "ジャンクヤード"],
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
            },
          ],
        },
      };
    }
    case "グラフィック":
      return {
        id: "使用型",
        timing: ["自軍", "配備フェイズ"],
        description: `プレイ ${prototype.category}[${prototype.title}]`,
        block: {
          contextID: `createPlayCardText ${idSeq++}`,
          require: {
            id: "RequireAnd",
            and: [
              {
                id: "RequireTarget",
                targets: {
                  "將要「プレイ」的卡": {
                    id: "カード",
                    value: {
                      path: [
                        {
                          id: "このカード",
                        },
                      ],
                    },
                  },
                },
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCompareNumber",
                      value: [
                        {
                          id: "數字",
                          value: {
                            path: [
                              { id: "カード", value: "將要「プレイ」的卡" },
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
                                    {
                                      id: "カード",
                                      value: "將要「プレイ」的卡",
                                    },
                                    "的「コントローラー」",
                                  ],
                                },
                              },
                              "的「合計国力」",
                            ],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareBaSyou",
                      value: [
                        {
                          id: "場所",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "將要「プレイ」的卡",
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
                  ],
                },
                action: [
                  {
                    id: "ActionSetFace",
                    cards: {
                      id: "カード",
                      value: "將要「プレイ」的卡",
                    },
                    faceDown: {
                      id: "布林",
                      value: [false],
                    },
                  },
                  {
                    id: "ActionMoveCardToPosition",
                    cards: {
                      id: "カード",
                      value: "將要「プレイ」的卡",
                    },
                    baSyou: {
                      id: "場所",
                      value: [
                        {
                          id: "RelatedBaSyou",
                          value: ["自軍", "プレイされているカード"],
                        },
                      ],
                    },
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
                            id: "ActionMoveCardToPosition",
                            cards: {
                              id: "カード",
                              value: "將要「プレイ」的卡",
                            },
                            baSyou: {
                              id: "場所",
                              value: [
                                {
                                  id: "RelatedBaSyou",
                                  value: ["自軍", "Gゾーン"],
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
            },
          ],
        },
      };
    case "キャラクター":
    case "ユニット": {
      return {
        id: "使用型",
        timing: ["常時"],
        description: `プレイ ${prototype.category}[${prototype.title}]`,
        block: {
          contextID: `createPlayCardText ${idSeq++}`,
          require: {
            id: "RequireAnd",
            and: [
              ...formatRollCost.map(([color, num]) => {
                return createRollCostRequire(num, color);
              }),
              {
                id: "RequireCustom",
                customID: {
                  id: "有快速就常時，不然就是自軍配置",
                } as RequireCustomID,
              },
              {
                id: "RequireTarget",
                targets: {
                  "將要「プレイ」的卡": {
                    id: "カード",
                    value: {
                      path: [
                        {
                          id: "このカード",
                        },
                      ],
                    },
                  },
                },
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCompareNumber",
                      value: [
                        {
                          id: "數字",
                          value: {
                            path: [
                              { id: "カード", value: "將要「プレイ」的卡" },
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
                                    {
                                      id: "カード",
                                      value: "將要「プレイ」的卡",
                                    },
                                    "的「コントローラー」",
                                  ],
                                },
                              },
                              "的「合計国力」",
                            ],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCompareBaSyou",
                      value: [
                        {
                          id: "場所",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "將要「プレイ」的卡",
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
                  ],
                },
                action: [
                  {
                    id: "ActionSetFace",
                    cards: {
                      id: "カード",
                      value: "將要「プレイ」的卡",
                    },
                    faceDown: {
                      id: "布林",
                      value: [false],
                    },
                  },
                  {
                    id: "ActionMoveCardToPosition",
                    cards: {
                      id: "カード",
                      value: "將要「プレイ」的卡",
                    },
                    baSyou: {
                      id: "場所",
                      value: [
                        {
                          id: "RelatedBaSyou",
                          value: ["自軍", "プレイされているカード"],
                        },
                      ],
                    },
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
                            id: "ActionMoveCardToPosition",
                            cards: {
                              id: "カード",
                              value: "將要「プレイ」的卡",
                            },
                            baSyou: {
                              id: "場所",
                              value: [
                                {
                                  id: "RelatedBaSyou",
                                  value: ["自軍", "配備エリア"],
                                },
                              ],
                            },
                          },
                          {
                            id: "ActionRoll",
                            cards: {
                              id: "カード",
                              value: "將要「プレイ」的卡",
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
      };
    }
  }
}
