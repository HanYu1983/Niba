import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
} from "../../tool/basic/gameContext";
import {
  ACTION_CARD_TO_BASYOU,
  CARD_TEXT_PLAY,
  CARD_TEXT_PLAY_G,
  CARD_TEXT_PLAY_UNIT,
  CONDITION_PLAY_UNIT_FROM_BASYOU,
  CONDITION_TOTAL_COST,
  createPlayCardText,
  REQUIRE_PLAY,
  VAR_PLAY_CARD,
} from "./createPlayCardText";
import {
  CARD_TEXT_DESTROY_WHEN_CUT_FINISHED,
  CARD_TEXT_DESTROY_WHEN_CUT_FINISHED_VAR_FLAG_FOR_DESTROY,
  CARD_TEXT_WHEN_SHOW_BA,
} from "./cardTextMacroForF91";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import {
  createRollCostRequire,
  RequireTarget,
} from "../../tool/basic/blockPayload";
import {
  CardText,
  CardTextSiYouKaTa,
  CardTextZiDouKaTa,
} from "../../tool/basic/basic";

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

// 179025_07D_U_RD156R_red
// R
// F91
// ガンダムF91
// F91系　MS　レジェンド　専用｢シーブック・アノー｣
// クイック　高機動　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、ユニットとキャラ以外の敵軍カード１枚のプレイを無効にし、そのカードを廃棄する。

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
    CARD_TEXT_PLAY_G,
    {
      ...CARD_TEXT_PLAY_UNIT,
      block: {
        ...CARD_TEXT_PLAY_UNIT.block,
        contextID: varCtxID1,
        require: {
          id: "RequireAnd",
          and: [
            createRollCostRequire(2, "赤"),
            {
              ...REQUIRE_PLAY,
              condition: {
                ...REQUIRE_PLAY.condition,
                and: [CONDITION_TOTAL_COST, CONDITION_PLAY_UNIT_FROM_BASYOU],
              },
            } as RequireTarget,
            playCardRequire,
          ],
        },
      },
    },
    {
      id: "恒常",
      description:
        "『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
      texts: [
        // このカードは、合計国力－３してプレイできる
        {
          ...CARD_TEXT_PLAY_UNIT,
          block: {
            ...CARD_TEXT_PLAY_UNIT.block,
            contextID: varCtxID1,
            require: {
              id: "RequireAnd",
              and: [
                createRollCostRequire(2, "赤"),
                {
                  ...REQUIRE_PLAY,
                  condition: {
                    ...REQUIRE_PLAY.condition,
                    and: [
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
                      CONDITION_PLAY_UNIT_FROM_BASYOU,
                    ],
                  },
                } as RequireTarget,
                playCardRequire,
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
                  },
                ],
              },
            ],
          },
        } as CardTextSiYouKaTa,
        CARD_TEXT_DESTROY_WHEN_CUT_FINISHED,
        {
          ...CARD_TEXT_WHEN_SHOW_BA,
          block: {
            ...CARD_TEXT_WHEN_SHOW_BA.block,
            contextID: varCtxID1,
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
                            // TODO: プレイを無効にし、そのカードを廃棄する。
                            {
                              id: "ActionDestroy",
                              cards: {
                                id: "カード",
                                value:
                                  "ユニットとキャラ以外の敵軍カード１枚のプレイ",
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
        } as CardTextZiDouKaTa,
      ],
    },
  ],
};

module.exports = prototype;
