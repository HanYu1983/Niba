import {
  DEFAULT_CARD_TEXT_SIYOU_KATA,
  DEFAULT_CARD_TEXT_ZIDOU_KATA,
} from "../../tool/basic/basic";
import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { getCardTextMacro } from "./cardTextMacro";

// 179901_CG_C_WT001P_white
// アークエンジェル出航
// 補強
// （自軍配備フェイズ）：「供給」を持つ自軍カード１枚をロールする。その場合、カード２枚を引く。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アークエンジェル出航",
  characteristic: "補強".split("　"),
  category: "コマンド",
  color: "白",
  rollCost: ["白", null],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（自軍配備フェイズ）：「供給」を持つ自軍カード１枚をロールする。その場合、カード２枚を引く。",
      varCtxID: "varCtxID1",
      additionalRequire: [
        {
          id: "RequireTarget",
          targets: {
            "「供給」を持つ自軍カード１枚": {
              id: "カード",
              value: [],
              valueLengthInclude: [1],
            },
          },
          condition: {
            id: "ConditionAnd",
            and: [
              {
                id: "ConditionComparePlayer",
                value: [
                  {
                    id: "プレーヤー",
                    value: {
                      path: [
                        { id: "カード", value: "「供給」を持つ自軍カード１枚" },
                        "的「コントローラー」",
                      ],
                    },
                  },
                  "==",
                  {
                    id: "プレーヤー",
                    value: { path: [{ id: "自軍" }] },
                  },
                ],
              },
              // TODO: targetText
              {
                id: "ConditionCompareString",
                value: [
                  {
                    id: "字串",
                    value: {
                      path: [
                        { id: "カード", value: "「供給」を持つ自軍カード１枚" },
                        "的「特徴」",
                      ],
                    },
                  },
                  "hasToken",
                  {
                    id: "字串",
                    value: ["供給"],
                  },
                ],
              },
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "「供給」を持つ自軍カード１枚",
              target: "「供給」を持つ自軍カード１枚",
            },
          ],
        },
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionRoll",
                cards: { id: "カード", value: "「供給」を持つ自軍カード１枚" },
              },
              { id: "ActionDraw", count: 2 },
            ],
          },
        ],
      },
    }),
  ],
};

module.exports = prototype;
