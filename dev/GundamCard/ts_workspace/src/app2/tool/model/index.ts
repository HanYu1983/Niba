export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

// 場
export type BaKeyword = "戦闘エリア" | "配備エリア";

// 場所
export type BaSyouKeyword =
  | null // プレイされたカード
  | "本国"
  | "捨て山"
  | "Gゾーン"
  | "ジャンクヤード"
  | "手札"
  | "ハンガー"
  | "取り除かれたカード"
  | BaKeyword;

export type AbsoluteBaSyou = {
  id: "AbsoluteBaSyou";
  value: [PlayerID, BaSyouKeyword];
};

export type RelatedBaSyou = {
  id: "RelatedBaSyou";
  value: ["自軍" | "持ち主", BaSyouKeyword];
};

export type BaSyou = AbsoluteBaSyou | RelatedBaSyou;

export type CardCategory =
  | "ユニット"
  | "キャラクター"
  | "コマンド"
  | "オペレーション"
  | "ACE"
  | "グラフィック";

export type CardColor =
  | "緑"
  | "茶"
  | "青"
  | "白"
  | "紫"
  | "黒"
  | "赤"
  | "デュアル";

export type Phase =
  | ["リロールフェイズ", "フェイズ開始"]
  | ["リロールフェイズ", "規定の効果"]
  | ["リロールフェイズ", "フリータイミング"]
  | ["リロールフェイズ", "フェイズ終了"]
  | ["ドローフェイズ", "フェイズ開始"]
  | ["ドローフェイズ", "規定の効果"]
  | ["ドローフェイズ", "フリータイミング"]
  | ["ドローフェイズ", "フェイズ終了"]
  | ["配備フェイズ", "フェイズ開始"]
  | ["配備フェイズ", "フリータイミング"]
  | ["配備フェイズ", "フェイズ終了"]
  | ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "攻撃ステップ", "規定の効果"]
  | ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "防御ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "防御ステップ", "規定の効果"]
  | ["戦闘フェイズ", "防御ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "防御ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "帰還ステップ", "ステップ開始"]
  | ["戦闘フェイズ", "帰還ステップ", "規定の効果"]
  | ["戦闘フェイズ", "帰還ステップ", "フリータイミング"]
  | ["戦闘フェイズ", "帰還ステップ", "ステップ終了"]
  | ["戦闘フェイズ", "ターン終了時", "ダメージリセット"]
  | ["戦闘フェイズ", "ターン終了時", "効果解決"]
  | ["戦闘フェイズ", "ターン終了時", "手札調整"]
  | ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"];

export type Timing = [number, Phase];

