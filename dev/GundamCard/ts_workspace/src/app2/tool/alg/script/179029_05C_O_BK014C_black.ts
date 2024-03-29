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

// 179029_05C_O_BK014C_black
// C
// 83
// 敵兵の擁護
// 束縛
// 『起動』：このセットグループのテキストをプレイした場合、（自軍は）可能な限り、〔２〕を支払う。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "敵兵の擁護",
  characteristic: "束縛".split("　"),
  category: "オペレーション",
  color: "黒",
  rollCost: ["黒", null],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayOperation(Unit)",
      additionalRequire: [createRollCostRequire(1, "黒")],
    }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：このセットグループのテキストをプレイした場合、（自軍は）可能な限り、〔２〕を支払う。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionAnd",
            and: [
              getConditionMacro({
                id: "當觸發GameEvent的變量x的id時",
                x: { id: "プレイした場合", cardTextID: "", cardID: "" },
              }),
              {
                id: "ConditionJsonfp",
                program: {
                  $cardID: {
                    "->": [
                      "$in.blockPayload",
                      { getter: "cause" },
                      { getter: "cardID" },
                    ],
                  },
                  $setGroupRootCardID: {
                    "->": [
                      "$in.ctx",
                      { getter: "gameState" },
                      { getter: "setGroupLink" },
                      { getter: "$cardID" },
                    ],
                  },
                  $setGroupCards: {
                    "->": [
                      "$in.ctx",
                      {
                        getSetGroupCards: "$setGroupRootCardID",
                      },
                    ],
                  },
                  $gameEventCardID: {
                    "->": [
                      "$in.blockPayload",
                      { log: "blockPayload" },
                      { getter: "cause" },
                      { getter: "gameEvent" },
                      { getter: "cardID" },
                    ],
                  },
                  pass3: {
                    if: [
                      {
                        "->": [
                          "$setGroupCards",
                          { filter: { "==": "$gameEventCardID" } },
                          { size: null },
                          { ">": 0 },
                        ],
                      },
                      {},
                      { error: "必須是這張卡的被配置卡的play" },
                    ],
                  },
                },
              },
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
                  require: createRollCostRequire(2, null),
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
