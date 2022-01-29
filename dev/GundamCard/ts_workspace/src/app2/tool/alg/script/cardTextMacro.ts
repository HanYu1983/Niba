import { Block } from "typescript";
import {
  Action,
  ActionDeleteFlag,
  ActionMoveCardToPosition,
} from "../../tool/basic/action";
import {
  BaSyou,
  BaSyouKeyword,
  CardColor,
  CardRole,
  CardText,
  CardTextSiYouKaTa,
  CardTextZiDouKaTa,
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  GameEvent,
  PlayerA,
  PlayerB,
  RelatedBaSyou,
  RelatedPlayerSideKeyword,
  SiYouTiming,
} from "../../tool/basic/basic";
import {
  createRollCostRequire,
  RequireTarget,
  Require,
  BlockPayload,
  FeedbackAction,
} from "../../tool/basic/blockPayload";
import { Condition } from "../../tool/basic/condition";
import { TargetTypeCard } from "../../tool/basic/targetType";

type CardTextMacro1 = {
  id: "PlayG";
  description?: string;
};

type CardTextMacro2 = {
  id:
    | "PlayUnit"
    | "PlayCommand"
    | "PlayCharacter"
    | "PlayCharacter(Stay)"
    | "PlayOperation"
    | "PlayOperation(Unit)"
    | "PlayText";
  description?: string;
  varCtxID?: string;
  rollCostRequire?: Require[];
  totalCostConditionReplace?: Condition[];
  additionalRequire?: Require[];
  feedbackBlock?: BlockPayload;
  timing?: SiYouTiming;
};

type CardTextMacro3 = {
  id: "WhenCutFinished";
  description?: string;
  varCtxID?: string;
  additionalFeedbackAction?: Action[];
  hasFlag?: string;
};

type CardTextMacro4 = {
  id: "WhenShowBa";
  description?: string;
  varCtxID?: string;
  additionalFeedbackAction?: Action[];
};

type CardTextMacro5 = {
  id: "變量x的角色包含於y";
  x: TargetTypeCard;
  y: CardRole[];
};

type CardTextMacro6 = {
  id: "變量x的是y軍";
  x: TargetTypeCard;
  y: RelatedPlayerSideKeyword;
};

type CardTextMacro7 = {
  id: "變量x的場所包含於y";
  x: TargetTypeCard;
  y: BaSyou[];
};

type CardTextMacro8 = {
  id: "當觸發GameEvent的變量x的id時";
  x: GameEvent;
};

type CardTextMacro9 = {
  id: "這張卡在場時";
};

export type CardTextMacro =
  | CardTextMacro1
  | CardTextMacro2
  | CardTextMacro3
  | CardTextMacro4
  | CardTextMacro5
  | CardTextMacro6
  | CardTextMacro7
  | CardTextMacro8
  | CardTextMacro9;

export type Return = {
  condition: Condition;
  cardText: CardTextZiDouKaTa | CardTextSiYouKaTa;
};

const DEFAULT_RETURN: Return = {
  condition: { id: "ConditionAnd", and: [] },
  cardText: DEFAULT_CARD_TEXT_SIYOU_KATA,
};

export const VAR_PLAY_CARD = "將要「プレイ」的卡";

