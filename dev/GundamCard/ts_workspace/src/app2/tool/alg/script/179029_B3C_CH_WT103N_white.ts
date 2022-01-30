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

// 179029_B3C_CH_WT103N_white
// マニィ・アンバサダ
// 女性　子供
// 『起動』：自軍「ルイン・リー」が場に出た、または自軍「ルイン・リー」がいる状態で、このカードが場に出た場合、カード２枚を引く事ができる。
const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "マニィ・アンバサダ",
  characteristic: "女性　子供".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白"],
  battlePoint: [0, 0, 1],
  texts: [
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }).cardText,
    getCardTextMacro({
      id: "自軍「x」が場に出た場合",
      x: "ルイン・リー",
      description:
        "『起動』：[自軍「ルイン・リー」が場に出た]、または自軍「ルイン・リー」がいる状態で、このカードが場に出た場合、[カード２枚を引く事ができる]。",
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionDraw",
                count: 2,
              },
            ],
          },
        ],
      },
    }).cardText,
    getCardTextMacro({
      id: "WhenShowBa",
      description:
        "『起動』：自軍「ルイン・リー」が場に出た、または[自軍「ルイン・リー」がいる状態で、このカードが場に出た場合、カード２枚を引く事ができる]。",
      additionalRequire: [
        // TODO: 自軍「ルイン・リー」がいる状態
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionDraw",
                count: 2,
              },
            ],
          },
        ],
      },
    }).cardText,
  ],
};

module.exports = prototype;
