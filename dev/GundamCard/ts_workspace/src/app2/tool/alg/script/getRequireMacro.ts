import {
  createRollCostRequire,
  Require,
  RequireTarget,
} from "../../tool/basic/blockPayload";

type RequireMacro1 = { id: "このカードが戦闘エリアにいる場合" };
type RequireMacro2 = { id: "roll" };
export type RequireMacro = RequireMacro1 | RequireMacro2;

export function getRequireMacro(macro: RequireMacro): Require {
  switch (macro.id) {
    case "roll":
      return {
        id: "RequireTarget",
        targets: {},
        condition: {
          id: "ConditionCompareBoolean",
          value: [
            {
              id: "布林",
              value: {
                path: [
                  { id: "カード", value: { path: [{ id: "このカード" }] } },
                  "是直立的？",
                ],
              },
            },
            "==",
            {
              id: "布林",
              value: [true],
            },
          ],
        },
        action: [
          {
            id: "ActionRoll",
            cards: { id: "カード", value: { path: [{ id: "このカード" }] } },
          },
        ],
      };
    case "このカードが戦闘エリアにいる場合":
      return {
        id: "RequireTarget",
        targets: {},
        condition: {
          id: "ConditionAnd",
          and: [
            {
              id: "ConditionCompareBaSyou",
              value: [
                {
                  id: "場所",
                  value: {
                    path: [
                      { id: "カード", value: { path: [{ id: "このカード" }] } },
                      "的「場所」",
                    ],
                  },
                },
                "in",
                {
                  id: "場所",
                  value: [
                    {
                      id: "RelatedBaSyou",
                      value: ["自軍", "戦闘エリア（左）"],
                    },
                    {
                      id: "RelatedBaSyou",
                      value: ["自軍", "戦闘エリア（右）"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
  }
}
