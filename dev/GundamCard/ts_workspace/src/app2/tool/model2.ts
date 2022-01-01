import { Card } from "../../tool/table";

export type PlayerID = string;
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

type Field =
  | "本国"
  | "捨て山"
  | "戦闘エリア"
  | "配備エリア"
  | "Gゾーン"
  | "ジャンクヤード"
  | "手札"
  | "ハンガー"
  | "取り除かれたカード";

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

export const TIMEING_SEQUENCE: Timing[] = (() => {
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
  const nextId = timing[0] + (1 % TIMEING_SEQUENCE.length);
  return TIMEING_SEQUENCE[nextId];
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

export type xx2 = "自軍" | "敵軍";
export type xx3 = "規定の効果" | "フリータイミング";

type RelatedCardPositionKeyword = "自軍" | "持ち主";

type AbsoluteCardPosition = {
  id: "AbsoluteCardPosition";
  value: [PlayerID, Field];
};

type RelatedCardPosition = {
  id: "RelatedCardPosition";
  value: [RelatedCardPositionKeyword, Field];
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

type Condition =
  | ConditionGameEventOnEnterStage
  | ConditionCardPosition
  | ConditionCardColor
  | ConditionCardType
  | ConditionIsSetCard
  | ConditionIsOpponentCard
  | ConditionContainFlag
  | ConditionNot
  | ConditionOr
  | ConditionAnd;

type TargetPlayer = {
  id: "TargetPlayer";
  value: "";
};

type TargetCard = {
  id: "TargetCard";
  value: "";
};

type TargetCardPosition = {
  id: "TargetCardPosition";
  value: CardPosition;
};

type TargetMySelf = {
  id: "TargetMySelf";
};

type Target = TargetPlayer | TargetCard | TargetCardPosition | TargetMySelf;

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
  flag: string;
};

type Action =
  | ActionConsumeG
  | ActionSetTarget
  | ActionDrop
  | ActionMoveCardToPosition
  | ActionDraw
  | ActionSetFlag;

type RequireTarget = {
  id: "RequireTarget";
  targets: (Target | null)[];
  condition: Condition | null;
  action: Action;
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

type Require =
  | RequireOr
  | RequireAnd
  | RequireYesNo
  | RequireTarget
  | RequireEvent;

type FeedbackTargetAction = {
  id: "FeedbackTargetAction";
  targetID: string;
  action: Action;
};

type FeedbackAction = {
  id: "FeedbackAction";
  action: Action;
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

type CardTextType = "常駐" | "起動" | "ability";

type CardText = {
  absolute?: boolean;
  text: string;
  type: CardTextType;
  block: BlockPayload;
};

{
  // play card
  const ability: CardText = {
    text: "play card",
    type: "ability",
    block: {
      require: {
        id: "RequireAnd",
        and: [
          {
            id: "RequireTarget",
            targets: [],
            condition: null,
            action: {
              id: "ActionConsumeG",
              color: "",
              count: 2,
            },
          },
          {
            id: "RequireTarget",
            targets: [],
            condition: null,
            action: {
              id: "ActionConsumeG", // TODO total G
              color: "",
              count: 2,
            },
          },
        ],
      },
      feedback: [
        {
          id: "FeedbackAction",
          action: {
            id: "ActionMoveCardToPosition",
            toPosition: {
              id: "AbsoluteCardPosition",
              value: ["", "ハンガー"], // TODO
            },
          },
        },
      ],
    },
  };
}

{
  // 『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。
  const ability: CardText = {
    text: "『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。",
    type: "常駐",
    block: {
      require: null,
      feedback: [],
    },
  };
}
{
  const ability: CardText = {
    text: "『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。",
    type: "起動",
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
          action: {
            id: "ActionDraw",
            count: 3,
          },
        },
        {
          id: "FeedbackAction",
          action: {
            id: "ActionSetFlag",
            flag: "once",
          },
        },
      ],
    },
  };
}
{
  const ability: CardText = {
    text: "（常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。",
    type: "ability",
    block: {
      require: {
        id: "RequireTarget",
        targets: [],
        condition: null,
        action: {
          id: "ActionConsumeG",
          color: "白",
          count: 1,
        },
      },
      feedback: [
        {
          id: "FeedbackAddBlock",
          block: {
            require: {
              id: "RequireTarget",
              targets: [
                {
                  id: "TargetMySelf",
                },
              ],
              condition: null,
              action: {
                id: "ActionDrop",
              },
            },
            feedback: [
              {
                id: "FeedbackAddBlock",
                block: {
                  require: {
                    id: "RequireTarget",
                    targets: [null],
                    condition: {
                      id: "ConditionCardPosition",
                      position: {
                        id: "RelatedCardPosition",
                        value: ["自軍", "ジャンクヤード"],
                      },
                      topCount: null,
                    },
                    action: {
                      id: "ActionSetTarget",
                      targetID: "cardMoveToHanger",
                    },
                  },
                  feedback: [
                    {
                      id: "FeedbackTargetAction",
                      targetID: "cardMoveToHanger",
                      action: {
                        id: "ActionMoveCardToPosition",
                        toPosition: {
                          id: "RelatedCardPosition",
                          value: ["持ち主", "ハンガー"],
                        },
                      },
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
    type: "起動",
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
              action: {
                id: "ActionConsumeG",
                color: "黒",
                count: 2,
              },
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
                        action: {
                          id: "ActionSetTarget",
                          targetID: "cardToMoveHanger",
                        },
                      },
                    ],
                  },
                  feedback: [
                    {
                      id: "FeedbackTargetAction",
                      targetID: "cardToMoveHanger",
                      action: {
                        id: "ActionMoveCardToPosition",
                        toPosition: {
                          id: "RelatedCardPosition",
                          value: ["自軍", "ハンガー"],
                        },
                      },
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
