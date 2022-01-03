import {
  addBlock,
  BlockContext,
  DEFAULT_BLOCK_CONTEXT,
  mapBlock,
} from "../tool/model/scriptContext/blockContext";
import {
  BlockPayload,
  DEFAULT_BLOCK_PAYLOAD,
  RequireTarget,
  RequireYesNo,
} from "../tool/model/blockPayload";
import {
  GameContext,
  DEFAULT_GAME_CONTEXT,
  doBlockRequire,
  doBlockFeedback,
  setRequireAnswer,
  setRequireTarget,
} from "../tool/model/gameContext";
import {
  DEFAULT_SCRIPT_CONTEXT,
  mapBlockPayloadRequire,
} from "../tool/model/scriptContext";
import { TextCategory } from "../tool/model/basic";
import { createTokuSyuKouKaText } from "../tool/script/createTokuSyuKouKaText";
import { Script } from "../tool/script";

export function testSetAnswer() {
  const require1: RequireYesNo = {
    id: "RequireYesNo",
    key: "問題1",
    answer: null,
  };
  const require2: RequireTarget = {
    id: "RequireTarget",
    key: "問題2",
    targets: [null, null],
  };
  const require3: RequireTarget = {
    id: "RequireTarget",
    key: "問題3",
    targets: [null, null],
  };
  const payload1: BlockPayload = {
    ...DEFAULT_BLOCK_PAYLOAD,
    require: {
      id: "RequireAnd",
      and: [
        require1,
        {
          id: "RequireOr",
          or: [require2, require3],
        },
      ],
    },
  };
  let ctx: GameContext = {
    ...DEFAULT_GAME_CONTEXT,
    scriptContext: {
      ...DEFAULT_SCRIPT_CONTEXT,
      blockContext: {
        ...DEFAULT_BLOCK_CONTEXT,
        blocks: [
          {
            id: "0",
            payload: payload1,
            createdTime: 0,
          },
        ],
      },
    },
  };
  mapBlockPayloadRequire(ctx.scriptContext, (require) => {
    if (require.key == null) {
      return require;
    }
    if (require.key != require1.key) {
      return require;
    }
    if (require.id != "RequireYesNo") {
      return require;
    }
    if (require.answer != null) {
      throw new Error("answer must null");
    }
    return require;
  });
  ctx = setRequireAnswer(ctx, require1.key || "", true);
  mapBlockPayloadRequire(ctx.scriptContext, (require) => {
    if (require.key == null) {
      return require;
    }
    if (require.key != require1.key) {
      return require;
    }
    if (require.id != "RequireYesNo") {
      return require;
    }
    if (require.answer == null) {
      throw new Error("answer must not null");
    }
    return require;
  });

  ctx = setRequireTarget(ctx, require2.key || "", 1, {
    id: "カード",
    cardID: "a card",
  });

  mapBlockPayloadRequire(ctx.scriptContext, (require) => {
    if (require.key == null) {
      return require;
    }
    if (require.key != require1.key) {
      return require;
    }
    if (require.id != "RequireTarget") {
      return require;
    }
    if (require.targets[1] == null) {
      throw new Error("targets[1] must not null");
    }
    return require;
  });
}

