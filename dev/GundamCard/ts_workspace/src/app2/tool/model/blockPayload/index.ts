import type { Action } from "./action";
import type { SiYouTiming } from "../basic";
import type { Condition } from "./condition";
import type { TargetType } from "../basic";

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
  siYouTiming: SiYouTiming;
} & RequireBase;

export type RequireCustom = {
  id: "RequireCustom";
  customID: any;
} & RequireBase;

export type Require =
  | RequireOr
  | RequireAnd
  | RequireYesNo
  | RequireTarget
  | RequireSiYouTiming
  | RequireEvent
  | RequireCustom;

type FeedbackTargetAction = {
  id: "FeedbackTargetAction";
  targets: { [key: string]: TargetType };
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

export type Feedback =
  | FeedbackTargetAction
  | FeedbackAddBlock
  | FeedbackCustomAction
  | FeedbackAction;

export type BlockPayloadCause = {
  playerID?: string;
  cardID?: string;
};

export type BlockPayload = {
  cause?: BlockPayloadCause;
  require?: Require;
  feedback?: Feedback[];
  contextID?: string;
  requirePassed?: boolean;
  feedbackPassed?: boolean;
};

export const DEFAULT_BLOCK_PAYLOAD: BlockPayload = {};
