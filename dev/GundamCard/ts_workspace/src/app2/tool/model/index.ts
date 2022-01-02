import type {
  CardColor,
  BaSyou,
  CardCategory,
  TextCategory,
  SiYouTiming,
  TargetType,
} from "./basic";
import { BlockPayload, Require, RequireTarget } from "./blockPayload";
import { BlockContext, mapBlock, next, Block } from "../../../tool/block";
import { Condition } from "./blockPayload/condition";
import { Action } from "./blockPayload/action";
import { ScriptContext, mapVarContext } from "./scriptContext";

export type GameContext = {
  scriptContext: ScriptContext;
};

export function doConditionTarget(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  target: TargetType,
  condition: Condition
): string | null {
  switch (condition.id) {
    case "ConditionAnd": {
      const results = condition.and.map((cond) =>
        doConditionTarget(gameCtx, block, blockPayload, target, cond)
      );
      const reasons = results
        .map((reason) => reason)
        .filter((reason) => reason);
      const hasFalse = reasons.length > 0;
      if (hasFalse) {
        return reasons.join(".");
      }
      return null;
    }
    case "ConditionOr": {
      const results = condition.or.map((cond) =>
        doConditionTarget(gameCtx, block, blockPayload, target, cond)
      );
      const reasons = results
        .map((reason) => reason)
        .filter((reason) => reason);
      const hasTrue = reasons.length != condition.or.length;
      if (hasTrue) {
        return null;
      }
      return `不符合其中1項: ${reasons.join(".")}`;
    }
    case "ConditionTargetType":
      {
        switch (condition.target) {
          case "カード": {
            if (target.id != "カード" && target.id != "このカード") {
              return "必須是カード";
            }
          }
          default:
            if (target.id != condition.target) {
              return `必須是${condition.target}`;
            }
        }
      }
      break;
    case "ConditionCardOnCategory": {
      switch (condition.category) {
        case "ユニット":
      }
      return null;
    }
  }
  return "unknown";
}

export function doCondition(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: RequireTarget,
  condition: Condition
): string | null {
  try {
    const results = require.targets.map((target) => {
      if (target == null) {
        throw new Error("未完成的選擇");
      }
      return doConditionTarget(gameCtx, block, blockPayload, target, condition);
    });

    const reasons = results
      .map((reason, i) => {
        if (reason == null) {
          return reason;
        }
        return `第${i}選擇錯誤:${reason}`;
      })
      .filter((reason) => reason);

    if (reasons.length) {
      return reasons.join(".");
    }
    return null;
  } catch (e: any) {
    return JSON.stringify(e);
  }
}

export function doActionTarget(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  target: TargetType,
  action: Action,
  varCtxID: string
): GameContext {
  switch (action.id) {
    case "ActionRoll":
      {
        // roll card  varContext.cardID
      }
      break;
    case "ActionDraw":
      break;
  }
  return gameCtx;
}

export function doAction(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: RequireTarget,
  action: Action,
  varCtxID: string
): GameContext {
  switch (action.id) {
    case "ActionSetTarget": {
      const targetID = action.targetID;
      const targets = require.targets;
      return {
        ...gameCtx,
        scriptContext: mapVarContext(
          gameCtx.scriptContext,
          varCtxID,
          (varCtx) => {
            return {
              ...varCtx,
              vars: {
                ...varCtx.vars,
                [targetID]: targets,
              },
            };
          }
        ),
      };
    }
    default:
      return require.targets.reduce((originGameCtx, target) => {
        if (target == null) {
          throw new Error("未完成的選擇");
        }
        return doActionTarget(
          originGameCtx,
          block,
          blockPayload,
          target,
          action,
          varCtxID
        );
      }, gameCtx);
  }
}

export function doRequire(
  gameCtx: GameContext,
  block: Block,
  blockPayload: BlockPayload,
  require: Require,
  varCtxID: string
): GameContext {
  switch (require.id) {
    case "RequireAnd": {
      return require.and.reduce((originGameCtx, r) => {
        return doRequire(originGameCtx, block, blockPayload, r, varCtxID);
      }, gameCtx);
    }
    case "RequireOr": {
      const results = require.or.map((r): [string | null, GameContext] => {
        try {
          return [null, doRequire(gameCtx, block, blockPayload, r, varCtxID)];
        } catch (e) {
          return [JSON.stringify(e), gameCtx];
        }
      });
      for (const [err, nextGameCtx] of results) {
        if (err == null) {
          return nextGameCtx;
        }
      }
      const msg = results
        .filter(([err, _]) => err)
        .map(([err, _]) => err)
        .join(".");
      throw new Error(msg);
    }
    case "RequireYesNo": {
      if (require.answer == null) {
        throw new Error("沒有回答Yes Or No");
      }
      return gameCtx;
    }
    case "RequireTarget": {
      if (require.condition) {
        const reason = doCondition(
          gameCtx,
          block,
          blockPayload,
          require,
          require.condition
        );
        if (reason != null) {
          throw new Error(reason);
        }
      }
      if (require.action?.length) {
        return require.action.reduce((originGameCtx, action) => {
          return doAction(
            originGameCtx,
            block,
            blockPayload,
            require,
            action,
            varCtxID
          );
        }, gameCtx);
      }
      return gameCtx;
    }
    default:
      throw new Error(`not support yet: ${require.id}`);
  }
}

export function doBlockRequire(
  gameCtx: GameContext,
  blockID: string
): GameContext {
  const block = gameCtx.scriptContext.blockContext.blocks[0];
  const payload: BlockPayload = block.payload;
  if (payload.requirePassed) {
    throw new Error("已經處理了require");
  }
  const varCtxID = payload.contextID || block.id;
  if (payload.require) {
    gameCtx = doRequire(gameCtx, block, payload, payload.require, varCtxID);
  }
  const nextBlockContext = mapBlock(
    gameCtx.scriptContext.blockContext,
    blockID,
    (block) => {
      const nextPayload: BlockPayload = {
        ...block.payload,
        requirePassed: true,
      };
      return {
        ...block,
        payload: nextPayload,
      };
    }
  );

  gameCtx = {
    ...gameCtx,
    scriptContext: {
      ...gameCtx.scriptContext,
      blockContext: nextBlockContext,
    },
  };

  return gameCtx;
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
