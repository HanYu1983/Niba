import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
} from "../../tool/basic/gameContext";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { CardText } from "../../tool/basic/basic";
import {
  recurRequire,
  Require,
  RequireTarget,
} from "../../tool/basic/blockPayload";
import { Condition } from "../../tool/basic/condition";
import { GameEventOnManualEventCustomID } from "../gameEventOnManualEventCustomID";

// 179025_07D_U_RD158C_red
// C
// F91
// ガンダムF91（ツインヴェスバータイプ）
// F91系　MS　専用｢シーブック・アノー｣
// クイック　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ガンダムF91（ツインヴェスバータイプ）",
  characteristic: "F91系　MS　専用｢シーブック・アノー｣".split("　"),
  category: "ユニット",
  color: "赤",
  rollCost: ["赤", "赤", null, null, null],
  battlePoint: [5, 2, 5],
};

const playCardRequire: RequireTarget = {
  id: "RequireTarget",
  targets: {
    "戦闘エリアにいる敵軍ユニット１～２枚": {
      id: "カード",
      value: [],
      valueLengthInclude: [1, 2],
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
                  value: "戦闘エリアにいる敵軍ユニット１～２枚",
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
                value: ["敵軍", "戦闘エリア（左）"],
              },
              {
                id: "RelatedBaSyou",
                value: ["敵軍", "戦闘エリア（右）"],
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
                  value: "戦闘エリアにいる敵軍ユニット１～２枚",
                },
                "的「種類」",
              ],
            },
          },
          "in",
          {
            id: "カードの種類",
            value: ["ユニット"],
          },
        ],
      },
    ],
  },
  action: [
    {
      id: "ActionSetTarget",
      source: "戦闘エリアにいる敵軍ユニット１～２枚",
      target: "戦闘エリアにいる敵軍ユニット１～２枚",
    },
  ],
};

const varCtxID1 =
  "179025_07D_U_RD158C_red_『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。";

let playCardPlus = createPlayCardText(prototype, {
  description:
    "『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
  varCtxID: varCtxID1,
  timing: ["ダメージ判定ステップ"],
  require: playCardRequire,
  feedbackBlock: {
    feedback: [
      {
        id: "FeedbackAction",
        action: [
          {
            id: "ActionSetFlag",
            flag: {
              id: "字串",
              value: ["合計国力－３してプレイ"],
            },
            cards: {
              id: "カード",
              value: { path: [{ id: "このカード" }] },
            },
          },
        ],
      },
    ],
  },
});
playCardPlus = {
  ...playCardPlus,
  block: {
    ...playCardPlus.block,
    ...(playCardPlus.block.require
      ? {
          require: recurRequire(playCardPlus.block.require, (r): Require => {
            if (r.id != "RequireTarget") {
              return r;
            }
            if (r.key != "靜態替換_將要「プレイ」的卡") {
              return r;
            }
            if (r.condition?.id != "ConditionAnd") {
              throw new Error("must be ConditionAnd");
            }
            const nextConditionAnd = r.condition.and.map((cond): Condition => {
              if (cond.id != "ConditionCompareNumber") {
                return cond;
              }
              return {
                id: "ConditionCompareNumber",
                value: [
                  {
                    id: "數字",
                    value: {
                      path: [
                        {
                          id: "數字",
                          value: {
                            path: [
                              { id: "カード", value: "將要「プレイ」的卡" },
                              "的「合計国力」",
                            ],
                          },
                        },
                        "-",
                        {
                          id: "數字",
                          value: [3],
                        },
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
              };
            });
            return {
              ...r,
              condition: {
                ...r.condition,
                and: nextConditionAnd,
              },
            };
          }),
        }
      : null),
  },
};

const texts: CardText[] = [
  createTokuSyuKouKaText(["クイック"], {}),
  createTokuSyuKouKaText(["改装", "F91系"], { cost: 1 }),
  createPlayCardText(prototype, { isG: true }),
  createPlayCardText(prototype, {
    require: playCardRequire,
    varCtxID: varCtxID1,
  }),
  {
    id: "恒常",
    description:
      "『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
    texts: [
      // このカードは、合計国力－３してプレイできる
      playCardPlus,
      // その場合、カット終了時に、このカードを廃棄する。
      {
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
                                    { filter: "合計国力－３してプレイ" },
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
                    { error: "必須有flag:合計国力－３してプレイ" },
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
                              value: ["合計国力－３してプレイ"],
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
      {
        id: "自動型",
        category: "起動",
        description:
          "『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。",
        block: {
          contextID: varCtxID1,
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
                        action: [
                          {
                            id: "ActionRoll",
                            cards: {
                              id: "カード",
                              value: "戦闘エリアにいる敵軍ユニット１～２枚",
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
  },
];

module.exports = {
  ...prototype,
  texts: texts,
};
