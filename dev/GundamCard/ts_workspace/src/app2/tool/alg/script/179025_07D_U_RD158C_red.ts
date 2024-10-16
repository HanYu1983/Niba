import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro, VAR_PLAY_CARD } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { RequireTarget } from "../../tool/basic/blockPayload";
import { CardColor } from "../../tool/basic/basic";

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

const varCtxID1 = "varCtxID1";
const CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY =
  "合計国力－３してプレイ";

// 179025_07D_U_RD158C_red
// C
// F91
// ガンダムF91（ツインヴェスバータイプ）
// F91系　MS　専用｢シーブック・アノー｣
// クイック　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。

const rollCost: (CardColor | null)[] = ["赤", "赤", null, null, null];
const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ガンダムF91（ツインヴェスバータイプ）",
  characteristic: "F91系　MS　専用｢シーブック・アノー｣".split("　"),
  category: "ユニット",
  color: "赤",
  rollCost: rollCost,
  battlePoint: [5, 2, 5],
  texts: [
    createTokuSyuKouKaText(["クイック"], {}),
    createTokuSyuKouKaText(["改装", "F91系"], { cost: 1 }),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      varCtxID: varCtxID1,
      rollCostRequire: [createRollCostRequire(2, "赤")],
      additionalRequire: [playCardRequire],
    }),
    {
      id: "恒常",
      description:
        "『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
      texts: [
        getCardTextMacro({
          id: "PlayUnit",
          description:
            "『恒常』：[このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。]その場合、カット終了時に、このカードを廃棄する。",
          timing: ["ダメージ判定ステップ"],
          varCtxID: varCtxID1,
          rollCostRequire: [createRollCostRequire(2, "赤")],
          additionalRequire: [playCardRequire],
          totalCostConditionReplace: [
            {
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
                            { id: "カード", value: VAR_PLAY_CARD },
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
            },
          ],
          feedbackBlock: {
            feedback: [
              {
                id: "FeedbackAction",
                action: [
                  {
                    id: "ActionSetFlag",
                    flag: {
                      id: "字串",
                      value: [
                        CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY,
                      ],
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
        }),
        getCardTextMacro({
          id: "WhenCutFinished",
          description:
            "『恒常』：このカードは、ダメージ判定ステップ中、合計国力－３してプレイできる。[その場合、カット終了時に、このカードを廃棄する。]",
          hasFlag: CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY,
          feedbackBlock: {
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
                ],
              },
            ],
          },
        }),
        getCardTextMacro({
          id: "WhenShowBa",
          description:
            "『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。",
          varCtxID: varCtxID1,
          feedbackBlock: {
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
        }),
      ],
    },
  ],
};

module.exports = prototype;