function testPlayCardPayload() {
  const playCardPayload: BlockPayload = {
    contextID: "varContextID1",
    require: {
      id: "RequireAnd",
      and: [
        {
          id: "RequireSiYouTiming",
          siYouTiming: ["自軍", "配備フェイズ"],
        },
        // プレイの宣告
        {
          id: "RequireTarget",
          key: "手牌選1張",
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

  let ctx: GameContext = {
    ...DEFAULT_GAME_CONTEXT,
    scriptContext: {
      ...DEFAULT_SCRIPT_CONTEXT,
      blockContext: {
        ...DEFAULT_BLOCK_CONTEXT,
        blocks: [
          {
            id: "0",
            payload: playCardPayload,
            createdTime: 0,
          },
        ],
      },
    },
  };
  let err: any = null;
  try {
    ctx = doBlockRequire(ctx, "0");
  } catch (e) {
    err = e;
  }
  if (err == null) {
    throw new Error("必須有錯誤，因為targets中有null值");
  }
  err = null;

  ctx = setRequireTarget(ctx, "手牌選1張", 0, {
    id: "カード",
    cardID: "a card",
  });

  ctx = doBlockRequire(ctx, "0");

  mapBlock(ctx.scriptContext.blockContext, (block) => {
    if (block.id != "0") {
      return block;
    }
    const payload: BlockPayload = block.payload;
    if (payload.requirePassed == false) {
      throw new Error("必須requirePassed");
    }
    return block;
  });

  ctx = doBlockFeedback(ctx, "0");

  mapBlock(ctx.scriptContext.blockContext, (block) => {
    if (block.id != "0") {
      return block;
    }
    const payload: BlockPayload = block.payload;
    if (payload.feedbackPassed == false) {
      throw new Error("必須feedbackPassed");
    }
    return block;
  });

  console.log(ctx);
  ctx = doBlockFeedback(ctx, "addBlock_0");
}

function testTmp() {
  const effect1 = createTokuSyuKouKaText(["範囲兵器", 3], { cost: 0 });
  console.log(effect1);
  const effect2 = createTokuSyuKouKaText(["サイコミュ", 2], { cost: 1 });
  console.log(effect2);
  const effect3 = createTokuSyuKouKaText(["改装", "ABC"], { cost: 2 });
  console.log(effect3);
  const effect4 = createTokuSyuKouKaText(["供給"], { cost: 2 });
  console.log(effect4);

  const script: Script = require("../tool/script/73423");
  console.log(script.texts);

  let ctx: GameContext = {
    ...DEFAULT_GAME_CONTEXT,
    scriptContext: {
      ...DEFAULT_SCRIPT_CONTEXT,
      blockContext: {
        ...DEFAULT_BLOCK_CONTEXT,
        blocks: [
          {
            id: "0",
            payload: effect1.block,
            createdTime: 0,
          },
          {
            id: "1",
            payload: effect2.block,
            createdTime: 0,
          },
          {
            id: "2",
            payload: effect3.block,
            createdTime: 0,
          },
          {
            id: "3",
            payload: effect4.block,
            createdTime: 0,
          },
        ],
      },
    },
  };
  ctx = doBlockRequire(ctx, "1");
}

export function test() {
  [testSetAnswer, testPlayCardPayload, testTmp].forEach((testF) => {
    console.log(`============${testF.name}===========`);
    testF();
  });
}

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
          siYouTiming: ["自軍", "配備フェイズ"],
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

const Play: CardText = {
  text: "ユニットのプレイ",
  category: {
    id: "使用型",
    timing: ["自軍", "配備フェイズ"],
  },
  block: {
    // p20
    require: {
      id: "RequireAnd",
      and: [
        {
          id: "RequireSiYouTiming",
          siYouTiming: ["自軍", "配備フェイズ"],
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
    timing: ["自軍", "配備フェイズ"],
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
      category: ["起動", 0],
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
              id: "ConditionNot",
              not: {
                id: "ConditionCardContainFlag",
                flag: "once",
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
      category: ["起動", 0],
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
  //（自軍ターン）：セットカード以外の敵軍オペ１枚を破壊する。
  const ability2: CardText = {
    text: "（自軍ターン）：セットカード以外の敵軍オペ１枚を破壊する。",
    category: {
      id: "使用型",
      timing: ["自軍", "ターン"],
    },
    block: {
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
                    id: "ConditionNot",
                    not: {
                      id: "ConditionCardIsSetCard",
                    },
                  },
                  {
                    id: "ConditionCardOnCategory",
                    category: "オペレーション",
                  },
                  {
                    id: "ConditionCardIsPlayerSide",
                    playerSide: "敵軍",
                  },
                ],
              },
              action: [
                {
                  id: "ActionDestroy",
                },
              ],
            },
          },
        },
      ],
    },
  };
}

{
  // 『起動』：場、または手札から、敵軍ジャンクヤードにユニットが移動した場合、セットカードがセットされていない、G以外の敵軍カード１枚を破壊する。
  const ability: BlockPayload = {
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
            id: "ConditionNot",
            not: {
              id: "ConditionCardHasSetCard",
            },
          },
          {
            id: "ConditionNot",
            not: {
              id: "ConditionCardIsRole",
              role: "グラフィック",
            },
          },
          {
            id: "ConditionCardIsPlayerSide",
            playerSide: "敵軍",
          },
        ],
      },
      action: [
        {
          id: "ActionDestroy",
        },
      ],
    },
  };
}

{
  // 『起動』：このカードが場に出た場合、自軍ユニット１枚の上に±０／±０／－１コイン２個を乗せる事ができる。その場合、カード１枚を引く。
  const ability: BlockPayload = {
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
                  id: "ConditionCardIsPlayerSide",
                  playerSide: "自軍",
                },
                {
                  id: "ConditionCardIsRole",
                  role: "ユニット",
                },
              ],
            },
            action: [
              // put token
            ],
          },
          feedback: [
            {
              id: "FeedbackAddBlock",
              block: {
                require: {
                  id: "RequireYesNo",
                  answer: null,
                },
                feedback: [
                  {
                    id: "FeedbackAction",
                    action: [
                      {
                        id: "ActionDraw",
                        count: 1,
                      },
                      // add token
                    ],
                  },
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
