import { Action, ActionDeleteFlag } from "../../tool/basic/action";
import {
  CardColor,
  CardText,
  CardTextSiYouKaTa,
  CardTextZiDouKaTa,
} from "../../tool/basic/basic";
import {
  createRollCostRequire,
  RequireTarget,
  Require,
} from "../../tool/basic/blockPayload";
import { Condition } from "../../tool/basic/condition";
import { CARD_TEXT_DESTROY_WHEN_CUT_FINISHED } from "./cardTextMacroForF91";
import {
  ACTION_CARD_TO_BASYOU,
  CARD_TEXT_PLAY_G,
  CARD_TEXT_PLAY_UNIT,
  CONDITION_PLAY_UNIT_FROM_BASYOU,
  CONDITION_TOTAL_COST,
  formatRollCost,
  REQUIRE_PLAY,
} from "./createPlayCardText";

export type CardTextMacro1 = {
  id: "PlayG";
  cardText: CardTextSiYouKaTa;
};

export type CardTextMacro2 = {
  id: "PlayUnit";
  varCtxID?: string;
  rollCostRequire?: Require[];
  totalCostConditionReplace?: Condition[];
  additionalRequire?: Require[];
  additionalFeedbackAction?: Action[];
  cardText: CardTextSiYouKaTa;
};

export type CardTextMacro3 = {
  id: "WhenCutFinished";
  varCtxID?: string;
  additionalFeedbackAction?: Action[];
  hasFlag?: string;
  cardText: CardTextZiDouKaTa;
};

export type CardTextMacro4 = {
  id: "WhenShowBa";
  varCtxID?: string;
  additionalFeedbackAction?: Action[];
  cardText: CardTextZiDouKaTa;
};

export type CardTextMacro =
  | CardTextMacro1
  | CardTextMacro2
  | CardTextMacro3
  | CardTextMacro4;

export function getCardTextMacro(macro: CardTextMacro): CardTextMacro {
  switch (macro.id) {
    case "PlayG":
      macro.cardText = CARD_TEXT_PLAY_G;
      return macro;
    case "PlayUnit":
      macro.cardText = {
        ...CARD_TEXT_PLAY_UNIT,
        block: {
          ...CARD_TEXT_PLAY_UNIT.block,
          contextID: macro.varCtxID,
          require: {
            id: "RequireAnd",
            and: [
              ...(macro.rollCostRequire || []),
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
              ...(macro.additionalRequire || []),
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
                          ACTION_CARD_TO_BASYOU,
                          ...(macro.additionalFeedbackAction || []),
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
      return macro;
    case "WhenCutFinished":
      macro.cardText = {
        id: "自動型",
        category: "起動",
        description: "その場合、カット終了時に、このカードを廃棄する。",
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
      };
      return macro;
    case "WhenShowBa":
      macro.cardText = {
        id: "自動型",
        category: "起動",
        description: "『起動』：このカードが場に出た場合",
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
      };
      return macro;
  }
}
