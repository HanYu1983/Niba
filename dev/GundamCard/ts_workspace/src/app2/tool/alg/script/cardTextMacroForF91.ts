import { CardTextZiDouKaTa } from "../../tool/basic/basic";

export const CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY =
  "合計国力－３してプレイ";

// その場合、カット終了時に、このカードを廃棄する。
export const CARD_TEXT_DESTROY_WHEN_CUT_FINISHED: CardTextZiDouKaTa = {
  id: "自動型",
  category: "起動",
  description: "その場合、カット終了時に、このカードを廃棄する。",
  block: {
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
                                filter:
                                  CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY,
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
                error: `必須有flag:${CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY}`,
              },
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
                  action: [
                    {
                      id: "ActionDestroy",
                      cards: {
                        id: "カード",
                        value: { path: [{ id: "このカード" }] },
                      },
                    },
                    {
                      id: "ActionDeleteFlag",
                      cards: {
                        id: "カード",
                        value: { path: [{ id: "このカード" }] },
                      },
                      flag: {
                        id: "字串",
                        value: [
                          CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY,
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

export const CARD_TEXT_WHEN_SHOW_BA: CardTextZiDouKaTa = {
  id: "自動型",
  category: "起動",
  description: "『起動』：このカードが場に出た場合",
  block: {
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
  },
};
