import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { getJsonfpMacro, INJECT_JSONFP_MACRO } from "./getJsonfpMacro";
import { ActionAddGlobalCardText } from "../../tool/basic/action";
import { CardTextCustomIDBattleBonus } from "../../tool/basic/basic";

// 179004_01A_CH_WT009R_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：ゲイン　〔１〕：供給
// 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ラクス・クライン",
  characteristic: "女性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null],
  battlePoint: [0, 0, 0],
  texts: [
    createTokuSyuKouKaText(["ステイ"], { cost: 1, costColor: "白" }),
    createTokuSyuKouKaText(["ゲイン"], { cost: 1 }),
    createTokuSyuKouKaText(["供給"], { cost: 1 }),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: {
                  id: "「ゲイン」の効果で戦闘修正を得る場合",
                  cardID: "",
                  battleBonus: [0, 0, 0],
                },
              }),
              getConditionMacro({
                id: "變量x的是y軍",
                x: { id: "カード", value: { path: [{ id: "事件的卡" }] } },
                y: "自軍",
              }),
            ],
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
                  require: {
                    id: "RequireTarget",
                    targets: {
                      そのカードのセットグループ以外の自軍ユニット１枚: {
                        id: "カード",
                        value: [],
                        valueLengthInclude: [1],
                      },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        getConditionMacro({
                          id: "當觸發GameEvent的變量x的id時",
                          x: {
                            id: "「ゲイン」の効果で戦闘修正を得る場合",
                            cardID: "",
                            battleBonus: [0, 0, 0],
                          },
                        }),
                        {
                          id: "ConditionNot",
                          not: {
                            id: "ConditionCompareCard",
                            value: [
                              {
                                id: "カード",
                                value:
                                  "そのカードのセットグループ以外の自軍ユニット１枚",
                              },
                              "in",
                              {
                                id: "カード",
                                value: {
                                  path: [
                                    {
                                      id: "カード",
                                      value: { path: [{ id: "事件的卡" }] },
                                    },
                                    "のセットグループ",
                                  ],
                                },
                              },
                            ],
                          },
                        },
                        getConditionMacro({
                          id: "變量x的是y軍",
                          x: {
                            id: "カード",
                            value:
                              "そのカードのセットグループ以外の自軍ユニット１枚",
                          },
                          y: "自軍",
                        }),
                        getConditionMacro({
                          id: "變量x的角色包含於y",
                          x: {
                            id: "カード",
                            value:
                              "そのカードのセットグループ以外の自軍ユニット１枚",
                          },
                          y: ["ユニット"],
                        }),
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source:
                          "そのカードのセットグループ以外の自軍ユニット１枚",
                        target:
                          "そのカードのセットグループ以外の自軍ユニット１枚",
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionJsonfp",
                          program: {
                            $battleBonus: {
                              "->": [
                                "$in.blockPayload",
                                { getter: "cause" },
                                { getter: "gameEvent" },
                                { getter: "battleBonus" },
                              ],
                            },
                            output: {
                              id: "ActionAddGlobalCardText",
                              cards: {
                                id: "カード",
                                value:
                                  "そのカードのセットグループ以外の自軍ユニット１枚",
                              },
                              cardStateID:
                                "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
                              cardTextState: {
                                id: "カードのテキスト",
                                value: [
                                  {
                                    id: "",
                                    enabled: true,
                                    cardText: {
                                      id: "CardTextCustom",
                                      customID: {
                                        id: "CardTextCustomIDBattleBonus",
                                        battleBonus: "$battleBonus",
                                      },
                                    },
                                  },
                                  {
                                    id: "",
                                    enabled: true,
                                    cardText: {
                                      // @ts-ignore
                                      def: getCardTextMacro({
                                        id: "ターン終了時までの場合",
                                        feedbackAction: [
                                          {
                                            id: "ActionDeleteGlobalCardText",
                                            cardStateID:
                                              "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
                                          },
                                        ],
                                      }),
                                    },
                                  },
                                ],
                              },
                            } as ActionAddGlobalCardText,
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
};

module.exports = prototype;
