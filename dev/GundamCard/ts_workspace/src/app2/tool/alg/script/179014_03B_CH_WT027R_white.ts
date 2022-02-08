import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179014_03B_CH_WT027R_white
// ゼクス・マーキス
// 男性　子供
// 速攻
// （戦闘フェイズ）〔１〕：自軍ユニットの「専用機のセット」が成立している場合、このカードは、ターン終了時まで「高機動」を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ゼクス・マーキス",
  characteristic: "男性　子供".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", "白", null],
  battlePoint: [3, 0, 2],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "（戦闘フェイズ）〔１〕：自軍ユニットの「専用機のセット」が成立している場合、このカードは、ターン終了時まで「高機動」を得る。",
      timing: ["戦闘フェイズ"],
      additionalRequire: [
        createRollCostRequire(1, null),
        // TODO: 自軍ユニットの「専用機のセット」が成立している場合
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddGlobalCardText",
                cards: { id: "カード", value: "自軍ユニット１枚" },
                cardStateID: "ターン終了時まで「高機動」を得る。",
                cardTextState: {
                  id: "TargetTypeCardTextState",
                  value: [
                    {
                      id: "",
                      enabled: true,
                      cardText: createTokuSyuKouKaText(["高機動"], {}),
                    },
                    {
                      id: "",
                      enabled: true,
                      cardText: getCardTextMacro({
                        id: "ターン終了時までの場合",
                        feedbackAction: [
                          {
                            id: "ActionDeleteGlobalCardText",
                            cardStateID: "ターン終了時まで「高機動」を得る。",
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
