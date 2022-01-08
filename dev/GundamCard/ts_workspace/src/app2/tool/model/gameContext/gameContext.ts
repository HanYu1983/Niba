import {
  GameEvent,
  TargetType,
  CardText,
  Timing,
  TIMING_CHART,
  TokuSyuKouKa,
  CardCategory,
  CardColor,
} from "../basic";
import { DEFAULT_TABLE, Table } from "../../../../tool/table";
import { BlockPayload, Require } from "../blockPayload";

export type PlayerState = {
  id: string;
  turn: number;
  playGCount: number;
  confirmPhase: boolean;
};

export type CardTextState = {
  id: string;
  enabled: boolean;
  cardText: CardText;
};

export type CardPrototype = {
  title: string;
  characteristic: string[];
  color: CardColor;
  category: CardCategory;
  texts: CardText[];
};

export const DEFAULT_CARD_PROTOTYPE: CardPrototype = {
  title: "",
  characteristic: [],
  color: "白",
  category: "ユニット",
  texts: [],
};

export type CardState = {
  id: string;
  live: number;
  destroy: boolean;
  setGroupID: string;
  memory: any;
  cardTextStates: CardTextState[];
  prototype: CardPrototype;
};

export const DEFAULT_CARD_STATE: CardState = {
  id: "",
  live: 0,
  destroy: false,
  setGroupID: "",
  memory: {},
  cardTextStates: [],
  prototype: DEFAULT_CARD_PROTOTYPE,
};

export type Vars = {
  targets: { [key: string]: TargetType };
};

export type GameEffectCustom = {
  id: "GameEffectCustom";
  customID: any;
};

export type GameEffect = GameEffectCustom;

export type GameEffectState = {
  id: string;
  effect: GameEffect;
};

export type GameState = {
  table: Table;
  cardState: CardState[];
  timing: Timing;
  playerState: PlayerState[];
  activePlayerID: string | null;
  effects: GameEffectState[];
};

export type GameContext = {
  varsPool: { [key: string]: Vars };
  // 指令效果。從這裡取得玩家可用的指令
  commandEffect: BlockPayload[];
  // 立即效果。玩家必須立即一個一個進行處理
  immediateEffect: BlockPayload[];
  // 堆疊效果。每次只處理第一個代表top的block
  stackEffect: BlockPayload[];
  gameState: GameState;
};

