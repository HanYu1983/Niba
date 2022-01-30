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
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179025_07D_CH_WT075C_white
// リリーナ・ピースクラフト
// 女性　子供　別名「リリーナ・ドーリアン」
// 【ステイ】
// 『起動』：このカードがプレイされて場にセットされた場合、カード１枚を引く。
// 『起動』：自軍本国に戦闘ダメージが与えられた場合、カード１枚を引く事ができる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "リリーナ・ピースクラフト",
  characteristic: "女性　子供　別名「リリーナ・ドーリアン」".split("　"),
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
    createTokuSyuKouKaText(["ステイ"], {}),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：このカードがプレイされて場にセットされた場合、カード１枚を引く。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: getConditionMacro({
            id: "當觸發GameEvent的變量x的id時",
            x: { id: "プレイされて場にセットされた場合", cardID: "" },
          }),
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
                      action: [{ id: "ActionDraw", count: 1 }],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
    // DOTO: 『起動』：自軍本国に戦闘ダメージが与えられた場合、カード１枚を引く事ができる。
  ],
};

module.exports = prototype;
