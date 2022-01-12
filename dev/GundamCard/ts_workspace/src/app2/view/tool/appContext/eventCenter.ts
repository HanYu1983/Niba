import * as rxjs from "rxjs";
import { Card, CardStack } from "../../../../tool/table";
import { Flow } from "../../../tool/alg/handleClient";
import { GameContext } from "../../../tool/tool/basic/gameContext";

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

export type Event =
  | OnClickNewGame
  | OnClickChangeClient
  | OnClickCardEvent
  | OnModelFromFirebase
  | OnClickFlowConfirm;

export const OnEvent = new rxjs.Subject<Event>();
export const OnError = new rxjs.Subject<Error>();
