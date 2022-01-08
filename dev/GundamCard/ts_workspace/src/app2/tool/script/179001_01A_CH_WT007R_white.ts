import { CardPrototype, GameContext } from "../model/gameContext";
import { createRollCostRequire } from ".";
// 179001_01A_CH_WT007R_white
// キラ・ヤマト
// 男性　子供　CO
// （戦闘階段）〔２〕：這個配置群的機體は、回合終了時前「速攻」を獲得。
// （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。

const prototype: CardPrototype = {
  title: "キラ・ヤマト",
  characteristic: "男性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  texts: [
    {
      id: "使用型",
      timing: ["自軍", "配備フェイズ"],
      description: "play card",
      block: {
        require: {
          id: "RequireAnd",
          and: [
            createRollCostRequire(1, "白"),
            {
              id: "RequireTarget",
              targets: {},
              action: [
                {
                  id: "ActionSetFace",
                  cards: {
                    id: "このカード",
                  },
                  faceDown: {
                    id: "TargetTypeYesNo",
                    boolean: false,
                  },
                },
              ],
            },
          ],
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionMoveCardToPosition",
                cards: {
                  id: "このカード",
                },
                baSyou: {
                  id: "場所",
                  baSyou: {
                    id: "RelatedBaSyou",
                    value: ["自軍", "配備エリア"],
                  },
                },
              },
            ],
          },
        ],
      },
    },
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

module.exports = prototype;
