import { Card } from "../../tool/table";

type PlayerID = string;

type CardStackName = "ジャンクヤード" | "ハンガー" | "本国";

type RelatedCardPositionKeyword = "自軍" | "持ち主";

type AbsoluteCardPosition = {
  id: "AbsoluteCardPosition";
  value: [PlayerID, CardStackName];
};

type RelatedCardPosition = {
  id: "RelatedCardPosition";
  value: [RelatedCardPositionKeyword, CardStackName];
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

type CardColor = any;

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
