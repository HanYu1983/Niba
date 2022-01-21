import { getCustomFunctionString } from "../../../../tool/helper";
import { CardPrototype, GameContext } from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { createPlayCardText } from "./createPlayCardText";
import { ManualEventCustomID } from "../manualEventCustomID";

// 179030_11E_C_BL076S_blue
// S
// CCA
// 理想の激突
// 破壊　装弾
// 『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、自軍ユニット１枚の上に＋１／＋１／＋１コイン２個を乗せる。
// （敵軍防御ステップ）：交戦中の自軍ユニットがいる場合、交戦中ではない、全てのユニットを破壊する。

const prototype: CardPrototype = {
  title: "理想の激突",
  characteristic: "破壊　装弾".split("　"),
  category: "コマンド",
  color: "青",
  rollCost: ["青", null, null],
  texts: [
    {
      id: "自動型",
      category: "恒常",
      description:
        "『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、自軍ユニット１枚の上に＋１／＋１／＋１コイン２個を乗せる。",
      block: {
        require: {
          id: "RequireTarget",
          targets: {},
          condition: {
            id: "ConditionCompareCard",
            value: [
              { id: "カード", value: { path: [{ id: "このカード" }] } },
              "==",
              { id: "カード", value: { path: [{ id: "「効果」解決時", value: { path: [{ id: "觸發這個事件的「効果」" }] } }, "的「カード」"] } }
            ]
          }
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddBlock",
                type: "立即",
                block: {
                  contextID: "理想の激突",
                  isOption: true,
                  require: {
                    id: "RequireAnd",
                    and: [
                      {
                        id: "RequireTarget",
                        targets: {
                          cardA: {
                            id: "カード",
                            value: [],
                            valueLengthInclude: [1]
                          },
                        },
                        condition: {
                          id: "ConditionAnd",
                          and: [
                            {
                              id: "ConditionComparePlayer",
                              value: [
                                {
                                  id: "プレーヤー",
                                  value: {
                                    path: [{ id: "カード", value: "cardA" }, "的「コントローラー」"]
                                  }
                                },
                                "==",
                                {
                                  id: "プレーヤー",
                                  value: {
                                    path: [{ id: "カード", value: { path: [{ id: "このカード" }] } }, "的「コントローラー」"]
                                  }
                                }
                              ]
                            },
                            {
                              id: "ConditionCompareRole",
                              value: [
                                {
                                  id: "「カード」的角色",
                                  triggerGameEvent: { id: "手動事件發生時", customID: { id: "「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合" } as ManualEventCustomID },
                                  value: {
                                    path: [{ id: "カード", value: "cardA" }, "當成横置裝彈G時的角色"]
                                  }
                                },
                                "==",
                                {
                                  id: "「カード」的角色",
                                  value: ["グラフィック"]
                                }
                              ]
                            },
                            {
                              id: "ConditionCompareString",
                              value: [
                                {
                                  id: "字串",
                                  value: {
                                    path: [
                                      { id: "カード", value: "cardA" },
                                      "的「特徴」",
                                    ],
                                  },
                                },
                                "hasToken",
                                {
                                  id: "字串",
                                  value: ["装弾"],
                                },
                              ],
                            },
                          ],
                        },
                        action: [
                          {
                            id: "ActionRoll",
                            cards: {
                              id: "カード",
                              value: "cardA",
                            },
                          },
                        ],
                      },
                      {
                        id: "RequireTarget",
                        targets: {
                          cardB: {
                            id: "カード",
                            value: [],
                          },
                        },
                        action: [
                          {
                            id: "ActionSetTarget",
                            source: "cardB",
                            target: "cardB",
                          },
                        ],
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackAction",
                      action: [
                        // TODO: add coin
                        {
                          id: "ActionAddEffect",
                          effect: {
                            id: "GameEffectCustom",
                            customID: "＋１／＋１／＋１コイン２個を乗せる",
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

const playCardAsGText = createPlayCardText(prototype, { isG: true });

// 交戦中ではない、全てのユニット
const _main: TargetTypeCustomFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload
): TargetType => {
  console.log("JIBA");
  return {
    id: "カード",
    value: [],
  };
};
const playCardText = createPlayCardText(prototype, {
  command: {
    description:
      "（敵軍防御ステップ）：交戦中の自軍ユニットがいる場合、交戦中ではない、全てのユニットを破壊する。",
    timing: ["敵軍", "防御ステップ"],
    block: {
      require: {
        id: "RequireAnd",
        and: [
          {
            id: "RequireCustom",
            customID: {
              id: "交戦中の自軍ユニットがいる場合",
            },
          },
          {
            id: "RequireTarget",
            targets: {
              "交戦中ではない、全てのユニット": {
                id: "腳本",
                value: getCustomFunctionString(_main),
              },
            },
            action: [
              {
                id: "ActionDestroy",
                cards: {
                  id: "カード",
                  value: "交戦中ではない、全てのユニット",
                },
              },
            ],
          },
        ],
      },
    },
  },
});

module.exports = {
  ...prototype,
  texts: [...prototype.texts, playCardAsGText, playCardText],
};
