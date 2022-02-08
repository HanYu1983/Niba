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
import { GameEventOnManualEventCustomID } from "../gameEventOnManualEventCustomID";
import { RequireCustomID } from "../../tool/basic/requireCustom";
import { getRequireMacro } from "./getRequireMacro";

// 179901_CG_CH_WT002P_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：供給
// （戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ラクス・クライン",
  characteristic: "女性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白"],
  battlePoint: [0, 0, 0],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    createTokuSyuKouKaText(["供給"], { cost: 1 }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "（戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。",
      timing: ["戦闘フェイズ"],
      varCtxID:
        "（戦闘フェイズ）〔R〕：自軍キャラ１枚は、ターン終了時まで、＋２／＋２／＋２を得る。",
      additionalRequire: [
        getRequireMacro({ id: "roll" }),
        {
          id: "RequireTarget",
          targets: {
            自軍キャラ１枚: {
              id: "カード",
              value: [],
              valueLengthInclude: [1],
            },
          },
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "變量x的是y軍",
                x: { id: "カード", value: "自軍キャラ１枚" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "自軍キャラ１枚" },
                y: ["キャラクター"],
              }),
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "自軍キャラ１枚",
              target: "自軍キャラ１枚",
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
                cards: { id: "カード", value: "自軍キャラ１枚" },
                cardStateID: "ターン終了時まで、＋２／＋２／＋２を得る",
                cardTextState: {
                  id: "カードのテキスト",
                  value: [
                    {
                      id: "",
                      enabled: true,
                      cardText: {
                        id: "CardTextCustom",
                        description: "",
                        customID: {
                          id: "CardTextCustomIDBattleBonus",
                          battleBonus: [2, 2, 2],
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
                            cardStateID:
                              "ターン終了時まで、＋２／＋２／＋２を得る",
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
