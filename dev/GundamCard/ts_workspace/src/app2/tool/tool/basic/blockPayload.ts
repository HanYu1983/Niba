import type {
  GameEvent,
  SiYouTiming,
  CardColor,
  PlayerID,
  RelatedPlayerSideKeyword,
} from "./basic";
import type { Condition } from "./condition";
import type { Action } from "./action";
import { TargetType, TargetTypeCard } from "./targetType";
import { log2 } from "../../../../tool/logger";
import { DestroyReason, GameContext } from "./gameContext";
import { JsonfpExpr } from "../../alg/jsonfpHelper";

export type RequireBase = {
  key?: string;
};

export type RequireTarget = {
  id: "RequireTarget";
  targets: { [key: string]: TargetType };
  condition?: Condition;
  action?: Action[];
} & RequireBase;

export type RequireEvent = {
  id: "RequireEvent";
  event?: GameEvent;
} & RequireBase;

export type RequireYesNo = {
  id: "RequireYesNo";
  answer: boolean | null;
} & RequireBase;

export type RequireSiYouTiming = {
  id: "RequireSiYouTiming";
  timing: SiYouTiming;
} & RequireBase;

export type RequireCustom = {
  id: "RequireCustom";
  customID: any;
} & RequireBase;

export type RequireScript = {
  id: "RequireScript";
  string: string;
} & RequireBase;

export type RequireOr = {
  id: "RequireOr";
  or: Require[];
} & RequireBase;

export type RequireAnd = {
  id: "RequireAnd";
  and: Require[];
} & RequireBase;

export type Require =
  | RequireOr
  | RequireAnd
  | RequireYesNo
  | RequireTarget
  | RequireSiYouTiming
  | RequireEvent
  | RequireCustom
  | RequireScript;

export const DEFAULT_REQUIRE_TARGET: RequireTarget = {
  id: "RequireTarget",
  targets: {},
};

export type FeedbackTargetAction = {
  id: "FeedbackTargetAction";
  targets: { [key: string]: TargetType };
  action: Action[];
};

export type FeedbackAction = {
  id: "FeedbackAction";
  action: Action[];
};

export type Feedback = FeedbackTargetAction | FeedbackAction;

export type BlockPayloadCauseGameEvent = {
  id: "BlockPayloadCauseGameEvent";
  // 發生的卡的控制者
  playerID: string;
  // 發生的卡
  cardID: string;
  cardTextID: string;
  gameEvent: GameEvent;
  description: string;
};

export type BlockPayloadCauseUpdateCommand = {
  id: "BlockPayloadCauseUpdateCommand";
  // 發生的卡的控制者(這個效果的控制者)
  playerID: string;
  // 發生的卡
  cardID: string;
  cardTextID: string;
  description: string;
};

export type BlockPayloadCauseUpdateEffect = {
  id: "BlockPayloadCauseUpdateEffect";
  // 發生的卡的控制者(這個效果的控制者)
  playerID: string;
  // 發生的卡
  cardID: string;
  cardTextID: string;
  description: string;
};

export type BlockPayloadCauseGameRule = {
  id: "BlockPayloadCauseGameRule";
  // 這個效果的控制者
  playerID: string;
  description: string;
};

export type BlockPayloadCauseDestroy = {
  id: "BlockPayloadCauseDestroy";
  // 誰造成的破壞效果(用來切入的優先權計算)
  playerID: string;
  // 發生破壞的卡
  cardID: string;
  reason: DestroyReason;
  description: string;
};

export type BlockPayloadCause =
  | BlockPayloadCauseGameEvent
  | BlockPayloadCauseUpdateCommand
  | BlockPayloadCauseUpdateEffect
  | BlockPayloadCauseGameRule
  | BlockPayloadCauseDestroy;

export type BlockPayload = {
  id?: string;
  cause?: BlockPayloadCause;
  require?: Require;
  feedback?: Feedback[];
  contextID?: string;
  requirePassed?: boolean;
  feedbackPassed?: boolean;
  isOption?: boolean;
};

export const DEFAULT_BLOCK_PAYLOAD: BlockPayload = {};

export function recurRequire(
  require: Require,
  mapF: (require: Require) => Require
): Require {
  switch (require.id) {
    case "RequireAnd": {
      const nextRequires = require.and.map((require) => {
        return recurRequire(require, mapF);
      });
      const nextAnd: RequireAnd = {
        ...require,
        and: nextRequires,
      };
      return nextAnd;
    }
    case "RequireOr": {
      const nextRequires = require.or.map((require) => {
        return recurRequire(require, mapF);
      });
      const nextOr: RequireOr = {
        ...require,
        or: nextRequires,
      };
      return nextOr;
    }
    default:
      return mapF(require);
  }
}

export function mapRequireTargets(
  require: RequireTarget,
  func: (targetID: string, target: TargetType) => TargetType
): RequireTarget {
  const nextTargets = Object.entries(require.targets).reduce(
    (acc, [targetID, target]) => {
      return {
        ...acc,
        [targetID]: func(targetID, target),
      };
    },
    {} as { [key: string]: TargetType }
  );
  return {
    ...require,
    targets: nextTargets,
  };
}

export function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): RequireTarget {
  return {
    id: "RequireTarget",
    targets: {
      要支付的國力: {
        id: "カード",
        value: [],
        valueLengthInclude: [costNum],
      } as TargetTypeCard,
    },
    condition: {
      id: "ConditionAnd",
      and: [
        {
          id: "ConditionCompareBaSyou",
          value: [
            {
              id: "場所",
              value: {
                path: [{ id: "カード", value: "要支付的國力" }, "的「場所」"],
              },
            },
            "==",
            {
              id: "場所",
              value: [{ id: "RelatedBaSyou", value: ["自軍", "Gゾーン"] }],
            },
          ],
        },
        {
          id: "ConditionCompareBoolean",
          value: [
            {
              id: "布林",
              value: {
                path: [{ id: "カード", value: "要支付的國力" }, "是直立的？"],
              },
            },
            "==",
            {
              id: "布林",
              value: [true],
            },
          ],
        },
        ...(color
          ? [
              {
                id: "ConditionCompareCardColor",
                value: [
                  {
                    id: "カードの色",
                    value: {
                      path: [
                        {
                          id: "カード",
                          value: "要支付的國力",
                        },
                        "的「色」",
                      ],
                    },
                  },
                  "==",
                  {
                    id: "カードの色",
                    value: [color],
                  },
                ],
              } as Condition,
            ]
          : []),
      ],
    },
    action: [
      {
        id: "ActionRoll",
        cards: {
          id: "カード",
          value: "要支付的國力",
        },
      },
    ],
  };
}

export function createRollRequire(): RequireTarget {
  return {
    id: "RequireTarget",
    targets: {},
    condition: {
      id: "ConditionCompareBoolean",
      value: [
        {
          id: "布林",
          value: {
            path: [
              { id: "カード", value: { path: [{ id: "このカード" }] } },
              "是直立的？",
            ],
          },
        },
        "==",
        {
          id: "布林",
          value: [true],
        },
      ],
    },
    action: [
      {
        id: "ActionRoll",
        cards: { id: "カード", value: { path: [{ id: "このカード" }] } },
      },
    ],
  };
}

let _reqKey = 0;
export function wrapRequireKey(r: Require): Require {
  return recurRequire(r, (r) => {
    return {
      ...r,
      key: `wrapRequireKey_${_reqKey++}`,
    };
  });
}
