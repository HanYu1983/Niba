import { Subject } from "rxjs";
import { Card } from "../../../game/define/Card";
import { Effect } from "../../../game/define/Effect";
import { Flow } from "../../../game/gameStateWithFlowMemory/Flow";
import { GameContext } from "../../define/GameContext";

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
  clientID: string;
  flow: Flow;
};

export type OnClickRequireTargetConfirm = {
  id: "OnClickRequireTargetConfirm";
  clientID: string;
  blockPayload: Effect;
  require: any;
  varID: string;
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
