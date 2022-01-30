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

// 179029_B3C_CH_WT102R_white
// ルイン・リー
// 男性　子供　別名「マスク」
// 高機動
// 『起動』：自軍「マニィ・アンバサダ」が場に出た、または自軍「マニィ・アンバサダ」がいる状態で、このカードが場に出た場合、G以外の敵軍カード１枚を破壊する。
const varCtxID1 = "varCtxID1";
const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "ルイン・リー",
  characteristic: "男性　子供　別名「マスク」".split("　"),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", null, null, null, null],
  battlePoint: [2, 2, 2],
  texts: [
    createTokuSyuKouKaText(["高機動"], {}),
    getCardTextMacro({ id: "PlayG" }).cardText,
    getCardTextMacro({
      id: "PlayCharacter",
      varCtxID: varCtxID1,
      additionalRequire: [
        createRollCostRequire(1, "白"),
        {
          id: "RequireTarget",
          targets: {
            G以外の敵軍カード１枚: {
              id: "カード",
              value: [],
              valueLengthInclude: [1],
            },
          },
          condition: {
            id: "ConditionAnd",
            and: [
              getCardTextMacro({
                id: "變量x的是y軍",
                x: { id: "カード", value: "G以外の敵軍カード１枚" },
                y: "敵軍",
              }).condition,
              {
                id: "ConditionCompareRole",
                value: [
                  {
                    id: "「カード」的角色",
                    value: {
                      path: [
                        { id: "カード", value: "G以外の敵軍カード１枚" },
                        "的角色",
                      ],
                    },
                  },
                  "!=",
                  {
                    id: "「カード」的角色",
                    value: ["グラフィック"],
                  },
                ],
              },
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "G以外の敵軍カード１枚",
              target: "G以外の敵軍カード１枚",
            },
          ],
        },
      ],
    }).cardText,
    getCardTextMacro({
      id: "自軍「x」が場に出た場合",
      x: "マニィ・アンバサダ",
      description:
        "『起動』：[自軍「マニィ・アンバサダ」が場に出た]、または自軍「マニィ・アンバサダ」がいる状態で、[このカードが場に出た場合、G以外の敵軍カード１枚を破壊する]。",
      varCtxID: varCtxID1,
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionDestroy",
                cards: {
                  id: "カード",
                  value: "G以外の敵軍カード１枚",
                },
              },
            ],
          },
        ],
      },
    }).cardText,
    getCardTextMacro({
      id: "WhenShowBa",
      description:
        "『起動』：自軍「マニィ・アンバサダ」が場に出た、または[自軍「マニィ・アンバサダ」がいる状態で、このカードが場に出た場合、G以外の敵軍カード１枚を破壊する。]",
      varCtxID: varCtxID1,
      additionalRequire: [
        // TODO: 自軍「マニィ・アンバサダ」がいる状態
      ],
      feedbackBlock: {
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionDestroy",
                cards: {
                  id: "カード",
                  value: "G以外の敵軍カード１枚",
                },
              },
            ],
          },
        ],
      },
    }).cardText,
  ],
};

module.exports = prototype;