export const TIMEING_CHART: Timing[] = (() => {
  const phaseSeq: Phase[] = [
    ["リロールフェイズ", "フェイズ開始"],
    ["リロールフェイズ", "規定の効果"],
    ["リロールフェイズ", "フリータイミング"],
    ["リロールフェイズ", "フェイズ終了"],
    ["ドローフェイズ", "フェイズ開始"],
    ["ドローフェイズ", "フリータイミング"],
    ["ドローフェイズ", "規定の効果"],
    ["ドローフェイズ", "フリータイミング"],
    ["ドローフェイズ", "フェイズ終了"],
    ["配備フェイズ", "フェイズ開始"],
    ["配備フェイズ", "フリータイミング"],
    ["配備フェイズ", "フェイズ終了"],
    ["戦闘フェイズ", "攻撃ステップ", "ステップ開始"],
    ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"],
    ["戦闘フェイズ", "攻撃ステップ", "規定の効果"],
    ["戦闘フェイズ", "攻撃ステップ", "フリータイミング"],
    ["戦闘フェイズ", "攻撃ステップ", "ステップ終了"],
    ["戦闘フェイズ", "防御ステップ", "ステップ開始"],
    ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
    ["戦闘フェイズ", "防御ステップ", "規定の効果"],
    ["戦闘フェイズ", "防御ステップ", "フリータイミング"],
    ["戦闘フェイズ", "防御ステップ", "ステップ終了"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ開始"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "規定の効果"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "フリータイミング"],
    ["戦闘フェイズ", "ダメージ判定ステップ", "ステップ終了"],
    ["戦闘フェイズ", "帰還ステップ", "ステップ開始"],
    ["戦闘フェイズ", "帰還ステップ", "フリータイミング"],
    ["戦闘フェイズ", "帰還ステップ", "規定の効果"],
    ["戦闘フェイズ", "帰還ステップ", "フリータイミング"],
    ["戦闘フェイズ", "帰還ステップ", "ステップ終了"],
    ["戦闘フェイズ", "ターン終了時", "ダメージリセット"],
    ["戦闘フェイズ", "ターン終了時", "効果解決"],
    ["戦闘フェイズ", "ターン終了時", "手札調整"],
    ["戦闘フェイズ", "ターン終了時", "効果終了。ターン終了"],
  ];
  return phaseSeq.map((phase, i) => {
    return [i, phase];
  });
})();

export function nextTiming(timing: Timing): Timing {
  const nextId = timing[0] + (1 % TIMEING_CHART.length);
  return TIMEING_CHART[nextId];
}

export function isCanPlayCardInPhase(phase: Phase): boolean {
  switch (phase[0]) {
    case "ドローフェイズ":
      return phase[1] == "フリータイミング";
    case "リロールフェイズ":
    case "配備フェイズ":
      return phase[1] == "フリータイミング" || phase[1] == "フェイズ開始";
    case "戦闘フェイズ":
      return phase[2] == "フリータイミング" || phase[2] == "ステップ開始";
  }
}

// ロール
export type CostRoll = {
  id: "CostRoll";
};

export type CostNumber = {
  id: "CostNumber";
  count: number;
  cardColor: CardColor | null;
  // P45
  unlimited: boolean;
};

export type CostAnd = {
  id: "CostAnd";
  and: Cost[];
};

export type CostOr = {
  id: "CostOr";
  and: Cost[];
};

export type Cost = CostAnd | CostOr | CostNumber | CostRoll;

export type SiYouTiming = ["常時"] | ["自軍" | "敵軍", "ターン" | Phase];

type TextCategoryZiDouKaTa = {
  id: "自動型";
  category: "常駐" | "恆常" | "起動";
};

type TextCategorySiYouKaTa = {
  id: "使用型";
  timing: SiYouTiming;
};

type TextCategoryTokuSyuKouKa = {
  id: "特殊効果";
  tokuSyuKouKa: TokuSyuKouKa;
};

export type TextCategory =
  | TextCategoryZiDouKaTa
  | TextCategorySiYouKaTa
  | TextCategoryTokuSyuKouKa;

export type TokuSyuKouKa =
  | ["高機動"]
  | ["速攻"]
  | ["サイコミュ", number]
  | ["強襲"]
  | ["範囲兵器", number]
  | ["ゲイン"]
  | ["改装", string]
  | ["共有", string]
  | ["供給", string]
  | ["クロスウェポン", string]
  | ["PS装甲"]
  | ["クイック"]
  | ["戦闘配備"]
  | ["ステイ"]
  | ["1枚制限"];

// ==========

type ConditionOr = {
  id: "ConditionOr";
  or: Condition[];
};

type ConditionAnd = {
  id: "ConditionAnd";
  and: Condition[];
};

type ConditionNot = {
  id: "ConditionNot";
  not: Condition;
};

type ConditionCardOnBaSyou = {
  id: "ConditionCardOnBaSyou";
  baSyou: BaSyou;
};

type ConditionCardOnColor = {
  id: "ConditionCardOnColor";
  color: CardColor;
};

type ConditionCardOnCategory = {
  id: "ConditionCardOnCategory";
  category: CardCategory;
};

type ConditionCardIsSetCard = {
  id: "ConditionCardIsSetCard";
  is: boolean;
};

type ConditionCardIsOpponentCard = {
  id: "ConditionCardIsOpponentCard";
  is: boolean;
};

type ConditionCardContainFlag = {
  id: "ConditionCardContainFlag";
  flag: string;
  is: boolean;
};

type ConditionGameEventOnEnterStage = {
  id: "ConditionGameEventOnEnterStage";
  wherePosition: BaSyou[];
};

type ConditionTargetType = {
  id: "ConditionTargetType";
  target: "プレーヤー" | "カード" | "場所";
};

export type Condition =
  | ConditionGameEventOnEnterStage
  | ConditionCardOnBaSyou
  | ConditionCardOnColor
  | ConditionCardOnCategory
  | ConditionCardIsSetCard
  | ConditionCardIsOpponentCard
  | ConditionCardContainFlag
  | ConditionTargetType
  | ConditionNot
  | ConditionOr
  | ConditionAnd;

type TargetTypePlayer = {
  id: "プレーヤー";
  playerID: string;
};

type TargetTypeCard = {
  id: "カード";
  cardID: string;
};

type TargetTypeCardPosition = {
  id: "TargetCardPosition";
  value: BaSyou;
};

type TargetTypeThisCard = {
  id: "このカード";
};

type TargetType =
  | TargetTypePlayer
  | TargetTypeCard
  | TargetTypeCardPosition
  | TargetTypeThisCard;

type ActionRoll = {
  id: "ActionRoll";
};

type ActionSetTarget = {
  id: "ActionSetTarget";
  targetID: string;
};

type ActionConsumeG = {
  id: "ActionConsumeG";
  color: CardColor | null;
  count: number;
};

// 廃棄
type ActionDrop = {
  id: "ActionDrop";
};

type ActionDraw = {
  id: "ActionDraw";
  count: number;
};

type ActionMoveCardToPosition = {
  id: "ActionMoveCardToPosition";
  toPosition: BaSyou;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  flag: FlagKeyword;
  value: boolean;
};

type ActionSetFace = {
  id: "ActionSetFace";
  faceDown: boolean;
};

export type Action =
  | ActionRoll
  | ActionConsumeG
  | ActionSetTarget
  | ActionDrop
  | ActionMoveCardToPosition
  | ActionDraw
  | ActionSetFace
  | ActionSetFlag;

type RequireTarget = {
  id: "RequireTarget";
  targets: (TargetType | null)[];
  condition?: Condition;
  action?: Action[];
};

type RequireEvent = {
  id: "RequireEvent";
  condition?: Condition;
};

type RequireYesNo = {
  id: "RequireYesNo";
  answer: boolean | null;
};

type RequireOr = {
  id: "RequireOr";
  or: Require[];
};

type RequireAnd = {
  id: "RequireAnd";
  and: Require[];
};

type RequireSiYouTiming = {
  id: "RequireSiYouTiming";
  siYouTiming: SiYouTiming;
};

export type Require =
  | RequireOr
  | RequireAnd
  | RequireYesNo
  | RequireTarget
  | RequireSiYouTiming
  | RequireEvent;

type FeedbackTargetAction = {
  id: "FeedbackTargetAction";
  targetID: string;
  action: Action[];
};

type FeedbackAction = {
  id: "FeedbackAction";
  action: Action[];
};

type FeedbackCustomAction = {
  id: "FeedbackCustomAction";
  targetID: string;
  cardID: string;
  actionID: string;
};

type FeedbackAddBlock = {
  id: "FeedbackAddBlock";
  block: BlockPayload;
};

export type Feedback =
  | FeedbackTargetAction
  | FeedbackAddBlock
  | FeedbackCustomAction
  | FeedbackAction;

export type BlockPayload = {
  require?: Require;
  feedback?: Feedback[];
};

export type CardText = {
  absolute?: boolean;
  text: string;
  category: TextCategory;
  block: BlockPayload;
};

const KouKaHaKai: CardText = {
  text: "破壊",
  category: {
    id: "使用型",
    timing: ["常時"],
  },
  block: {
    require: {
      id: "RequireTarget",
      targets: [
        {
          id: "このカード",
        },
      ],
      action: [
        {
          id: "ActionSetFlag",
          flag: "破壊",
          value: true,
        },
      ],
    },
    feedback: [],
  },
};

const KouKaHaiKi: CardText = {
  text: "廃棄",
  category: {
    id: "使用型",
    timing: ["常時"],
  },
  block: {
    require: {
      id: "RequireTarget",
      targets: [
        {
          id: "このカード",
        },
      ],
      action: [
        {
          id: "ActionMoveCardToPosition",
          toPosition: {
            id: "RelatedBaSyou",
            value: ["持ち主", "ジャンクヤード"],
          },
        },
      ],
    },
    feedback: [],
  },
};

export type FlagKeyword = "破壊" | "プレイされたカード" | "once";

export function createPlayUnitCardBlock(cardID: string): BlockPayload {
  return {
    require: {
      id: "RequireAnd",
      and: [
        {
          id: "RequireSiYouTiming",
          siYouTiming: ["自軍", ["配備フェイズ", "フリータイミング"]],
        },
        // プレイの宣告
        {
          id: "RequireTarget",
          targets: [
            {
              id: "カード",
              cardID: cardID,
            },
          ],
          action: [
            {
              id: "ActionSetFace",
              faceDown: false,
            },
            {
              id: "ActionSetTarget",
              targetID: "playCard",
            },
          ],
        },
        //「対象」の指定、コストの支払い
        {
          id: "RequireTarget",
          targets: [],
          action: [
            {
              id: "ActionConsumeG",
              color: null,
              count: 3,
            },
          ],
        },
      ],
    },
    feedback: [
      {
        id: "FeedbackTargetAction",
        targetID: "playCard",
        action: [
          {
            id: "ActionSetFlag",
            flag: "プレイされたカード",
            value: true,
          },
        ],
      },
      {
        // 場に出る効果
        id: "FeedbackAddBlock",
        block: {
          feedback: [
            {
              id: "FeedbackTargetAction",
              targetID: "playCard",
              action: [
                {
                  id: "ActionMoveCardToPosition",
                  toPosition: {
                    id: "RelatedBaSyou",
                    value: ["自軍", "配備エリア"],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

const playCard: CardText = {
  text: "カードのプレイ(ユニット)",
  category: {
    id: "使用型",
    timing: ["自軍", ["配備フェイズ", "フリータイミング"]],
  },
  block: {
    require: {
      id: "RequireAnd",
      and: [
        {
          id: "RequireSiYouTiming",
          siYouTiming: ["自軍", ["配備フェイズ", "フリータイミング"]],
        },
        // プレイの宣告
        {
          id: "RequireTarget",
          targets: [null],
          condition: {
            id: "ConditionAnd",
            and: [
              { id: "ConditionTargetType", target: "カード" },
              {
                id: "ConditionCardOnBaSyou",
                baSyou: {
                  id: "RelatedBaSyou",
                  value: ["自軍", "手札"],
                },
              },
            ],
          },
          action: [
            {
              id: "ActionSetFace",
              faceDown: false,
            },
            {
              id: "ActionSetTarget",
              targetID: "playCard",
            },
          ],
        },
        //「対象」の指定、コストの支払い
        {
          id: "RequireTarget",
          targets: [],
          action: [
            {
              id: "ActionConsumeG",
              color: null,
              count: 3,
            },
          ],
        },
      ],
    },
    feedback: [
      {
        id: "FeedbackTargetAction",
        targetID: "playCard",
        action: [
          {
            id: "ActionSetFlag",
            flag: "プレイされたカード",
            value: true,
          },
        ],
      },
      {
        // 場に出る効果
        id: "FeedbackAddBlock",
        block: {
          feedback: [
            {
              id: "FeedbackTargetAction",
              targetID: "playCard",
              action: [
                {
                  id: "ActionMoveCardToPosition",
                  toPosition: {
                    id: "RelatedBaSyou",
                    value: ["自軍", "配備エリア"],
                  },
                },
              ],
            },
          ],
        },
      },
    ],
  },
};

const Play: CardText = {
  text: "ユニットのプレイ",
  category: {
    id: "使用型",
    timing: ["自軍", ["配備フェイズ", "フリータイミング"]],
  },
  block: {
    // p20
    require: {
      id: "RequireAnd",
      and: [
        {
          id: "RequireSiYouTiming",
          siYouTiming: ["自軍", ["配備フェイズ", "フリータイミング"]],
        },
        // プレイの宣告

        //「対象」の指定、コストの支払い
        {
          id: "RequireTarget",
          targets: [null],

          action: [
            {
              id: "ActionSetTarget",
              targetID: "name",
            },
          ],
        },
        // other require
      ],
    },
    feedback: [
      {
        id: "FeedbackAddBlock",
        block: {
          feedback: [],
        },
      },
    ],
  },
};

const PlayCard: CardText = {
  text: "play card",
  category: {
    id: "使用型",
    timing: ["自軍", ["配備フェイズ", "フリータイミング"]],
  },
  block: {
    require: {
      id: "RequireAnd",
      and: [
        {
          id: "RequireTarget",
          targets: [],

          action: [
            {
              id: "ActionConsumeG",
              color: "白",
              count: 2,
            },
            {
              id: "ActionConsumeG", // TODO total G
              color: "紫",
              count: 2,
            },
          ],
        },
      ],
    },
    feedback: [
      {
        id: "FeedbackAction",
        action: [
          {
            id: "ActionMoveCardToPosition",
            toPosition: {
              id: "AbsoluteBaSyou",
              value: ["", "ハンガー"], // TODO
            },
          },
        ],
      },
    ],
  },
};

{
  // 『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。
  const ability: CardText = {
    text: "『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。",
    category: {
      id: "自動型",
      category: "常駐",
    },
    block: {
      feedback: [],
    },
  };
}
{
  const ability: CardText = {
    text: "『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。",
    category: {
      id: "自動型",
      category: "起動",
    },
    block: {
      require: {
        id: "RequireEvent",
        condition: {
          id: "ConditionAnd",
          and: [
            {
              id: "ConditionGameEventOnEnterStage",
              wherePosition: [],
            },
            {
              id: "ConditionCardContainFlag",
              flag: "once",
              is: false,
            },
          ],
        },
      },
      feedback: [
        {
          id: "FeedbackAction",
          action: [
            {
              id: "ActionDraw",
              count: 3,
            },
          ],
        },
        {
          id: "FeedbackAction",
          action: [
            {
              id: "ActionSetFlag",
              flag: "once",
              value: true,
            },
          ],
        },
      ],
    },
  };
}
{
  const ability: CardText = {
    text: "（常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。",
    category: {
      id: "使用型",
      timing: ["常時"],
    },
    block: {
      require: {
        id: "RequireTarget",
        targets: [],

        action: [
          {
            id: "ActionConsumeG",
            color: null,
            count: 1,
          },
        ],
      },
      feedback: [
        {
          id: "FeedbackAddBlock",
          block: {
            require: {
              id: "RequireTarget",
              targets: [
                {
                  id: "このカード",
                },
              ],

              action: [
                {
                  id: "ActionDrop",
                },
              ],
            },
            feedback: [
              {
                id: "FeedbackAddBlock",
                block: {
                  require: {
                    id: "RequireTarget",
                    targets: [null],
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        {
                          id: "ConditionTargetType",
                          target: "カード",
                        },
                        {
                          id: "ConditionCardOnBaSyou",
                          baSyou: {
                            id: "RelatedBaSyou",
                            value: ["自軍", "ジャンクヤード"],
                          },
                        },
                      ],
                    },
                    action: [
                      {
                        id: "ActionSetTarget",
                        targetID: "cardMoveToHanger",
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackTargetAction",
                      targetID: "cardMoveToHanger",
                      action: [
                        {
                          id: "ActionMoveCardToPosition",
                          toPosition: {
                            id: "RelatedBaSyou",
                            value: ["持ち主", "ハンガー"],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

{
  // <『起動』：このカードがGとして場に出た場合、〔黒２〕を支払う事ができる。その場合、自軍本国のカードを全て見て、その中にあるグラフィック１枚を、自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする>
  const ability: CardText = {
    text: "<『起動』：このカードがGとして場に出た場合、〔黒２〕を支払う事ができる。その場合、自軍本国のカードを全て見て、その中にあるグラフィック１枚を、自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする>",
    category: {
      id: "自動型",
      category: "起動",
    },
    absolute: true,
    block: {
      require: {
        id: "RequireEvent",
        condition: {
          id: "ConditionAnd",
          and: [
            {
              id: "ConditionGameEventOnEnterStage",
              wherePosition: [
                {
                  id: "RelatedBaSyou",
                  value: ["自軍", "Gゾーン"],
                },
              ],
            },
          ],
        },
      },
      feedback: [
        {
          id: "FeedbackAddBlock",
          block: {
            require: {
              id: "RequireTarget",
              targets: [],
              action: [
                {
                  id: "ActionConsumeG",
                  color: "黒",
                  count: 2,
                },
              ],
            },
            feedback: [
              {
                id: "FeedbackAddBlock",
                block: {
                  require: {
                    id: "RequireAnd",
                    and: [
                      {
                        id: "RequireTarget",
                        targets: [null],
                        condition: {
                          id: "ConditionAnd",
                          and: [
                            {
                              id: "ConditionTargetType",
                              target: "カード",
                            },
                            {
                              id: "ConditionCardOnBaSyou",
                              baSyou: {
                                id: "RelatedBaSyou",
                                value: ["自軍", "本国"],
                              },
                            },
                            {
                              id: "ConditionCardOnCategory",
                              category: "グラフィック",
                            },
                          ],
                        },
                        action: [
                          {
                            id: "ActionSetTarget",
                            targetID: "cardToMoveHanger",
                          },
                        ],
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackTargetAction",
                      targetID: "cardToMoveHanger",
                      action: [
                        {
                          id: "ActionMoveCardToPosition",
                          toPosition: {
                            id: "RelatedBaSyou",
                            value: ["自軍", "ハンガー"],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}
