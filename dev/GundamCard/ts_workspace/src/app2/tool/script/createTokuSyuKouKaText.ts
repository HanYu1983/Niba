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
                    // 或是
                    // 當Z出場時，獲得「在詢問卡片合計國力並原因為play時，合計國力當力-3. 回合結束時移除」的效果
                    // 『恒常』：このカードは、「特徴：Ζ系」を持つ自軍ユニットが場に出たターン中にプレイする場合、合計国力－３してプレイできる。

                    // 『恒常』：このカードが自軍ジャンクヤードにある状態で、「特徴：陸戦型ガンダム系」を持つ自軍ユニットが場に出た場合、〔青１〕を支払う事ができる。その場合、このカードを自軍配備エリアにロール状態で出す。

                    // 處理恒常，起動
                    // 遊戲一開始就將所有能力加入block到時間0的位置
                    // 每次事件來時，就重設cause中的事件並且doBlockRequire在所有時間為0的block
                    // doBlockRequire成功的就立刻執行doBlockFeedback

                    // 處理常駐
                    // 遊戲一開始就將所有恒常能力加入block到時間0的位置
                    // 不必等事件。可以隨時doBlockRequire
                    // doBlockRequire成功的就立刻執行doBlockFeedback
                    // 但要注意：feedback的效果是重覆執行多次也沒關係的。比如，加入全場效果時要帶入唯一的ID
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
