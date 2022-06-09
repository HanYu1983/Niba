import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro, VAR_PLAY_CARD } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { RequireTarget } from "../../tool/basic/blockPayload";
import { CardColor } from "../../tool/basic/basic";

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
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCharacter",
      additionalRequire: [createRollCostRequire(1, "白")],
    }),
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
    }),
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
    }),
  ],
};

module.exports = prototype;
