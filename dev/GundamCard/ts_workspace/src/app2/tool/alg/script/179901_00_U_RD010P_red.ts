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

// 179901_00_U_RD010P_red
// P
// F91
// ガンダムF91（ビームランチャー）
// F91系　MS　レジェンド　専用｢シーブック・アノー｣
// クイック　高機動　〔１〕：改装［F91系］
//『恒常』：このカードは、戦闘フェイズ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
//『起動』このカードが場に出た場合、敵軍は、自分のユニット１枚を選んで持ち主の手札に移す。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ガンダムF91（ビームランチャー）",
  characteristic: "F91系　MS　レジェンド　専用｢シーブック・アノー｣".split("　"),
  category: "ユニット",
  color: "赤",
  rollCost: ["赤", "赤", "赤", null, null],
  battlePoint: [6, 2, 6],
};

const playCardRequire: RequireTarget = {
  id: "RequireTarget",
  targets: {
    "敵軍は、自分のユニット１枚": {
      id: "カード",
      value: [],
      valueLengthInclude: [1],
      responsePlayer: "敵軍",
    },
  },
  condition: {
    id: "ConditionAnd",
    and: [
      {
        id: "ConditionCompareRole",
        value: [
          {
            id: "「カード」的角色",
            value: {
              path: [
                {
                  id: "カード",
                  value: "敵軍は、自分のユニット１枚",
                },
                "的角色",
              ],
            },
          },
          "in",
          {
            id: "「カード」的角色",
            value: ["ユニット"],
          },
        ],
      },
    ],
  },
  action: [
    {
      id: "ActionSetTarget",
      source: "敵軍は、自分のユニット１枚",
      target: "敵軍は、自分のユニット１枚",
    },
  ],
};

const varCtxID1 =
  "179901_00_U_RD010P_red_『恒常』：このカードは、戦闘フェイズ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。";

let playCardPlus = createPlayCardText(prototype, {
  description:
    "『恒常』：このカードは、戦闘フェイズ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
  varCtxID: varCtxID1,
  timing: ["戦闘フェイズ"],
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
  createTokuSyuKouKaText(["高機動"], {}),
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
          "『起動』このカードが場に出た場合、敵軍は、自分のユニット１枚を選んで持ち主の手札に移す。",
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
                            id: "ActionMoveCardToPosition",
                            cards: {
                              id: "カード",
                              value: "敵軍は、自分のユニット１枚",
                            },
                            baSyou: {
                              id: "場所",
                              value: [
                                // TODO
                                {
                                  id: "RelatedBaSyou",
                                  value: ["持ち主", "手札"],
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
      },
    ],
  },
];

module.exports = {
  ...prototype,
  texts: texts,
};
