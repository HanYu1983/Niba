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
import { DEFAULT_CARD_TEXT_SIYOU_KATA } from "../../tool/basic/basic";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

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
  rollCost: ["白", null, null, null],
  texts: [
    createTokuSyuKouKaText(["ステイ"], {}),
    createTokuSyuKouKaText(["ゲイン"], { cost: 1 }),
    createTokuSyuKouKaText(["供給"], { cost: 1 }),
    createTokuSyuKouKaText(["速攻"], {}),
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }).cardText,
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
      block: {
        require: {
          id: "RequireEvent",
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
                      "「ゲイン」の「効果」の戦闘修正": {
                        id: "戦闘修正",
                        value: {
                          path: [
                            {
                              id: "手動事件發生時",
                              value: {
                                path: [{ id: "觸發這個事件的手動事件" }],
                              },
                            },
                            "の「ゲイン」の「効果」の戦闘修正",
                          ],
                        },
                      },
                    },
                  },
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionAddEffect",
                          effect: {
                            id: "GameEffectCustom",
                            customID: "その戦闘修正と同じ値の戦闘修正を得る。",
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
