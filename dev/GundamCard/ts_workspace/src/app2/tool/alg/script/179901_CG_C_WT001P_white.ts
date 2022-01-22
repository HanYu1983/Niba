import { getCustomFunctionString } from "../../../../tool/helper";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createPlayCardText } from "./createPlayCardText";

// 179901_CG_C_WT001P_white
// アークエンジェル出航
// 補強
// （自軍配備フェイズ）：「供給」を持つ自軍カード１枚をロールする。その場合、カード２枚を引く。

let _idSeq = 0
const prototype: CardPrototype = {
  title: "アークエンジェル出航",
  characteristic: "補強".split("　"),
  category: "コマンド",
  color: "白",
  rollCost: ["白", null],
  texts: [],
};

const playCardAsGText = createPlayCardText(prototype, { isG: true });
const playCardText = createPlayCardText(prototype, {
  command: {
    description: "（自軍配備フェイズ）：「供給」を持つ自軍カード１枚をロールする。その場合、カード２枚を引く。",
    timing: ["自軍", "配備フェイズ"],
    require: {
      id: "RequireTarget",
      targets: {
        "「供給」を持つ自軍カード１枚": {
          id: "カード",
          value: [],
          valueLengthInclude: [1]
        }
      },
      condition: {
        id: "ConditionAnd",
        and: [
          {
            id: "ConditionComparePlayer",
            value: [
              {
                id: "プレーヤー", value: { path: [{ id: "カード", value: "「供給」を持つ自軍カード１枚" }, "的「コントローラー」"] }
              },
              "==",
              {
                id: "プレーヤー", value: { path: [{ id: "自軍" }] }
              },
            ]
          },
          // TODO: targetText
          {
            id: "ConditionCompareString",
            value: [
              {
                id: "字串", value: { path: [{ id: "カード", value: "「供給」を持つ自軍カード１枚" }, "的「特徴」"] }
              },
              "hasToken",
              {
                id: "字串", value: ["供給"]
              },
            ]
          },
        ]
      },
      action: [{ id: "ActionSetTarget", source: "「供給」を持つ自軍カード１枚", target: "「供給」を持つ自軍カード１枚" }]
    },
    block: {
      feedback: [
        {
          id: "FeedbackAction",
          action: [
            { id: "ActionRoll", cards: { id: "カード", value: "「供給」を持つ自軍カード１枚" } },
            { id: "ActionDraw", count: 2 }
          ]
        }
      ]
    }
  }
});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
