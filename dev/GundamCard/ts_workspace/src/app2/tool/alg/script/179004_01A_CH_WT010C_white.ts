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

// 179004_01A_CH_WT010C_white
// ミゲル・アイマン
// 男性　子供　CO
// 速攻
// 『起動』：このセットグループのユニットは、戦闘ダメージを受けた場合、破壊される。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ミゲル・アイマン",
  characteristic: "男性　子供　CO".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null],
  texts: [
    createTokuSyuKouKaText(["速攻"], {}),
    getCardTextMacro({ id: "PlayG", cardText: DEFAULT_CARD_TEXT_SIYOU_KATA })
      .cardText,
    getCardTextMacro({
      id: "PlayCharacter",
      cardText: DEFAULT_CARD_TEXT_SIYOU_KATA,
      additionalRequire: [createRollCostRequire(1, "白")],
    }).cardText,
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：このセットグループのユニットは、戦闘ダメージを受けた場合、破壊される。",
      block: {
        require: {
          id: "RequireEvent",
          // TODO
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
                      このセットグループのユニットは: {
                        id: "カード",
                        value: { path: [{ id: "このカード" }] },
                      },
                    },
                  },
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionDestroy",
                          cards: {
                            id: "カード",
                            value: "このセットグループのユニットは",
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
