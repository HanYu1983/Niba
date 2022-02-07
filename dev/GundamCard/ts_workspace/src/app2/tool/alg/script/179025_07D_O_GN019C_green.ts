import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { TIMING_CHART } from "../../tool/basic/basic";

// 179025_07D_O_GN019C_green
// C
// GUNDAM
// 悪意の光
// 破壊
// 『起動』：自軍ターン開始時に、このカードの上にコイン１個を乗せる。
// 『起動』：このカードの上のコインが２個以上になった場合、このカードを廃棄する。その場合、敵軍ユニット１枚に４ダメージを与える事ができる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "悪意の光",
  characteristic: "破壊".split("　"),
  category: "オペレーション",
  color: "緑",
  rollCost: ["緑"],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayOperation",
      additionalRequire: [createRollCostRequire(1, "緑")],
    }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：自軍ターン開始時に、このカードの上にコイン１個を乗せる。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "GameEventOnTiming", timing: TIMING_CHART[0] },
              }),
              getConditionMacro({ id: "ターン開始時" }),
              getConditionMacro({ id: "是主動玩家" }),
            ],
          },
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
                      action: [
                        {
                          id: "ActionAddCoinToCard",
                          cards: {
                            id: "カード",
                            value: { path: [{ id: "このカード" }] },
                          },
                          coin: { id: "CoinCoin" },
                          count: 1,
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
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：このカードの上のコインが２個以上になった場合、このカードを廃棄する。その場合、敵軍ユニット１枚に４ダメージを与える事ができる。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "コインがx個以上になった場合", cardID: "" },
              }),
              {
                id: "ConditionJsonfp",
                program: {
                  $gameEventCardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "gameEvent" },
                      { getter: "cardID" },
                    ],
                  },
                  pass1: {
                    if: [
                      {
                        "->": [
                          "$in.ctx",
                          { getCardCoinCount: "$gameEventCardID" },
                          { ">=": 2 },
                        ],
                      },
                      {},
                      { error: "coin數要>=2" },
                    ],
                  },
                },
              },
            ],
          },
          action: [
            {
              id: "ActionMoveCardToPosition",
              cards: { id: "カード", value: { path: [{ id: "このカード" }] } },
              baSyou: {
                id: "場所",
                value: [
                  { id: "RelatedBaSyou", value: ["持ち主", "ジャンクヤード"] },
                ],
              },
            },
          ],
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddBlock",
                type: "立即",
                block: {
                  isOption: true,
                  require: {
                    id: "RequireTarget",
                    targets: {
                      敵軍ユニット１枚: {
                        id: "カード",
                        value: [],
                        valueLengthInclude: [1],
                      },
                    },
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        getConditionMacro({
                          id: "變量x的是y軍",
                          x: { id: "カード", value: "敵軍ユニット１枚" },
                          y: "敵軍",
                        }),
                        getConditionMacro({
                          id: "變量x的角色包含於y",
                          x: { id: "カード", value: "敵軍ユニット１枚" },
                          y: ["ユニット"],
                        }),
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        source: "敵軍ユニット１枚",
                        target: "敵軍ユニット１枚",
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        {
                          id: "ActionUnitDamage",
                          cards: {
                            id: "カード",
                            value: "敵軍ユニット１枚",
                          },
                          damage: {
                            id: "數字",
                            value: [4],
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
