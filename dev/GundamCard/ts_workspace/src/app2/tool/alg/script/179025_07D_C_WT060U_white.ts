import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179025_07D_C_WT060U_white
// 巨なる力
// 強化
// （戦闘フェイズ）：自軍ユニット１～２枚は、ターン終了時まで「高機動」、＋３／＋３／＋３を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "巨なる力",
  characteristic: "強化".split("　"),
  category: "コマンド",
  color: "白",
  rollCost: ["白", null, null, null, null],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（戦闘フェイズ）：自軍ユニット１～２枚は、ターン終了時まで「高機動」、＋３／＋３／＋３を得る。",
      timing: ["戦闘フェイズ"],
      varCtxID: "varCtxID1",
      additionalRequire: [
        createRollCostRequire(1, "白"),
        {
          id: "RequireTarget",
          targets: {
            "自軍ユニット１～２枚": {
              id: "カード",
              value: [],
              valueLengthInclude: [1, 2],
            },
          },
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "變量x的是y軍",
                x: { id: "カード", value: "自軍ユニット１～２枚" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "自軍ユニット１～２枚" },
                y: ["ユニット"],
              }),
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "自軍ユニット１～２枚",
              target: "自軍ユニット１～２枚",
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
                id: "ActionAddGlobalCardText",
                cards: { id: "カード", value: "自軍ユニット１～２枚" },
                cardStateID:
                  "ターン終了時まで「高機動」、＋３／＋３／＋３を得る。",
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
                      cardText: {
                        id: "CardTextCustom",
                        description: "",
                        customID: {
                          id: "CardTextCustomIDBattleBonus",
                          battleBonus: [3, 3, 3],
                        },
                      },
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
