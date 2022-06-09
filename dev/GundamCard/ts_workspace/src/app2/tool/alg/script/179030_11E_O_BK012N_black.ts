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

// 179030_11E_O_BK012N_black
// N
// V
// ショットクロー
// 束縛　装弾
// 『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。
// （常時）〔R〕：敵軍は、自分のジャンクヤードにあるカード１枚をゲームから取り除く。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ショットクロー",
  characteristic: "束縛　装弾".split("　"),
  category: "オペレーション",
  color: "黒",
  rollCost: ["黒"],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayOperation",
      additionalRequire: [createRollCostRequire(1, "黒")],
    }),
    {
      id: "自動型",
      category: "常駐",
      description:
        "『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。",
      block: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddEffect",
                effect: {
                  id: "GameEffectCustom",
                  customID: "このカードを自軍Gとしてロールできる",
                },
              },
            ],
          },
        ],
      },
    },
    getCardTextMacro({
      id: "PlayText",
      description:
        "（常時）〔R〕：敵軍は、自分のジャンクヤードにあるカード１枚をゲームから取り除く。",
      varCtxID:
        "（常時）〔R〕：敵軍は、自分のジャンクヤードにあるカード１枚をゲームから取り除く。",
      additionalRequire: [
        {
          id: "RequireTarget",
          targets: {},
          action: [
            {
              id: "ActionRoll",
              cards: { id: "カード", value: { path: [{ id: "このカード" }] } },
            },
          ],
        },
        {
          id: "RequireTarget",
          targets: {
            "敵軍は、自分のジャンクヤードにあるカード１枚": {
              id: "カード",
              value: [],
              valueLengthInclude: [1],
              responsePlayer: "敵軍",
            },
          },
          condition: {
            id: "ConditionCompareBaSyou",
            value: [
              {
                id: "場所",
                value: {
                  path: [
                    {
                      id: "カード",
                      value: "自分のジャンクヤードにあるカード１枚",
                    },
                    "的「場所」",
                  ],
                },
              },
              "==",
              {
                id: "場所",
                value: [
                  {
                    id: "RelatedBaSyou",
                    value: ["自軍", "ジャンクヤード"],
                  },
                ],
              },
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "敵軍は、自分のジャンクヤードにあるカード１枚",
              target: "敵軍は、自分のジャンクヤードにあるカード１枚",
            },
          ],
        },
      ],
      feedbackBlock: {
        contextID:
          "（常時）〔R〕：敵軍は、自分のジャンクヤードにあるカード１枚をゲームから取り除く。",
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              // ゲームから取り除く
            ],
          },
        ],
      },
    }),
  ],
};

module.exports = prototype;
