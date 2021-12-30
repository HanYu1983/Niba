import { BlockContext } from "../../tool/block";
import { Table } from "../../tool/table";

export type Model = {
  blockContext: BlockContext;
  table: Table;
};

type RequireCardID = (string | null)[];

type Condition = any;

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

type Require = RequireTap | RequireDrop | RequireConsumeG | RequireTarget;

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
                    condition: ["自軍ジャンクヤードにあるユニット１枚を"],
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
                    condition: [
                      "自軍本国のカードを全て見て、その中にあるグラフィック１枚を",
                    ],
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
              condition: ["セットカード以外の敵軍オペ１枚を破壊する"],
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
  const useAbility: BlockPayload = {
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