export const DEFAULT_GAME_CONTEXT: GameContext = {
  varsPool: {},
  gameState: {
    effects: [],
    table: DEFAULT_TABLE,
    cardState: [
      {
        ...DEFAULT_CARD_STATE,
        cardTextStates: [
          {
            id: "",
            enabled: true,
            cardText: {
              id: "使用型",
              timing: ["常時"],
              description: "play unit",
              block: {
                contextID: `createPlayUnitCardBlock_0`,
                require: {
                  id: "RequireAnd",
                  and: [
                    // 判斷有沒有快速
                    {
                      id: "RequireSiYouTiming",
                      timing: ["自軍", "配備フェイズ"],
                    },
                  ],
                },
                feedback: [
                  {
                    id: "FeedbackAction",
                    action: [
                      {
                        id: "ActionAddBlock",
                        type: "指令",
                        block: {
                          require: {
                            id: "RequireAnd",
                            and: [
                              // プレイの宣告
                              {
                                id: "RequireTarget",
                                targets: {
                                  playCard: {
                                    id: "カード",
                                    cardID: [null],
                                  },
                                },
                                action: [
                                  {
                                    id: "ActionSetFace",
                                    cards: "playCard",
                                    faceDown: {
                                      id: "TargetTypeYesNo",
                                      boolean: false,
                                    },
                                  },
                                  {
                                    id: "ActionSetTarget",
                                    source: "playCard",
                                    target: "playCard",
                                  },
                                ],
                              },
                              //「対象」の指定、コストの支払い
                            ],
                          },
                          feedback: [
                            {
                              id: "FeedbackAction",
                              action: [
                                {
                                  id: "ActionAddBlock",
                                  type: "堆疊",
                                  // 場に出る効果。如果使用的是指令，則不出場並廢棄，若有效果就加到require
                                  block: {
                                    feedback: [
                                      {
                                        id: "FeedbackAction",
                                        action: [
                                          {
                                            id: "ActionMoveCardToPosition",
                                            cards: "playCard",
                                            baSyou: {
                                              id: "場所",
                                              baSyou: {
                                                id: "RelatedBaSyou",
                                                value: ["自軍", "配備エリア"],
                                              },
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
                  },
                ],
              },
            },
          },
          {
            id: "",
            enabled: true,
            cardText: {
              id: "自動型",
              category: "起動",
              description:
                "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。",
              block: {
                feedback: [
                  {
                    id: "FeedbackAction",
                    action: [
                      {
                        id: "ActionAddBlock",
                        type: "立即",
                        block: {
                          require: {
                            id: "RequireAnd",
                            and: [
                              // 〔白２〕を支払う事ができる
                              {
                                id: "RequireTarget",
                                targets: {
                                  cards: {
                                    id: "カード",
                                    cardID: [null, null],
                                  },
                                  color: {
                                    id: "カードの色",
                                    color: "白",
                                  },
                                },
                                action: [
                                  {
                                    id: "ActionConsumeG",
                                    cards: "cards",
                                    color: "color",
                                  },
                                ],
                              },
                              {
                                id: "RequireTarget",
                                targets: {
                                  "５以下の防御力を持つ敵軍ユニット１枚": {
                                    id: "カード",
                                    cardID: [null],
                                  },
                                },
                                condition: {
                                  id: "ConditionAnd",
                                  and: [
                                    {
                                      id: "ConditionCardIsPlayerSide",
                                      source:
                                        "５以下の防御力を持つ敵軍ユニット１枚",
                                      playerSide: "敵軍",
                                    },
                                    {
                                      id: "ConditionCardPropertyCompare",
                                      source:
                                        "５以下の防御力を持つ敵軍ユニット１枚",
                                      value: ["防御力", "<=", 5],
                                    },
                                  ],
                                },
                                action: [
                                  {
                                    id: "ActionDestroy",
                                    cards:
                                      "５以下の防御力を持つ敵軍ユニット１枚",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            id: "",
            enabled: true,
            cardText: {
              id: "特殊型",
              description: ["PS装甲"],
              texts: [
                // play出場時重置. add block到起動列表讓玩家知道效果, 起動列表一有值就要讓玩一個一個進行處理
                {
                  id: "自動型",
                  description: "play出場時重置",
                  category: "起動",
                  block: {},
                },
                // 出現在戰鬥區時，若部隊中沒有供給或補給時將flag設為true
                {
                  id: "自動型",
                  description:
                    "出現在戰鬥區時，若部隊中沒有供給或補給時將flag設為true",
                  category: "起動",
                  block: {},
                },
                // 當重整部隊時，部隊中有供給或補給時，將FLAG設為FLASE
                // 回合開始時，若FLAG為true時回手札
              ],
            },
          },
        ],
      },
    ],
    timing: TIMING_CHART[0],
    playerState: [],
    activePlayerID: null,
  },
  commandEffect: [],
  immediateEffect: [],
  stackEffect: [],
};

export function mapEffect(
  ctx: GameContext,
  doF: (effect: BlockPayload) => BlockPayload
): GameContext {
  return {
    ...ctx,
    immediateEffect: ctx.immediateEffect.map(doF),
    commandEffect: ctx.commandEffect.map(doF),
    stackEffect: ctx.stackEffect.map(doF),
  };
}

export function reduceEffect<T>(
  ctx: GameContext,
  doF: (init: T, effect: BlockPayload) => T,
  init: T
): T {
  return [
    ...ctx.immediateEffect,
    ...ctx.commandEffect,
    ...ctx.stackEffect,
  ].reduce(doF, init);
}
