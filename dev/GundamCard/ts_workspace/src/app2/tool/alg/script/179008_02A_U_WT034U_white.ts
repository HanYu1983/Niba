import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179008_02A_U_WT034U_white
// アストレイ ブルーフレーム
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］　
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。
// （注：このカードが廃棄される時にも起動する）

const prototype: CardPrototype = {
  title: "アストレイ ブルーフレーム",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null, null, null],
  texts: [
    createTokuSyuKouKaText(["改装", "ブルーフレーム系"], { cost: 0 }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で廃棄される場合、カード１枚を引く。（注：このカードが廃棄される時にも起動する）",
      block: {
        // TODO: 「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddBlock",
                type: "立即",
                block: {
                  feedback: [{
                    id: "FeedbackAction",
                    action: [{
                      id: "ActionDraw",
                      count: 1,
                    }]
                  }]
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
