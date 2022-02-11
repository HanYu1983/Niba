import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  GameContext,
} from "../../tool/basic/gameContext";
import {
  BlockPayload,
  createRollCostRequire,
} from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro, VAR_PLAY_CARD } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { RequireTarget } from "../../tool/basic/blockPayload";
import { AbsoluteBaSyou, CardColor } from "../../tool/basic/basic";
import { GameEventOnManualEventCustomID } from "../gameEventOnManualEventCustomID";
import { getJsonfpMacro, INJECT_JSONFP_MACRO } from "./getJsonfpMacro";
import { getCustomFunctionString, getIDSeq } from "../../../../tool/helper";
import { RequireCustomID } from "../../tool/basic/requireCustom";
import { ActionDestroy } from "../../tool/basic/action";
import {
  TargetType,
  TargetTypeScriptFunctionType,
} from "../../tool/basic/targetType";
import { TargetTypeCardCustom } from "../getTargetTypeCardCustom";
// 179030_11E_C_BL076S_blue
// S
// CCA
// 理想の激突
// 破壊　装弾
// 『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、自軍ユニット１枚の上に＋１／＋１／＋１コイン２個を乗せる。
// （敵軍防御ステップ）：交戦中の自軍ユニットがいる場合、交戦中ではない、全てのユニットを破壊する。

const varCtxID1 = `理想の激突_${getIDSeq()}`;

const _allUnitNotBattle: TargetTypeScriptFunctionType = (
  ctx: GameContext,
  blockPayload: BlockPayload,
  targets: { [key: string]: TargetType },
  target: TargetType
) => {
  const allUnitCards = Object.keys(ctx.gameState.table.cardStack)
    .filter((baSyouID) => {
      const baSyou: AbsoluteBaSyou = JSON.parse(baSyouID);
      switch (baSyou.value[1]) {
        case "戦闘エリア（右）":
        case "戦闘エリア（左）":
        case "配備エリア":
          return true;
      }
      return false;
    })
    .filter((baSyouID) => {
      return ctx.gameState.isBattle[baSyouID] == false;
    })
    .flatMap((baSyouID) => ctx.gameState.table.cardStack[baSyouID]);
  return {
    id: "カード",
    value: allUnitCards.map((card) => card.id),
  };
};

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "理想の激突",
  characteristic: "破壊　装弾".split("　"),
  category: "コマンド",
  color: "青",
  rollCost: ["青", null, null],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayCommand",
      description:
        "（敵軍防御ステップ）：交戦中の自軍ユニットがいる場合、交戦中ではない、全てのユニットを破壊する。",
      timing: ["敵軍", "防御ステップ"],
      varCtxID: varCtxID1,
      additionalRequire: [
        createRollCostRequire(1, "青"),
        {
          id: "RequireCustom",
          customID: {
            id: "交戦中のx軍ユニットがいる場合",
            x: "自軍",
          } as RequireCustomID,
        },
        {
          id: "RequireTarget",
          targets: {
            "本来の記述に｢特徴：装弾｣を持つ自軍G１枚": {
              id: "カード",
              value: [],
              valueLengthInclude: [1],
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
                      path: [
                        {
                          id: "カード",
                          value: "本来の記述に｢特徴：装弾｣を持つ自軍G１枚",
                        },
                        "的「コントローラー」",
                      ],
                    },
                  },
                  "==",
                  {
                    id: "プレーヤー",
                    value: {
                      path: [
                        {
                          id: "カード",
                          value: {
                            path: [
                              {
                                id: "このカード",
                              },
                            ],
                          },
                        },
                        "的「コントローラー」",
                      ],
                    },
                  },
                ],
              },
              {
                id: "ConditionCompareRole",
                value: [
                  {
                    id: "「カード」的角色",
                    value: {
                      path: [
                        {
                          id: "カード",
                          value: "本来の記述に｢特徴：装弾｣を持つ自軍G１枚",
                        },
                        "當成横置裝彈G時的角色",
                      ],
                    },
                  },
                  "==",
                  {
                    id: "「カード」的角色",
                    value: ["グラフィック"],
                  },
                ],
              },
              {
                id: "ConditionCompareString",
                value: [
                  {
                    id: "字串",
                    value: {
                      path: [
                        {
                          id: "カード",
                          value: "本来の記述に｢特徴：装弾｣を持つ自軍G１枚",
                        },
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
              id: "ActionSetTarget",
              source: "本来の記述に｢特徴：装弾｣を持つ自軍G１枚",
              target: "本来の記述に｢特徴：装弾｣を持つ自軍G１枚",
            },
          ],
        },
        {
          id: "RequireTarget",
          targets: {
            自軍ユニット１枚: {
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
                x: { id: "カード", value: "自軍ユニット１枚" },
                y: "自軍",
              }),
              getConditionMacro({
                id: "變量x的角色包含於y",
                x: { id: "カード", value: "自軍ユニット１枚" },
                y: ["ユニット"],
              }),
            ],
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "自軍ユニット１枚",
              target: "自軍ユニット１枚",
            },
          ],
        },
        {
          id: "RequireTarget",
          targets: {
            "交戦中ではない、全てのユニット": {
              id: "カード",
              value: {
                path: [
                  { id: "custom" },
                  {
                    id: "交戦中ではない、全てのユニット",
                  } as TargetTypeCardCustom,
                ],
              },
            },
          },
          action: [
            {
              id: "ActionSetTarget",
              source: "交戦中ではない、全てのユニット",
              target: "交戦中ではない、全てのユニット",
            },
          ],
        },
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
                  value: "交戦中ではない、全てのユニット",
                },
              },
            ],
          },
        ],
      },
    }),
    {
      id: "恒常",
      description:
        "『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、自軍ユニット１枚の上に＋１／＋１／＋１コイン２個を乗せる。",
      texts: [
        {
          id: "自動型",
          category: "起動",
          description:
            "『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、自軍ユニット１枚の上に＋１／＋１／＋１コイン２個を乗せる。",
          block: {
            isOption: true,
            contextID: varCtxID1,
            require: {
              id: "RequireTarget",
              targets: {},
              condition: {
                id: "ConditionAnd",
                and: [
                  getConditionMacro({
                    id: "當觸發GameEvent的變量x的id時",
                    x: { id: "解決直後", cardID: "", cardTextID: "" },
                  }),
                  {
                    id: "ConditionJsonfp",
                    program: {
                      ...INJECT_JSONFP_MACRO,
                      ...getJsonfpMacro({ id: "事件的卡是這張卡" }),
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
                      feedback: [
                        {
                          id: "FeedbackAction",
                          action: [
                            {
                              id: "ActionRoll",
                              cards: {
                                id: "カード",
                                value:
                                  "本来の記述に｢特徴：装弾｣を持つ自軍G１枚",
                              },
                            },
                            {
                              id: "ActionAddCoinToCard",
                              cards: {
                                id: "カード",
                                value: "自軍ユニット１枚",
                              },
                              coin: {
                                id: "CoinBattleBonus",
                                battleBonus: [1, 1, 1],
                              },
                              count: 2,
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
    },
  ],
};

module.exports = prototype;
