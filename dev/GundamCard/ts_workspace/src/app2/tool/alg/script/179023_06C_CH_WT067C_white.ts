import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";

// 179023_06C_CH_WT067C_white
// スウェン・カル・バヤン
// 男性　大人
// 速攻
// （戦闘フェイズ）〔０〕：敵軍部隊がいる場合、このカードをリロールする。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "スウェン・カル・バヤン",
  characteristic: "男性　大人".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  battlePoint: [2, 1, 2],
  texts: [
    createTokuSyuKouKaText(["速攻"], {}),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "（戦闘フェイズ）〔０〕：敵軍部隊がいる場合、このカードをリロールする。",
      timing: ["戦闘フェイズ"],
      additionalRequire: [
        {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionJsonfp",
            program: {
              $cardID: {
                "->": [
                  "$in.blockPayload",
                  { getter: "cause" },
                  { getter: "cardID" },
                ],
              },
              pass1: {
                if: [
                  {
                    "->": ["$in.ctx", { isOpponentHasBattleGroup: "$cardID" }],
                  },
                  {},
                  { error: "對方必須存在部隊" },
                ],
              },
            },
          },
        },
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionReroll",
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
  ],
};

module.exports = prototype;
