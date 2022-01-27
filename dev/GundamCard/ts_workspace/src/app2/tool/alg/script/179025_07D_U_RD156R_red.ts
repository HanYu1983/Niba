import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { VAR_PLAY_CARD } from "./createPlayCardText";
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
import { getCardTextMacro } from "./cardTextMacro";

const playCardRequire: RequireTarget = {
  id: "RequireTarget",
  targets: {
    ユニットとキャラ以外の敵軍カード１枚のプレイ: {
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
                  value: "ユニットとキャラ以外の敵軍カード１枚のプレイ",
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
                value: ["敵軍", "プレイされているカード"],
              },
            ],
          },
        ],
      },
      {
        id: "ConditionNot",
        not: {
          id: "ConditionCompareCardCategory",
          value: [
            {
              id: "カードの種類",
              value: {
                path: [
                  {
                    id: "カード",
                    value: "ユニットとキャラ以外の敵軍カード１枚のプレイ",
                  },
                  "的「種類」",
                ],
              },
            },
            "in",
            {
              id: "カードの種類",
              value: ["ユニット", "キャラクター"],
            },
          ],
        },
      },
    ],
  },
  action: [
    {
      id: "ActionSetTarget",
      source: "ユニットとキャラ以外の敵軍カード１枚のプレイ",
      target: "ユニットとキャラ以外の敵軍カード１枚のプレイ",
    },
  ],
};

const varCtxID1 = "varCtxID1";
const CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY =
  "合計国力－３してプレイ";

// 179025_07D_U_RD156R_red
// R
// F91
// ガンダムF91
// F91系　MS　レジェンド　専用｢シーブック・アノー｣
// クイック　高機動　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、ユニットとキャラ以外の敵軍カード１枚のプレイを無効にし、そのカードを廃棄する。

const rollCost: (CardColor | null)[] = ["赤", "赤", null, null, null];
const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "F91",
  characteristic: "F91系　MS　レジェンド　専用｢シーブック・アノー｣".split("　"),
  category: "ユニット",
  color: "赤",
  rollCost: ["赤", "赤", null, null, null],
  texts: [
    createTokuSyuKouKaText(["クイック"], {}),
    createTokuSyuKouKaText(["高機動"], {}),
    createTokuSyuKouKaText(["改装", "F91系"], { cost: 1 }),
    getCardTextMacro({ id: "PlayG", cardText: DEFAULT_CARD_TEXT_SIYOU_KATA })
      .cardText,
    getCardTextMacro({
      id: "PlayUnit",
      cardText: DEFAULT_CARD_TEXT_SIYOU_KATA,
      varCtxID: varCtxID1,
      rollCostRequire: [createRollCostRequire(2, "赤")],
      additionalRequire: [playCardRequire],
    }).cardText,
    {
      id: "恒常",
      description:
        "『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
      texts: [
        getCardTextMacro({
          id: "PlayUnit",
          cardText: DEFAULT_CARD_TEXT_SIYOU_KATA,
          description:
            "『恒常』：[このカードは、合計国力－３してプレイできる。]その場合、カット終了時に、このカードを廃棄する。",
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
          additionalFeedbackAction: [
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
        }).cardText,
        getCardTextMacro({
          id: "WhenCutFinished",
          cardText: DEFAULT_CARD_TEXT_ZIDOU_KATA,
          description:
            "『恒常』：このカードは、合計国力－３してプレイできる。[その場合、カット終了時に、このカードを廃棄する。]",
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
          cardText: DEFAULT_CARD_TEXT_ZIDOU_KATA,
          description:
            "『起動』：このカードが場に出た場合、戦闘エリアにいる敵軍ユニット１～２枚をロールする。",
          varCtxID: varCtxID1,
          additionalFeedbackAction: [
            {
              id: "ActionDestroy",
              cards: {
                id: "カード",
                value: "ユニットとキャラ以外の敵軍カード１枚のプレイ",
              },
            },
          ],
        }).cardText,
      ],
    },
  ],
};

module.exports = prototype;
