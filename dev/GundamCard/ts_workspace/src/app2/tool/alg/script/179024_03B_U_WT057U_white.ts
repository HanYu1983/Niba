import {
  CardPrototype,
  CardTextState,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";
import { BattleBonus, CardText } from "../../tool/basic/basic";
import { getIDSeq } from "../../../../tool/helper";
import { getConditionMacro } from "./getConditionMacro";
import { ActionAddGlobalCardText } from "../../tool/basic/action";

// 179024_03B_U_WT057U_white
// U
// SEED
// アストレイ ブルーフレーム セカンドL
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］　〔１〕：クロスウェポン［アストレイ系］
// （戦闘フェイズ）〔２〕：「特徴：アストレイ系」を持つ自軍ユニット１枚は、ターン終了時まで、戦闘力に＋４を振り分けて得る。（注：＋４／±０／±０や、＋１／±０／＋３のように振り分けできる）

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム セカンドL",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "ユニット",
  color: "白",
  rollCost: ["白", "白", null, null, null],
  battlePoint: [5, 2, 4],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(2, "白")],
    }),
    createTokuSyuKouKaText(["改装", "ブルーフレーム系"], {}),
    getCardTextMacro({
      id: "PlayText",
      description:
        "（戦闘フェイズ）〔２〕：「特徴：アストレイ系」を持つ自軍ユニット１枚は、ターン終了時まで、戦闘力に＋４を振り分けて得る。（注：＋４／±０／±０や、＋１／±０／＋３のように振り分けできる）",
      timing: ["戦闘フェイズ"],
      additionalRequire: [
        createRollCostRequire(2, null),
        {
          id: "RequireTarget",
          targets: {
            "「特徴：アストレイ系」を持つ自軍ユニット１枚": {
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
                x: {
                  id: "カード",
                  value: "「特徴：アストレイ系」を持つ自軍ユニット１枚",
                },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: {
                  id: "カード",
                  value: "「特徴：アストレイ系」を持つ自軍ユニット１枚",
                },
                y: ["ユニット"],
              }),
              getConditionMacro({
                id: "變量x的特徵包含於y",
                x: {
                  id: "カード",
                  value: "「特徴：アストレイ系」を持つ自軍ユニット１枚",
                },
                y: ["アストレイ系"],
              }),
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "「特徴：アストレイ系」を持つ自軍ユニット１枚",
              target: "「特徴：アストレイ系」を持つ自軍ユニット１枚",
            },
          ],
        },
      ],
      feedbackBlock: {
        require: {
          id: "RequireTarget",
          targets: {
            "戦闘力に＋４を振り分け": {
              id: "戦闘修正",
              value: [],
              valueLengthInclude: [1],
              tip: {
                id: "戦闘修正",
                value: [
                  ...listBattleBonusOrder([4, 0, 0]),
                  ...listBattleBonusOrder([3, 1, 0]),
                  ...listBattleBonusOrder([2, 2, 0]),
                  ...listBattleBonusOrder([2, 1, 1]),
                ],
              },
            },
          },
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionJsonfp",
                program: {
                  output: <ActionAddGlobalCardText>{
                    id: "ActionAddGlobalCardText",
                    cards: {
                      id: "カード",
                      value: "「特徴：アストレイ系」を持つ自軍ユニット１枚",
                    },
                    cardStateID:
                      "ターン終了時まで、戦闘力に＋４を振り分けて得る",
                    cardTextState: {
                      id: "カードのテキスト",
                      value: [
                        {
                          id: "",
                          enabled: true,
                          cardText: {
                            id: "CardTextCustom",
                            description: "",
                            customID: {
                              id: "CardTextCustomIDBattleBonus",
                              battleBonus: {
                                "->": [
                                  "$in.blockPayload",
                                  { getter: "require" },
                                  { getter: "targets" },
                                  { getter: "戦闘力に＋４を振り分け" },
                                  { getter: "value" },
                                  { getter: 0 },
                                ],
                              },
                            },
                          },
                        },
                        {
                          // @ts-ignore
                          def: {
                            id: "",
                            enabled: true,
                            cardText: getCardTextMacro({
                              id: "ターン終了時までの場合",
                              feedbackAction: [
                                {
                                  id: "ActionDeleteGlobalCardText",
                                  cardStateID:
                                    "ターン終了時まで、戦闘力に＋４を振り分けて得る",
                                },
                              ],
                            }),
                          },
                        },
                      ],
                    },
                  },
                },
              },
            ],
          },
        ],
      },
    }),
    createTokuSyuKouKaText(["クロスウェポン", "アストレイ系"], {
      cost: 1,
    }),
  ],
};

function listBattleBonusOrder([a, b, c]: BattleBonus): BattleBonus[] {
  return [
    // [a, b, c],
    // [a, c, b],
    // [b, a, c],
    // [b, c, a],
    // [c, a, b],
    // [c,b,a]

    [a, b, c],
    [b, a, c],
    [c, b, a],
    [a, c, b],
  ];
}

module.exports = prototype;
