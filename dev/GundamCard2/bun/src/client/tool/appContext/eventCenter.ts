import { Subject } from "rxjs";
import { Card } from "../../../game/define/Card";
import { Effect } from "../../../game/define/Effect";
import { Flow } from "../../../game/gameStateWithFlowMemory/Flow";
import { GameContext } from "../../define/GameContext";
import { Condition } from "../../../game/define/CardText";

export type OnClickCardEvent = {
  id: "OnClickCardEvent";
  card: Card;
};

export type OnModelFromFirebase = {
  id: "OnModelFromFirebase";
  model: GameContext;
};

export type OnClickNewGame = {
  id: "OnClickNewGame";
};

export type OnClickChangeClient = {
  id: "OnClickChangeClient";
};

export type OnClickFlowConfirm = {
  id: "OnClickFlowConfirm";
  clientId: string;
  flow: Flow;
};

export type OnClickRequireTargetConfirm = {
  id: "OnClickRequireTargetConfirm";
  clientId: string;
  effect: Effect;
  condition: Condition;
  conditionKey: string;
};

export type Event =
  | OnClickNewGame
  | OnClickChangeClient
  | OnClickCardEvent
  | OnModelFromFirebase
  | OnClickFlowConfirm
  | OnClickRequireTargetConfirm;

export const OnEvent = new Subject<Event>();
export const OnError = new Subject<any>();
