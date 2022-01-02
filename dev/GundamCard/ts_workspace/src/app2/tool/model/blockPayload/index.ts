import type { Action } from "./action";
import type { SiYouTiming } from "../basic";
import type { Condition } from "./condition";
import type { TargetType } from "../basic";

export type RequireTarget = {
  id: "RequireTarget";
  targets: (TargetType | null)[];
  condition?: Condition;
  action?: Action[];
};

type RequireEvent = {
  id: "RequireEvent";
  condition?: Condition;
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

type RequireSiYouTiming = {
  id: "RequireSiYouTiming";
  siYouTiming: SiYouTiming;
};

export type Require =
  | RequireOr
  | RequireAnd
  | RequireYesNo
  | RequireTarget
  | RequireSiYouTiming
  | RequireEvent;

type FeedbackTargetAction = {
  id: "FeedbackTargetAction";
  targetID: string;
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

export type BlockPayload = {
  require?: Require;
  feedback?: Feedback[];
  contextID?: string;
  requirePassed?: boolean;
  feedbackPassed?: boolean;
};
