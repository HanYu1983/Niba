import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import {
  createRollCostRequire,
  RequireTarget,
} from "../../tool/basic/blockPayload";
import {
  CardColor,
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  DEFAULT_CARD_TEXT_ZIDOU_KATA,
} from "../../tool/basic/basic";
import { getCardTextMacro, VAR_PLAY_CARD } from "./cardTextMacro";

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

const varCtxID1 = "varCtxID1";
const CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY =
  "合計国力－３してプレイ";

// 179901_00_U_RD010P_red
// P
// F91
// ガンダムF91（ビームランチャー）
// F91系　MS　レジェンド　専用｢シーブック・アノー｣
// クイック　高機動　〔１〕：改装［F91系］
//『恒常』：このカードは、戦闘フェイズ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
//『起動』このカードが場に出た場合、敵軍は、自分のユニット１枚を選んで持ち主の手札に移す。

const rollCost: (CardColor | null)[] = ["赤", "赤", "赤", null, null];
const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ガンダムF91（ビームランチャー）",
  characteristic: "F91系　MS　レジェンド　専用｢シーブック・アノー｣".split("　"),
  category: "ユニット",
  color: "赤",
  rollCost: rollCost,
  battlePoint: [6, 2, 6],
  texts: [
    createTokuSyuKouKaText(["クイック"], {}),
    createTokuSyuKouKaText(["高機動"], {}),
    createTokuSyuKouKaText(["改装", "F91系"], { cost: 1 }),
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayUnit",

      varCtxID: varCtxID1,
      rollCostRequire: [createRollCostRequire(2, "赤")],
      additionalRequire: [playCardRequire],
    }).cardText,
    {
      id: "恒常",
      description:
        "『恒常』：このカードは、戦闘フェイズ中、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
      texts: [
        getCardTextMacro({
          id: "PlayUnit",

          description:
            "『恒常』：[このカードは、戦闘フェイズ中、合計国力－３してプレイできる。]その場合、カット終了時に、このカードを廃棄する。",
          varCtxID: varCtxID1,
          rollCostRequire: [createRollCostRequire(2, "赤")],
          timing: ["戦闘フェイズ"],
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
        }).cardText,
        getCardTextMacro({
          id: "WhenCutFinished",
          description:
            "『恒常』：このカードは、戦闘フェイズ中、合計国力－３してプレイできる。[その場合、カット終了時に、このカードを廃棄する。]",

          hasFlag: CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY,
          additionalFeedbackAction: [
            {
              id: "ActionDestroy",
              cards: {
                id: "カード",
                value: { path: [{ id: "このカード" }] },
              },
            },
          ],
        }).cardText,
        getCardTextMacro({
          id: "WhenShowBa",

          description:
            "『起動』このカードが場に出た場合、敵軍は、自分のユニット１枚を選んで持ち主の手札に移す。",
          varCtxID: varCtxID1,
          additionalFeedbackAction: [
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
        }).cardText,
      ],
    },
  ],
};

module.exports = prototype;
