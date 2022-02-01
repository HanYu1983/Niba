import { getCustomFunctionString } from "../../../../tool/helper";
import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { getCardTextMacro, getConditionMacro } from "./cardTextMacro";
import {
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  Phase,
  TIMING_CHART,
} from "../../tool/basic/basic";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "キラ・ヤマト",
  characteristic: "男性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [2, 2, 2],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      timing: ["戦闘フェイズ"],
      additionalRequire: [
        createRollCostRequire(2, null),
        // {
        //   id: "RequireTarget",
        //   targets: {},
        //   condition: getConditionMacro({
        //     id: "這張卡在場時",
        //   }),
        // },
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddGlobalCardText",
                cards: {
                  id: "カード",
                  value: {
                    path: [
                      { id: "カード", value: { path: [{ id: "このカード" }] } },
                      "のセットグループのユニット",
                    ],
                  },
                },
                cardState: {
                  id: "ターン終了時まで「速攻」を得る",
                  cardID: "",
                  cardTextStates: [
                    {
                      id: "",
                      enabled: true,
                      cardText: createTokuSyuKouKaText(["速攻"], {}),
                    },

                    {
                      id: "",
                      enabled: true,
                      cardText: getCardTextMacro({
                        id: "ターン終了時までの場合",
                        feedbackAction: [
                          {
                            id: "ActionDeleteGlobalCardText",
                            cardStateID: "ターン終了時まで「速攻」を得る",
                          },
                        ],
                      }),
                      // {
                      //   id: "自動型",
                      //   category: "起動",
                      //   description: "[ターン終了時まで]「速攻」を得る。",
                      //   block: {
                      //     require: {
                      //       id: "RequireTarget",
                      //       targets: {},
                      //       condition: {
                      //         id: "ConditionAnd",
                      //         and: [
                      //           getConditionMacro({
                      //             id: "當觸發GameEvent的變量x的id時",
                      //             x: {
                      //               id: "GameEventOnTiming",
                      //               timing: TIMING_CHART[0],
                      //             },
                      //           }),
                      //           getConditionMacro({
                      //             id: "ターン終了時まで",
                      //           }),
                      //         ],
                      //       },
                      //     },
                      //     feedback: [
                      //       {
                      //         id: "FeedbackAction",
                      //         action: [
                      //           {
                      //             id: "ActionDeleteGlobalCardText",
                      //             cardTextStateID:
                      //               "ターン終了時まで「速攻」を得る",
                      //           },
                      //         ],
                      //       },
                      //     ],
                      //   },
                      // },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    }),
  ],
};

module.exports = prototype;
