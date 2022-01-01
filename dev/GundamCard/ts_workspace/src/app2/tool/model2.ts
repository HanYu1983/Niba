import { Card } from "../../tool/table";

export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

// 場
type Ba = "戦闘エリア" | "配備エリア";

// 場所
type BaSyou =
  | null // プレイされたカード
  | "本国"
  | "捨て山"
  | "Gゾーン"
  | "ジャンクヤード"
  | "手札"
  | "ハンガー"
  | "取り除かれたカード"
  | Ba;

export type CardType =
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

export type TextCategoryZiDouKaTa = {
  id: "自動型";
  subCategory: "常駐" | "恆常" | "起動";
};

export type TextCategorySiYouKaTa = {
  id: "使用型";
  timing: SiYouTiming;
};

export type TextCategoryTokuSyuKouKa = {
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
  | ["1枚制限"]
  | ["[]"]
  | ["<>"];

type RelatedCardPositionKeyword = "自軍" | "持ち主";

type AbsoluteCardPosition = {
  id: "AbsoluteCardPosition";
  value: [PlayerID, BaSyou];
};

type RelatedCardPosition = {
  id: "RelatedCardPosition";
  value: [RelatedCardPositionKeyword, BaSyou];
};

type CardPosition = AbsoluteCardPosition | RelatedCardPosition;

// ==========

type ConditionCardPosition = {
  id: "ConditionCardPosition";
  position: CardPosition;
  topCount: number | null;
};

type ConditionCardColor = {
  id: "ConditionCardColor";
  include: any[];
};

type ConditionCardType = {
  id: "ConditionCardType";
  include: any[];
};

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

type ConditionIsSetCard = {
  id: "ConditionIsSetCard";
  is: boolean;
};

type ConditionIsOpponentCard = {
  id: "ConditionIsOpponentCard";
  is: boolean;
};

type ConditionContainFlag = {
  id: "ConditionContainFlag";
  flag: string;
  is: boolean;
};

type ConditionGameEventOnEnterStage = {
  id: "ConditionGameEventOnEnterStage";
  wherePosition: CardPosition[];
};

type ConditionTargetType = {
  id: "ConditionTargetType";
  target: "プレーヤー" | "カード" | "場所";
};

type ConditionCardInCardPosition = {
  id: "ConditionCardInCardPosition";
  cardPosition: CardPosition;
};

type Condition =
  | ConditionGameEventOnEnterStage
  | ConditionCardPosition
  | ConditionCardColor
  | ConditionCardType
  | ConditionIsSetCard
  | ConditionIsOpponentCard
  | ConditionContainFlag
  | ConditionTargetType
  | ConditionCardInCardPosition
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
  value: CardPosition;
};

type TargetTypeMySelf = {
  id: "TargetTypeMySelf";
};

type TargetType =
  | TargetTypePlayer
  | TargetTypeCard
  | TargetTypeCardPosition
  | TargetTypeMySelf;

type ActionTap = {};

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
  toPosition: CardPosition;
};

type ActionSetFlag = {
  id: "ActionSetFlag";
  flag: FlagKeyword;
};

type ActionSetFace = {
  id: "ActionSetFace";
  faceDown: boolean;
};

type Action =
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
  condition: Condition | null;
  action: Action[];
};

type GameEventOnCardEnterStage = {
  id: "GameEventOnCardEnterStage";
  cardID: string;
  from: AbsoluteCardPosition;
  to: AbsoluteCardPosition;
};

type RequireEvent = {
  id: "RequireEvent";
  condition: Condition | null;
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

type Require =
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

type Feedback =
  | FeedbackTargetAction
  | FeedbackAddBlock
  | FeedbackCustomAction
  | FeedbackAction;

type BlockPayload = {
  require: Require | null;
  feedback: Feedback[];
};

type CardText = {
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
          id: "TargetTypeMySelf",
        },
      ],
      condition: null,
      action: [
        {
          id: "ActionSetFlag",
          flag: "破壊",
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
          id: "TargetTypeMySelf",
        },
      ],
      condition: null,
      action: [
        {
          id: "ActionMoveCardToPosition",
          toPosition: {
            id: "RelatedCardPosition",
            value: ["持ち主", "ジャンクヤード"],
          },
        },
      ],
    },
    feedback: [],
  },
};

export type FlagKeyword = "破壊" | "プレイされたカード" | "once";

export function createCardPlayBlock(cardID: string): BlockPayload {
  return {
    require: {
      id: "RequireAnd",
      and: [
        // プレイの宣告
        {
          id: "RequireTarget",
          targets: [
            {
              id: "カード",
              cardID: cardID,
            },
          ],
          condition: {
            id: "ConditionAnd",
            and: [
              { id: "ConditionTargetType", target: "カード" },
              {
                id: "ConditionCardInCardPosition",
                cardPosition: {
                  id: "RelatedCardPosition",
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
          ],
        },
        //「対象」の指定、コストの支払い
        {
          id: "RequireTarget",
          targets: [],
          condition: null,
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
          },
        ],
      },
    ],
  };
}

const XX: CardText = {
  text: "カードのプレイ",
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
                id: "ConditionCardInCardPosition",
                cardPosition: {
                  id: "RelatedCardPosition",
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
          condition: null,
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
          },
        ],
      },
      {
        // 場に出る効果
        id: "FeedbackAddBlock",
        block: {
          require: null,
          feedback: [
            {
              id: "FeedbackTargetAction",
              targetID: "playCard",
              action: [
                {
                  id: "ActionMoveCardToPosition",
                  toPosition: {
                    id: "RelatedCardPosition",
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
          condition: null,
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
          require: null,
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
          condition: null,
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
              id: "AbsoluteCardPosition",
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
      subCategory: "常駐",
    },
    block: {
      require: null,
      feedback: [],
    },
  };
}
{
  const ability: CardText = {
    text: "『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。",
    category: {
      id: "自動型",
      subCategory: "起動",
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
              id: "ConditionContainFlag",
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
        condition: null,
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
                  id: "TargetTypeMySelf",
                },
              ],
              condition: null,
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
                          id: "ConditionCardPosition",
                          position: {
                            id: "RelatedCardPosition",
                            value: ["自軍", "ジャンクヤード"],
                          },
                          topCount: null,
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
                            id: "RelatedCardPosition",
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
      subCategory: "起動",
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
                  id: "RelatedCardPosition",
                  value: ["自軍", "ジャンクヤード"], // TODO
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
              condition: null,
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
                              id: "ConditionCardPosition",
                              position: {
                                id: "RelatedCardPosition",
                                value: ["自軍", "本国"],
                              },
                              topCount: null,
                            },
                            {
                              id: "ConditionCardType",
                              include: ["グラフィック"],
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
                            id: "RelatedCardPosition",
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