export function getCardTextMacro(macro: CardTextMacro): Return {
  switch (macro.id) {
    case "這張卡在場時":
      return getCardTextMacro({
        id: "變量x的場所包含於y",
        x: { id: "カード", value: { path: [{ id: "このカード" }] } },
        y: [
          { id: "RelatedBaSyou", value: ["自軍", "配備エリア"] },
          { id: "RelatedBaSyou", value: ["自軍", "戦闘エリア（左）"] },
          { id: "RelatedBaSyou", value: ["自軍", "戦闘エリア（右）"] },
        ],
      });
    case "當觸發GameEvent的變量x的id時":
      return {
        ...DEFAULT_RETURN,
        condition: {
          id: "ConditionJsonfp",
          program: {
            pass1: {
              if: [
                {
                  "->": [
                    "$in.blockPayload",
                    { log: "blockPayload" },
                    { getter: "cause" },
                    { getter: "id" },
                    { "==": "BlockPayloadCauseGameEvent" },
                  ],
                },
                {},
                { error: "事件必須是BlockPayloadCauseGameEvent" },
              ],
            },
            pass2: {
              if: [
                {
                  "->": [
                    "$in.blockPayload",
                    { log: "blockPayload" },
                    { getter: "cause" },
                    { getter: "gameEvent" },
                    { getter: "id" },
                    { "==": macro.x.id },
                  ],
                },
                {},
                { error: `事件必須是プレイした場合:${macro.x.id}` },
              ],
            },
          },
        },
      };
    case "變量x的場所包含於y":
      return {
        ...DEFAULT_RETURN,
        condition: {
          id: "ConditionCompareBaSyou",
          value: [
            {
              id: "場所",
              value: {
                path: [macro.x, "的「場所」"],
              },
            },
            "in",
            {
              id: "場所",
              value: macro.y,
            },
          ],
        },
      };
    case "變量x的是y軍":
      return {
        ...DEFAULT_RETURN,
        condition: {
          id: "ConditionComparePlayer",
          value: [
            {
              id: "プレーヤー",
              value: {
                path: [macro.x, "的「コントローラー」"],
              },
            },
            "==",
            {
              id: "プレーヤー",
              value: {
                path: [{ id: "自軍" }],
              },
            },
          ],
        },
      };
    case "變量x的角色包含於y":
      return {
        ...DEFAULT_RETURN,
        condition: {
          id: "ConditionCompareRole",
          value: [
            {
              id: "「カード」的角色",
              value: {
                path: [macro.x, "的角色"],
              },
            },
            "in",
            {
              id: "「カード」的角色",
              value: macro.y,
            },
          ],
        },
      };
    case "PlayG":
      return {
        ...DEFAULT_RETURN,
        cardText: {
          ...CARD_TEXT_PLAY_G,
          description: macro.description || "PlayG",
        },
      };
    case "PlayCharacter":
    case "PlayOperation(Unit)":
      return {
        ...DEFAULT_RETURN,
        cardText: {
          ...CARD_TEXT_PLAY,
          description: macro.description || macro.id,
          timing: macro.timing || CARD_TEXT_PLAY.timing,
          block: {
            ...CARD_TEXT_PLAY.block,
            contextID: macro.varCtxID,
            require: {
              id: "RequireAnd",
              and: [
                {
                  ...REQUIRE_PLAY,
                  condition: {
                    ...REQUIRE_PLAY.condition,
                    and: [
                      ...(macro.totalCostConditionReplace
                        ? macro.totalCostConditionReplace
                        : [CONDITION_TOTAL_COST]),
                      CONDITION_PLAY_UNIT_FROM_BASYOU,
                    ],
                  },
                } as RequireTarget,
                {
                  id: "RequireTarget",
                  targets: {
                    目標機體: {
                      id: "カード",
                      value: [],
                      valueLengthInclude: [1],
                    },
                  },
                  condition: {
                    id: "ConditionAnd",
                    and: [
                      // 角色只能配置在自軍
                      ...(macro.id == "PlayCharacter"
                        ? [
                            getCardTextMacro({
                              id: "變量x的是y軍",
                              x: { id: "カード", value: "目標機體" },
                              y: "自軍",
                            }).condition,
                          ]
                        : []),
                      // Operation(Unit)可以配置在敵軍
                      ...(macro.id == "PlayOperation(Unit)"
                        ? [
                            {
                              id: "ConditionComparePlayer",
                              value: [
                                {
                                  id: "プレーヤー",
                                  value: {
                                    path: [
                                      { id: "カード", value: "目標機體" },
                                      "的「コントローラー」",
                                    ],
                                  },
                                },
                                "in",
                                {
                                  id: "プレーヤー",
                                  value: [PlayerA, PlayerB],
                                },
                              ],
                            } as Condition,
                          ]
                        : []),
                      getCardTextMacro({
                        id: "變量x的角色包含於y",
                        x: { id: "カード", value: "目標機體" },
                        y: ["ユニット"],
                      }).condition,
                      getCardTextMacro({
                        id: "變量x的場所包含於y",
                        x: { id: "カード", value: "目標機體" },
                        y: [
                          // 角色只能配置在自軍
                          {
                            id: "RelatedBaSyou",
                            value: ["自軍", "配備エリア"],
                          },
                          // Operation(Unit)可以配置在敵軍
                          ...(macro.id == "PlayOperation(Unit)"
                            ? [
                                {
                                  id: "RelatedBaSyou",
                                  value: ["敵軍", "配備エリア"],
                                } as RelatedBaSyou,
                              ]
                            : []),
                        ],
                      }).condition,
                    ],
                  },
                  action: [
                    {
                      id: "ActionSetTarget",
                      source: "目標機體",
                      target: "目標機體",
                    },
                  ],
                },
                ...(macro.additionalRequire || []),
              ],
            },
            feedback: [
              {
                id: "FeedbackAction",
                action: [
                  ActionTriggerPlayCard,
                  {
                    id: "ActionAddBlock",
                    type: "堆疊",
                    block: {
                      ...macro.feedbackBlock,
                      contextID: macro.varCtxID,
                      feedback: [
                        ...(macro.feedbackBlock?.feedback || []),
                        {
                          id: "FeedbackAction",
                          action: [
                            {
                              id: "ActionSetSetCard",
                              cards: {
                                id: "カード",
                                value: VAR_PLAY_CARD,
                              },
                              distCard: {
                                id: "カード",
                                value: "目標機體",
                              },
                            },
                          ],
                        } as FeedbackAction,
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      };
    case "PlayUnit":
    case "PlayCommand":
    case "PlayCharacter(Stay)":
    case "PlayOperation":
    case "PlayText":
      return {
        ...DEFAULT_RETURN,
        cardText: {
          ...CARD_TEXT_PLAY,
          description: macro.description || macro.id,
          timing: macro.timing || CARD_TEXT_PLAY.timing,
          block: {
            ...CARD_TEXT_PLAY.block,
            contextID: macro.varCtxID,
            require: {
              id: "RequireAnd",
              and: [
                ...(macro.id != "PlayText"
                  ? [
                      {
                        ...REQUIRE_PLAY,
                        condition: {
                          ...REQUIRE_PLAY.condition,
                          and: [
                            ...(macro.totalCostConditionReplace
                              ? macro.totalCostConditionReplace
                              : [CONDITION_TOTAL_COST]),
                            CONDITION_PLAY_UNIT_FROM_BASYOU,
                          ],
                        },
                      } as RequireTarget,
                    ]
                  : []),
                ...(macro.additionalRequire || []),
              ],
            },
            feedback: [
              {
                id: "FeedbackAction",
                action: [
                  ActionTriggerPlayCard,
                  {
                    id: "ActionAddBlock",
                    type: "堆疊",
                    block: {
                      ...macro.feedbackBlock,
                      contextID: macro.varCtxID,
                      feedback: [
                        ...(macro.feedbackBlock?.feedback || []),
                        ...(macro.id != "PlayText"
                          ? [
                              {
                                id: "FeedbackAction",
                                action: [
                                  {
                                    id: "ActionMoveCardToPosition",
                                    cards: {
                                      id: "カード",
                                      value: VAR_PLAY_CARD,
                                    },
                                    baSyou: {
                                      id: "場所",
                                      value: [
                                        ...(macro.id == "PlayUnit"
                                          ? [
                                              {
                                                id: "RelatedBaSyou",
                                                value: ["自軍", "配備エリア"],
                                              } as RelatedBaSyou,
                                            ]
                                          : []),
                                        ...(macro.id == "PlayCharacter(Stay)"
                                          ? [
                                              {
                                                id: "RelatedBaSyou",
                                                value: ["自軍", "配備エリア"],
                                              } as RelatedBaSyou,
                                            ]
                                          : []),
                                        ...(macro.id == "PlayOperation"
                                          ? [
                                              {
                                                id: "RelatedBaSyou",
                                                value: ["自軍", "配備エリア"],
                                              } as RelatedBaSyou,
                                            ]
                                          : []),
                                        ...(macro.id == "PlayCommand"
                                          ? [
                                              {
                                                id: "RelatedBaSyou",
                                                value: [
                                                  "自軍",
                                                  "ジャンクヤード",
                                                ],
                                              } as RelatedBaSyou,
                                            ]
                                          : []),
                                      ],
                                    },
                                  },
                                ],
                              } as FeedbackAction,
                            ]
                          : []),
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      };
    case "WhenCutFinished":
      return {
        ...DEFAULT_RETURN,
        cardText: {
          id: "自動型",
          category: "起動",
          description: macro.description || "WhenCutFinished",
          block: {
            contextID: macro.varCtxID,
            require: {
              id: "RequireTarget",
              targets: {},
              condition: {
                id: "ConditionJsonfp",
                program: {
                  pass1: {
                    if: [
                      {
                        "->": [
                          "$in.blockPayload",
                          { log: "blockPayload" },
                          { getter: "cause" },
                          { getter: "id" },
                          { "==": "BlockPayloadCauseGameEvent" },
                        ],
                      },
                      {},
                      { error: "事件必須是BlockPayloadCauseGameEvent" },
                    ],
                  },
                  pass2: {
                    if: [
                      {
                        "->": [
                          "$in.blockPayload",
                          { log: "blockPayload" },
                          { getter: "cause" },
                          { getter: "gameEvent" },
                          { getter: "id" },
                          { "==": "カット終了時" },
                        ],
                      },
                      {},
                      { error: "事件必須是カット終了時" },
                    ],
                  },
                  $cardTextID: {
                    "->": [
                      "$in.blockPayload",
                      { log: "thisEffect" },
                      { getter: "cause" },
                      { getter: "cardTextID" },
                      { log: "cardTextID" },
                    ],
                  },
                  pass3: {
                    if: [
                      {
                        "->": [
                          {
                            "->": [
                              "$in.blockPayload",
                              { log: "blockPayload" },
                              { getter: "cause" },
                              { getter: "gameEvent" },
                              { getter: "effects" },
                            ],
                          },
                          // .運算子只支援2層
                          { map: "$in.cause.cardTextID" },
                          {
                            filter: {
                              "==": "$cardTextID",
                            },
                          },
                          { size: null },
                          { ">": 0 },
                        ],
                      },
                      {},
                      { error: "效果必須包含在堆疊記憶內" },
                    ],
                  },
                  $cardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "cardID" },
                    ],
                  },
                  ...(macro.hasFlag
                    ? {
                        pass4: {
                          if: [
                            {
                              "->": [
                                {
                                  "->": [
                                    "$in.ctx",
                                    { getter: "gameState" },
                                    { getter: "cardState" },
                                  ],
                                },
                                {
                                  filter: {
                                    "->": [
                                      [
                                        {
                                          "->": ["$in.id", { "==": "$cardID" }],
                                        },
                                        {
                                          "->": [
                                            "$in.flags",
                                            {
                                              filter: macro.hasFlag,
                                            },
                                            { size: null },
                                            { ">": 0 },
                                          ],
                                        },
                                      ],
                                      { reduce: "and" },
                                    ],
                                  },
                                },
                                { size: null },
                                { ">": 0 },
                              ],
                            },
                            {},
                            {
                              error: `必須有flag:${macro.hasFlag}`,
                            },
                          ],
                        },
                      }
                    : null),
                },
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
                      feedback: [
                        {
                          id: "FeedbackAction",
                          action: [
                            ...(macro.additionalFeedbackAction || []),
                            ...(macro.hasFlag
                              ? [
                                  {
                                    id: "ActionDeleteFlag",
                                    cards: {
                                      id: "カード",
                                      value: { path: [{ id: "このカード" }] },
                                    },
                                    flag: {
                                      id: "字串",
                                      value: [macro.hasFlag],
                                    },
                                  } as ActionDeleteFlag,
                                ]
                              : []),
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
      };
    case "WhenShowBa":
      return {
        ...DEFAULT_RETURN,
        cardText: {
          id: "自動型",
          category: "起動",
          description: macro.description || "WhenShowBa",
          block: {
            contextID: macro.varCtxID,
            require: {
              id: "RequireTarget",
              targets: {},
              condition: {
                id: "ConditionJsonfp",
                program: {
                  pass1: {
                    if: [
                      {
                        "->": [
                          "$in.blockPayload",
                          { log: "blockPayload" },
                          { getter: "cause" },
                          { getter: "id" },
                          { "==": "BlockPayloadCauseGameEvent" },
                        ],
                      },
                      {},
                      { error: "事件必須是BlockPayloadCauseGameEvent" },
                    ],
                  },
                  pass2: {
                    if: [
                      {
                        "->": [
                          "$in.blockPayload",
                          { log: "blockPayload" },
                          { getter: "cause" },
                          { getter: "gameEvent" },
                          { getter: "id" },
                          { "==": "場に出た場合" },
                        ],
                      },
                      {},
                      { error: "事件必須是場に出た場合" },
                    ],
                  },
                  $cardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "cardID" },
                    ],
                  },
                  pass3: {
                    if: [
                      {
                        "->": [
                          "$in.blockPayload",
                          { log: "blockPayload" },
                          { getter: "cause" },
                          { getter: "gameEvent" },
                          { getter: "cardID" },
                          { "==": "$cardID" },
                        ],
                      },
                      {},
                      { error: "必須是這張卡" },
                    ],
                  },
                },
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
                      feedback: [
                        {
                          id: "FeedbackAction",
                          action: [...(macro.additionalFeedbackAction || [])],
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      };
  }
}

export function formatRollCost(rollCost: (CardColor | null)[]) {
  const [ret] = rollCost.reduce(
    (
      [result, source],
      color
    ): [[CardColor, number][], (CardColor | null)[]] => {
      const number = source.filter((c) => c == color).length;
      return [
        color == null || number == 0 ? result : [...result, [color, number]],
        source.filter((c) => c != color),
      ];
    },
    [[], rollCost] as [[CardColor, number][], (CardColor | null)[]]
  );
  return ret;
}

const CONDITION_TOTAL_COST: Condition = {
  id: "ConditionCompareNumber",
  value: [
    {
      id: "數字",
      value: {
        path: [{ id: "カード", value: VAR_PLAY_CARD }, "的「合計国力」"],
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
                  value: VAR_PLAY_CARD,
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
};
const CONDITION_PLAY_UNIT_FROM_BASYOU: Condition = {
  id: "ConditionCompareBaSyou",
  value: [
    {
      id: "場所",
      value: {
        path: [
          {
            id: "カード",
            value: VAR_PLAY_CARD,
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
};

const REQUIRE_PLAY: RequireTarget = {
  id: "RequireTarget",
  targets: {
    [VAR_PLAY_CARD]: {
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
    and: [CONDITION_PLAY_UNIT_FROM_BASYOU],
  },
  action: [
    {
      id: "ActionSetFace",
      cards: {
        id: "カード",
        value: VAR_PLAY_CARD,
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
        value: VAR_PLAY_CARD,
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
    {
      id: "ActionSetTarget",
      source: VAR_PLAY_CARD,
      target: VAR_PLAY_CARD,
    },
  ],
};

const ACTION_CARD_TO_BASYOU: ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition",
  cards: {
    id: "カード",
    value: VAR_PLAY_CARD,
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
};

const CARD_TEXT_PLAY: CardTextSiYouKaTa = {
  id: "使用型",
  timing: ["自軍", "配備フェイズ"],
  description: `プレイ`,
  block: {
    contextID: "CARD_TEXT_PLAY",
    require: {
      id: "RequireAnd",
      and: [REQUIRE_PLAY],
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
                  action: [],
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

const CARD_TEXT_PLAY_G: CardTextSiYouKaTa = {
  ...CARD_TEXT_PLAY,
  description: `プレイG`,
  block: {
    ...CARD_TEXT_PLAY.block,
    contextID: "CARD_TEXT_PLAY_G",
    require: {
      id: "RequireAnd",
      and: [REQUIRE_PLAY],
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
                        value: VAR_PLAY_CARD,
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
                        value: VAR_PLAY_CARD,
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

export const CARD_TEXT_PLAY_UNIT: CardTextSiYouKaTa = {
  ...CARD_TEXT_PLAY,
  description: `プレイUNIT`,
  block: {
    ...CARD_TEXT_PLAY.block,
    contextID: "CARD_TEXT_PLAY_UNIT",
    require: {
      id: "RequireAnd",
      and: [REQUIRE_PLAY],
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
                  action: [ACTION_CARD_TO_BASYOU],
                },
              ],
            },
          },
        ],
      },
    ],
  },
};

const ActionTriggerPlayCard: Action = {
  id: "ActionJsonfp",
  program: {
    pass1: {
      if: [
        {
          "->": [
            "$in.blockPayload",
            { getter: "cause" },
            { getter: "id" },
            { "==": "BlockPayloadCauseUpdateCommand" },
          ],
        },
        {},
        { error: "事件必須是BlockPayloadCauseUpdateCommand" },
      ],
    },
    output: {
      id: "ActionTriggerGameEvent",
      gameEvent: {
        id: "プレイした場合",
        cardID: {
          "->": ["$in.blockPayload", { getter: "cause" }, { getter: "cardID" }],
        },
        cardTextID: {
          "->": [
            "$in.blockPayload",
            { getter: "cause" },
            { getter: "cardTextID" },
          ],
        },
      },
    },
  },
};
