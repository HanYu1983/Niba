import { TokuSyuKouKa } from "../model/basic";
import { RequireCustomID } from "../model/gameContext/doRequireCustom";
import { Text } from ".";
import { wrapRequireKey } from "../model/scriptContext";

let _seqID = 0;
export function createTokuSyuKouKaText(
  toku: TokuSyuKouKa,
  options: { cost?: number }
): Text {
  switch (toku[0]) {
    case "供給":
      const [title] = toku;
      return {
        text: `[${options.cost || 0}]:${title}`,
        category: {
          id: "使用型",
          timing: ["自軍", "攻撃ステップ"],
        },
        block: {
          require: wrapRequireKey({
            id: "RequireAnd",
            and: [
              {
                id: "RequireTarget",
                targets: [null],
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCardIsPlayerSide",
                      playerSide: "自軍",
                    },
                    {
                      id: "ConditionCardIsRole",
                      role: "ユニット",
                    },
                    //TODO: not this card
                  ],
                },
              },
            ],
          }),
          feedback: [
            {
              id: "FeedbackTargetAction",
              targetID: "cardA",
              action: [
                {
                  id: "ActionReroll",
                },
              ],
            },
          ],
        },
      };
    case "サイコミュ": {
      const [title, damage] = toku;
      return {
        text: `[${options.cost || 0}]:${title}(${damage})`,
        category: {
          id: "使用型",
          timing: ["防御ステップ"],
        },
        block: {
          require: wrapRequireKey({
            id: "RequireAnd",
            and: [
              {
                id: "RequireTarget",
                targets: [],
                action: [{ id: "ActionConsumeG", count: options.cost || 0 }],
              },
              {
                id: "RequireCustom",
                customID: {
                  id: "このカードと同じエリアに、「特徴:x」を持つ自軍キャラがいる",
                  x: "NT",
                } as RequireCustomID,
              },
              {
                id: "RequireTarget",
                targets: [null],
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCardIsPlayerSide",
                      playerSide: "敵軍",
                    },
                    {
                      id: "ConditionCardIsRole",
                      role: "ユニット",
                    },
                    // 交戦中
                    {
                      id: "ConditionCardIsBattle",
                    },
                  ],
                },
                action: [{ id: "ActionSetTarget", targetID: "cardA" }],
              },
            ],
          }),
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                feedback: [
                  {
                    id: "FeedbackTargetAction",
                    targetID: "cardA",
                    action: [{ id: "ActionUnitDamage", value: damage }],
                  },
                ],
              },
            },
          ],
        },
      };
    }
    case "範囲兵器": {
      const [title, damage] = toku;
      return {
        text: `[${options.cost || 0}]:${title}(${damage})`,
        category: {
          id: "使用型",
          timing: ["ダメージ判定ステップ"],
        },
        block: {
          contextID: `createTokuSyuKouKaText_${_seqID++}`, // TODO uuid
          require: wrapRequireKey({
            id: "RequireAnd",
            and: [
              {
                id: "RequireTarget",
                targets: [],
                action: [{ id: "ActionConsumeG", count: options.cost || 0 }],
              },
              {
                id: "RequireTarget",
                targets: [null],
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionCardIsPlayerSide",
                      playerSide: "敵軍",
                    },
                    {
                      id: "ConditionCardIsRole",
                      role: "ユニット",
                    },
                    {
                      id: "ConditionCardIsBattle",
                    },
                    {
                      id: "ConditionCardPropertyCompare",
                      value: ["防御力", "<=", damage],
                    },
                  ],
                },
                action: [{ id: "ActionSetTarget", targetID: "cardA" }],
              },
            ],
          }),
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                feedback: [
                  {
                    id: "FeedbackTargetAction",
                    targetID: "cardA",
                    action: [
                      {
                        id: "ActionDestroy",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      };
    }
    case "改装": {
      const [title, tokuTyou] = toku;
      return {
        text: `[${options.cost || 0}]:${title}(${tokuTyou})`,
        category: {
          id: "使用型",
          timing: ["戦闘フェイズ"],
        },
        block: {
          require: wrapRequireKey({
            id: "RequireAnd",
            and: [
              {
                id: "RequireTarget",
                targets: [],
                action: [{ id: "ActionConsumeG", count: options.cost || 0 }],
              },
              {
                id: "RequireTarget",
                targets: [{ id: "このカード" }],
                action: [
                  {
                    id: "ActionSetTarget",
                    targetID: "cardA",
                  },
                ],
              },
              {
                id: "RequireTarget",
                targets: [null],
                condition: {
                  id: "ConditionAnd",
                  and: [
                    {
                      id: "ConditionOr",
                      or: [
                        {
                          id: "ConditionCardOnBaSyou",
                          baSyou: {
                            id: "RelatedBaSyou",
                            value: ["自軍", "手札"],
                          },
                        },
                        {
                          id: "ConditionCardOnBaSyou",
                          baSyou: {
                            id: "RelatedBaSyou",
                            value: ["自軍", "ハンガー"],
                          },
                        },
                      ],
                    },
                    {
                      id: "ConditionCardOnCategory",
                      category: "ユニット",
                    },
                    {
                      id: "ConditionCardHasTokuTyou",
                      value: tokuTyou,
                    },
                    // TODO: 合計國力 <= 自軍G的數量
                    // TODO: 詢問自軍G數量時還要帶入詢問原因（比如：為了改裝）

                    // 下一行可以解釋成：獲得「在詢問自軍G數量並原因為改裝時，自軍G的數量當成+1」的效果
                    // 『常駐』：このカードは、このカードの「改装」の効果において自軍Gとしても扱う事ができる。

                    // 下一行可以解釋成：獲得「在詢問卡片合計國力並原因為play時，帶入卡的條件為（自軍手札、レジェンド、ユニット）時，合計國力當成-1」的效果
                    // 『常駐』：自軍手札にある、「特徴：レジェンド」を持つ全てのユニットは、合計国力－１してプレイできる。（注：合計国力はマイナスの値にはならない）

                    // 179019_B1A_U_BL111R_blue
                    // 下一行代表毎張卡都要實做事件。當指定的卡出場時，加一個flag。在詢問時判斷有沒有flag來回傳效果
                    // 『恒常』：このカードは、「特徴：Ζ系」を持つ自軍ユニットが場に出たターン中にプレイする場合、合計国力－３してプレイできる。

                    // 『恒常』：このカードが自軍ジャンクヤードにある状態で、「特徴：陸戦型ガンダム系」を持つ自軍ユニットが場に出た場合、〔青１〕を支払う事ができる。その場合、このカードを自軍配備エリアにロール状態で出す。

                    // 處理常駐能力
                    // 詢問時重新計算
                    // 1. 問每張卡的常駐技能，集合成所有效果陣列
                    // 2. 用1的結果問問題（比如自軍G數量，卡片合計國力，卡片內文）
                  ],
                },
                action: [
                  { id: "ActionSetFace", faceDown: false },
                  { id: "ActionSetTarget", targetID: "cardB" },
                ],
              },
              {
                id: "RequireTarget",
                targets: [],
                action: [
                  {
                    id: "ActionCreateArrayFromSourceTargetID",
                    sourceTargetID: ["cardA", "cardB"],
                    targetID: "cardAB",
                  },
                ],
              },
            ],
          }),
          feedback: [
            {
              id: "FeedbackTargetAction",
              targetID: "cardAB",
              action: [
                {
                  id: "ActionOKiKaeRu",
                },
              ],
            },
          ],
        },
      };
    }
    default: {
      return {
        text: "",
        category: {
          id: "使用型",
          timing: ["攻撃ステップ"],
        },
        block: {},
      };
    }
  }
}
