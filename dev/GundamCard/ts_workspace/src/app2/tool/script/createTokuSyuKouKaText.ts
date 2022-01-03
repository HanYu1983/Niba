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
