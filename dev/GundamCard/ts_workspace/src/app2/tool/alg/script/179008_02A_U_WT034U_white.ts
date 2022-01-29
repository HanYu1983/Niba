import { getCustomFunctionString } from "../../../../tool/helper";
import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { getCardTextMacro } from "./cardTextMacro";
import {
  BattleBonus,
  DEFAULT_CARD_TEXT_SIYOU_KATA,
} from "../../tool/basic/basic";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179008_02A_U_WT034U_white
// アストレイ ブルーフレーム
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。
// （注：このカードが廃棄される時にも起動する）

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null, null],
  texts: [
    createTokuSyuKouKaText(["改装", "ブルーフレーム系"], { cost: 0 }),
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(1, "白")],
    }).cardText,
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。（注：このカードが廃棄される時にも起動する）",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getCardTextMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "「改装」の効果で廃棄される場合", cardID: "" },
              }).condition,
              getCardTextMacro({
                id: "這張卡在場時",
              }).condition,
              {
                id: "ConditionJsonfp",
                program: {
                  $cardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "cardID" },
                    ],
                  },
                  $gameEventCardID: {
                    "->": [
                      "$in.blockPayload",
                      { log: "blockPayload" },
                      { getter: "cause" },
                      { getter: "gameEvent" },
                      { getter: "cardID" },
                    ],
                  },
                  $isThisCard: {
                    "->": ["$gameEventCardID", { "==": "$cardID" }],
                  },
                  $hasCharacteristic: {
                    "->": [
                      "$in.ctx",
                      { getCardCharacteristic: "$gameEventCardID" },
                      { filter: { "==": "アストレイ系" } },
                      { size: null },
                      { ">": 0 },
                    ],
                  },
                  pass0: {
                    if: [
                      {
                        "->": [
                          [
                            {
                              "->": [
                                "$in.ctx",
                                { getCardController: "$cardID" },
                              ],
                            },
                            {
                              "->": [
                                "$in.ctx",
                                { getCardController: "$gameEventCardID" },
                              ],
                            },
                          ],
                          { reduce: "==" },
                        ],
                      },
                      {},
                      {
                        error: "必須是自軍機體",
                      },
                    ],
                  },
                  pass1: {
                    if: [
                      {
                        "->": [
                          ["$isThisCard", "$hasCharacteristic"],
                          { reduce: "or" },
                        ],
                      },
                      {},
                      {
                        error:
                          "被換裝廢棄的卡必須是這張卡或是存在特徵アストレイ系",
                      },
                    ],
                  },
                },
              },
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
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionDraw",
                          count: 1,
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
