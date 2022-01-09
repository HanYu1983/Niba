import type { GameEvent, SiYouTiming, TargetType, CardColor } from "./basic";
import type { Condition } from "./condition";
import type { Action } from "./action";

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
  condition?: Condition;
} & RequireBase;

export type RequireYesNo = {
  id: "RequireYesNo";
  answer: boolean | null;
} & RequireBase;

export type RequireOr = {
  id: "RequireOr";
  or: Require[];
} & RequireBase;

export type RequireAnd = {
  id: "RequireAnd";
  and: Require[];
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

export type Require =
  | RequireOr
  | RequireAnd
  | RequireYesNo
  | RequireTarget
  | RequireSiYouTiming
  | RequireEvent
  | RequireCustom
  | RequireScript;

type FeedbackTargetAction = {
  id: "FeedbackTargetAction";
  targets: { [key: string]: TargetType };
  action: Action[];
};

type FeedbackAction = {
  id: "FeedbackAction";
  action: Action[];
};

export type Feedback = FeedbackTargetAction | FeedbackAction;

export type BlockPayloadCauseGameEvent = {
  id: "BlockPayloadCauseGameEvent";
  cardID: string;
  gameEvent: GameEvent;
  description: string;
};

export type BlockPayloadCauseUpdateCommand = {
  id: "BlockPayloadCauseUpdateCommand";
  cardID: string;
  description: string;
};

export type BlockPayloadCauseUpdateEffect = {
  id: "BlockPayloadCauseUpdateEffect";
  cardID: string;
  description: string;
};

export type BlockPayloadCause =
  | BlockPayloadCauseGameEvent
  | BlockPayloadCauseUpdateCommand
  | BlockPayloadCauseUpdateEffect;

export type BlockPayload = {
  id?: string;
  cause?: BlockPayloadCause;
  require?: Require;
  feedback?: Feedback[];
  contextID?: string;
  requirePassed?: boolean;
  feedbackPassed?: boolean;
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

export function createRollCostRequire(
  costNum: number,
  color: CardColor | null
): RequireTarget {
  return {
    id: "RequireTarget",
    targets: {
      cards: {
        id: "カード",
        cardID: new Array(costNum).fill(null),
      },
    },
    action: [
      {
        id: "ActionConsumeG",
        cards: "cards",
        ...(color
          ? {
              color: {
                id: "カードの色",
                color: color,
              },
            }
          : null),
      },
    ],
  };
}
