import type {
  CardColor,
  BaSyou,
  CardCategory,
  TextCategory,
  SiYouTiming,
  TargetType,
} from "./basic";
import { BlockPayload, Feedback, Require, RequireTarget } from "./blockPayload";

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

// ==========

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
