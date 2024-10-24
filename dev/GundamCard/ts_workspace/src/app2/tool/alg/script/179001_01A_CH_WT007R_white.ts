import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";

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
      additionalRequire: [createRollCostRequire(2, null)],
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
                cardStateID: "ターン終了時まで「速攻」を得る",
                cardTextState: {
                  id: "カードのテキスト",
                  value: [
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
