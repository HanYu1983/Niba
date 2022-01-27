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
  texts: [
    getCardTextMacro({ id: "PlayG", cardText: DEFAULT_CARD_TEXT_SIYOU_KATA })
      .cardText,
    getCardTextMacro({
      id: "PlayCharacter",
      cardText: DEFAULT_CARD_TEXT_SIYOU_KATA,
    }).cardText,
    getCardTextMacro({
      id: "PlayText",
      cardText: DEFAULT_CARD_TEXT_SIYOU_KATA,
      description:
        "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      additionalRequire: [createRollCostRequire(2, null)],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddEffect",
                effectID: "",
                effect: {
                  id: "GameEffectCustom",
                  customID: "「速攻」を獲得。",
                },
              },
            ],
          },
        ],
      },
    }).cardText,
  ],
};

module.exports = prototype;
