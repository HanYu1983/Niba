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
import { getCardTextMacro, getConditionMacro } from "./cardTextMacro";
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
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
    getCardTextMacro({
      id: "PlayText",
      description:
        "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。",
      additionalRequire: [
        createRollCostRequire(2, null),
        {
          id: "RequireTarget",
          targets: {},
          condition: getConditionMacro({
            id: "變量x的場所包含於y",
            x: { id: "カード", value: { path: [{ id: "このカード" }] } },
            y: [
              { id: "RelatedBaSyou", value: ["自軍", "配備エリア"] },
              { id: "RelatedBaSyou", value: ["自軍", "戦闘エリア（左）"] },
              { id: "RelatedBaSyou", value: ["自軍", "戦闘エリア（右）"] },
            ],
          }),
        },
      ],
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
    }),
  ],
};

module.exports = prototype;
