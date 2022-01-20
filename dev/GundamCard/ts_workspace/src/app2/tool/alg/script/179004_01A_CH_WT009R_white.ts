import { getCustomFunctionString } from "../../../../tool/helper";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCard,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179004_01A_CH_WT009R_white
// ラクス・クライン
// 女性　子供　CO
// 【ステイ】　〔１〕：ゲイン　〔１〕：供給
// 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。

const prototype: CardPrototype = {
  title: "ラクス・クライン",
  characteristic: "女性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  texts: [
    createTokuSyuKouKaText(["ステイ"], {}),
    createTokuSyuKouKaText(["ゲイン"], { cost: 1 }),
    createTokuSyuKouKaText(["供給"], { cost: 1 }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。",
      block: {
        require: {
          id: "RequireEvent",
          event: {
            id: "「ゲイン」の効果で戦闘修正を得た場合",
            value: [0, 0, 0]
          }
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
                      "そのカードのセットグループ以外の自軍ユニット１枚": {
                        id: "カード",
                        value: [],
                        valueLengthInclude: [1]
                      },
                      "「ゲイン」の効果の戦闘修正": {
                        id: "戦闘修正",
                        value: { path: [{ id: "「ゲイン」の効果の戦闘修正" }] }
                      }
                    },
                  },
                  feedback: [
                    {
                      id: "FeedbackAction", action: [{
                        id: "ActionAddEffect",
                        effect: {
                          id: "GameEffectCustom",
                          customID: "その戦闘修正と同じ値の戦闘修正を得る。"
                        }
                      }]
                    }
                  ]
                }
              },
            ],
          },
        ],
      },
    },
  ],
};

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
