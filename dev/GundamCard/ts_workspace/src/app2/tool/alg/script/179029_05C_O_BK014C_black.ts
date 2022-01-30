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
                  // pass1: {
                  //   if: [
                  //     {
                  //       "->": [
                  //         "$in.blockPayload",
                  //         { log: "blockPayload" },
                  //         { getter: "cause" },
                  //         { getter: "id" },
                  //         { "==": "BlockPayloadCauseGameEvent" },
                  //       ],
                  //     },
                  //     {},
                  //     { error: "事件必須是BlockPayloadCauseGameEvent" },
                  //   ],
                  // },
                  // pass2: {
                  //   if: [
                  //     {
                  //       "->": [
                  //         "$in.blockPayload",
                  //         { log: "blockPayload" },
                  //         { getter: "cause" },
                  //         { getter: "gameEvent" },
                  //         { getter: "id" },
                  //         { "==": "プレイした場合" },
                  //       ],
                  //     },
                  //     {},
                  //     { error: "事件必須是プレイした場合" },
                  //   ],
                  // },
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
