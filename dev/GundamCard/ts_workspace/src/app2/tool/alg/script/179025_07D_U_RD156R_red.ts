import {
  CardPrototype,
  GameContext,
  DEFAULT_CARD_PROTOTYPE,
  DEFAULT_CARD_STATE,
} from "../../tool/basic/gameContext";
import { createPlayCardText } from "./createPlayCardText";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { CardText } from "../../tool/basic/basic";
import { recurRequire, Require } from "../../tool/basic/blockPayload";
import { Condition } from "../../tool/basic/condition";
import { GameEventOnManualEventCustomID } from "../gameEventOnManualEventCustomID";

// 179025_07D_U_RD156R_red
// R
// F91
// ガンダムF91
// F91系　MS　レジェンド　専用｢シーブック・アノー｣
// クイック　高機動　〔１〕：改装〔F91系〕
// 『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。
// 『起動』：このカードが場に出た場合、ユニットとキャラ以外の敵軍カード１枚のプレイを無効にし、そのカードを廃棄する。

// query時發送事件
// 起動能力聽事件改變旗標
// 恒常或常駐能力能力判斷旗標狀態後加入全域臨時效果
// query最後會在全域臨時效果的影響下回傳結果

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "F91",
  characteristic: "F91系　MS　レジェンド　専用｢シーブック・アノー｣".split("　"),
  category: "ユニット",
  color: "赤",
  rollCost: ["赤", "赤", null, null, null],
};

let playCardPlus = createPlayCardText(prototype, {
  description: "合計国力－３してプレイできる",
  block: {
    feedback: [
      {
        id: "FeedbackAction",
        action: [
          {
            id: "ActionSetFlag",
            flag: {
              id: "字串",
              value: ["合計国力－３してプレイ"],
            },
            cards: {
              id: "カード",
              value: { path: [{ id: "このカード" }] },
            },
          },
        ],
      },
    ],
  },
});
playCardPlus = {
  ...playCardPlus,
  block: {
    ...playCardPlus.block,
    ...(playCardPlus.block.require
      ? {
          require: recurRequire(playCardPlus.block.require, (r): Require => {
            if (r.id != "RequireTarget") {
              return r;
            }
            if (r.key != "靜態替換_將要「プレイ」的卡") {
              return r;
            }
            if (r.condition?.id != "ConditionAnd") {
              throw new Error("must be ConditionAnd");
            }
            const nextConditionAnd = r.condition.and.map((cond): Condition => {
              if (cond.id != "ConditionCompareNumber") {
                return cond;
              }
              return {
                id: "ConditionCompareNumber",
                value: [
                  {
                    id: "數字",
                    value: {
                      path: [
                        {
                          id: "數字",
                          value: {
                            path: [
                              { id: "カード", value: "將要「プレイ」的卡" },
                              "的「合計国力」",
                            ],
                          },
                        },
                        "-",
                        {
                          id: "數字",
                          value: [3],
                        },
                      ],
                    },
                  },
                  "<=",
                  {
                    id: "數字",
                    value: {
                      path: [
                        {
                          id: "プレーヤー",
                          value: {
                            path: [
                              {
                                id: "カード",
                                value: "將要「プレイ」的卡",
                              },
                              "的「コントローラー」",
                            ],
                          },
                        },
                        "的「合計国力」",
                      ],
                    },
                  },
                ],
              };
            });
            return {
              ...r,
              condition: {
                ...r.condition,
                and: nextConditionAnd,
              },
            };
          }),
        }
      : null),
  },
};

const texts: CardText[] = [
  createTokuSyuKouKaText(["クイック"], {}),
  createTokuSyuKouKaText(["高機動"], {}),
  createTokuSyuKouKaText(["改装", "F91系"], { cost: 1 }),
  createPlayCardText(prototype, { isG: true }),
  createPlayCardText(prototype, {}),
  {
    id: "恒常",
    description:
      "『恒常』：このカードは、合計国力－３してプレイできる。その場合、カット終了時に、このカードを廃棄する。",
    texts: [
      playCardPlus,
      {
        id: "自動型",
        category: "起動",
        description: "その場合、カット終了時に、このカードを廃棄する。",
        block: {
          require: {
            id: "RequireTarget",
            targets: {},
            condition: {
              id: "ConditionAnd",
              and: [
                // 如果旗標存在
                {
                  id: "ConditionCompareGameEventOnManualEvent",
                  value: [
                    {
                      id: "手動事件發生時",
                      value: { path: [{ id: "觸發這個事件的手動事件" }] },
                    },
                    "==",
                    {
                      id: "手動事件發生時",
                      value: [
                        {
                          id: "手動事件發生時",
                          customID: {
                            id: "カット終了時",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          feedback: [
            {
              id: "FeedbackAction",
              action: [
                // set flag
              ],
            },
          ],
        },
      },
    ],
  },
];

module.exports = {
  ...prototype,
  texts: texts,
};

// 179029_B3C_U_RD198N_red
// N
// UC
// ギラ・ズール（アンジェロ・ザウパー機）
// ギラ・ズール系　MS　専用「アンジェロ・ザウパー」
// 『常駐』：自軍手札、または自軍ハンガーにある、「特徴：シナンジュ系」を持つ全てのユニットは、合計国力－１を得る。
// 『起動』：自軍コマンドがプレイされて解決された場合、敵軍ユニット１枚に３ダメージを与える。
