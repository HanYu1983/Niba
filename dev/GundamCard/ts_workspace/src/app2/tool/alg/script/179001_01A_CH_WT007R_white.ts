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
import { createPlayCardText } from "./createPlayCardText";

const _main: TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
): TargetType => {
  console.log("JIBA");
  return {
    id: "カード",
    value: [],
  };
};

// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘階段）〔２〕：這個配置群的機體は、回合終了時前「速攻」を獲得。
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "キラ・ヤマト",
  characteristic: "男性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  texts: [
    {
      id: "使用型",
      timing: ["戦闘フェイズ"],
      description:
        "（戦闘階段）〔２〕：這個配置群的機體は、回合終了時前「速攻」を獲得。",
      block: {
        require: createRollCostRequire(2, null),
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
    },
  ],
};

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
