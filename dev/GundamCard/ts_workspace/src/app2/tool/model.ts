import { BlockContext } from "../../tool/block";
import { Table } from "../../tool/table";

export type Model = {
  blockContext: BlockContext;
  table: Table;
};

type RequireCardID = (string | null)[];

type ConditionCardPosition = {
  id: "ConditionCardPosition";
  position: any;
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

type Condition =
  | ConditionCardPosition
  | ConditionCardColor
  | ConditionCardType
  | ConditionIsSetCard
  | ConditionIsOpponentCard
  | ConditionNot
  | ConditionOr
  | ConditionAnd;

type RequireBase = {
  playerID: string;
  condition: Condition | null;
};

type RequireTap = {
  id: "RequireTap";
  requireCardID: RequireCardID;
} & RequireBase;

type RequireDrop = {
  id: "RequireDrop";
  requireCardID: RequireCardID;
} & RequireBase;

type RequireConsumeG = {
  id: "RequireConsumeG";
  color: any;
} & RequireBase;

type RequireTarget = {
  id: "RequireTarget";
  targetID: string;
  requireCardID: RequireCardID;
} & RequireBase;

type RequireMoveCard = {
  id: "RequireMoveCard";
  from: any;
  to: any;
  requireCardID: RequireCardID;
};

type RequireYesNo = {
  id: "RequireYesNo";
  answer: boolean | null;
} & RequireBase;

type RequireOr = {
  or: Require[];
};

type RequireAnd = {
  and: Require[];
};

type Require =
  | RequireTap
  | RequireDrop
  | RequireConsumeG
  | RequireTarget
  | RequireYesNo
  | RequireOr
  | RequireAnd;

type FeedbackGenG = {
  id: "FeedbackGenG";
  color: any;
};

type FeedbackAddBlock = {
  id: "FeedbackAddBlock";
  block: BlockPayload;
};

type FeedbackDestroyTarget = {
  id: "FeedbackDestroyTarget";
  targetID: string;
};

type FeedbackMoveCard = {
  id: "FeedbackMoveCard";
  targetID: string;
  from: any;
  to: any;
};

type Feedback = FeedbackGenG | FeedbackAddBlock | FeedbackDestroyTarget;

type BlockPayload = {
  require: Require[];
  feedback: Feedback[];
};

{
  // gen g
  const ability: BlockPayload = {
    require: [
      {
        id: "RequireTap",
        playerID: "",
        requireCardID: ["this card id"],
        condition: null,
      },
    ],
    feedback: [
      {
        id: "FeedbackGenG",
        color: "",
      },
    ],
  };
}

{
  //（常時）〔１〕：このカードを廃棄する。その場合、自軍ジャンクヤードにあるユニット１枚を、持ち主のハンガーに移す。
  const ability: BlockPayload = {
    require: [
      {
        id: "RequireConsumeG",
        playerID: "",
        condition: null,
        color: [],
      },
    ],
    feedback: [
      {
        id: "FeedbackAddBlock",
        block: {
          require: [
            {
              id: "RequireDrop",
              playerID: "",
              requireCardID: ["this card id"],
              condition: null,
            },
          ],
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                require: [
                  {
                    id: "RequireTarget",
                    playerID: "",
                    condition: {
                      id: "ConditionCardPosition",
                      position: { playerID: "", position: "ジャンクヤード" },
                      topCount: null,
                    },
                    targetID: "target1",
                    requireCardID: [null],
                  },
                ],
                feedback: [
                  // target1 move to hanger
                ],
              },
            },
          ],
        },
      },
    ],
  };
}

{
  // <『起動』：このカードがGとして場に出た場合、〔黒２〕を支払う事ができる。その場合、自軍本国のカードを全て見て、その中にあるグラフィック１枚を、自軍ハンガーに移す事ができる。その後、自軍本国をシャッフルする>
  const ability: BlockPayload = {
    require: [],
    feedback: [
      {
        id: "FeedbackAddBlock",
        block: {
          require: [
            {
              id: "RequireConsumeG",
              playerID: "",
              condition: null,
              color: ["黑"],
            },
            {
              id: "RequireConsumeG",
              playerID: "",
              condition: null,
              color: ["黑"],
            },
          ],
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                require: [
                  {
                    id: "RequireTarget",
                    playerID: "",
                    condition: {
                      id: "ConditionAnd",
                      and: [
                        {
                          id: "ConditionCardPosition",
                          position: { playerID: "", position: "本国" },
                          topCount: null,
                        },
                        {
                          id: "ConditionCardType",
                          include: ["グラフィック"],
                        },
                      ],
                    },
                    targetID: "target1",
                    requireCardID: [null],
                  },
                ],
                feedback: [
                  // move target1 to hanger and shuffle
                ],
              },
            },
          ],
        },
      },
    ],
  };
  //（自軍ターン）：セットカード以外の敵軍オペ１枚を破壊する。
  const ability2: BlockPayload = {
    require: [],
    feedback: [
      {
        id: "FeedbackAddBlock",
        block: {
          require: [
            {
              id: "RequireTarget",
              playerID: "",
              condition: {
                id: "ConditionAnd",
                and: [
                  {
                    id: "ConditionIsSetCard",
                    is: false,
                  },
                  {
                    id: "ConditionIsOpponentCard",
                    is: true,
                  },
                ],
              },
              targetID: "target1",
              requireCardID: [null],
            },
          ],
          feedback: [
            // destroy
          ],
        },
      },
    ],
  };
}
{
  // 『起動』：場、または手札から、敵軍ジャンクヤードにユニットが移動した場合、セットカードがセットされていない、G以外の敵軍カード１枚を破壊する。
  const ability: BlockPayload = {
    require: [],
    feedback: [
      {
        id: "FeedbackAddBlock",
        block: {
          require: [
            {
              id: "RequireTarget",
              playerID: "",
              condition: null,
              targetID: "target1",
              requireCardID: [null],
            },
          ],
          feedback: [
            {
              id: "FeedbackDestroyTarget",
              targetID: "target1",
            },
          ],
        },
      },
    ],
  };
}

{
  // 『起動』：このカードが場に出た場合、自軍ユニット１枚の上に±０／±０／－１コイン２個を乗せる事ができる。その場合、カード１枚を引く。
  const ability: BlockPayload = {
    require: [],
    feedback: [
      {
        id: "FeedbackAddBlock",
        block: {
          require: [
            {
              id: "RequireTarget",
              playerID: "",
              condition: null, // ["自軍ユニット１枚"],
              targetID: "target1",
              requireCardID: [null],
            },
          ],
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                require: [
                  {
                    id: "RequireYesNo",
                    playerID: "",
                    condition: null,
                    answer: null,
                  },
                ],
                feedback: [
                  // add token
                  // draw 1 card
                ],
              },
            },
          ],
        },
      },
    ],
  };
}

{
  // （常時）〔R〕：配備エリアにいる、「特徴：T3部隊」を持つ自軍ユニット１枚を持ち主のハンガーに移す。
  // 『起動』：このカードが場に出た場合、敵軍ユニット１枚は、ターン終了時まで－X／－X／－Xを得る。Xの値は、「特徴：T3部隊」を持つ自軍ユニットの枚数＋１とする。（注：このカードも枚数に含める）
  // 『起動』：このカードが場に出た場合、自軍本国の上のカード１～４枚を見て、その中にある、「特徴：ヘイズル系」を持つユニット１枚を、自軍ハンガーに移す事ができる。
}
