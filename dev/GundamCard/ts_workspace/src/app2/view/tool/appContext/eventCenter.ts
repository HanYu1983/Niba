import * as rxjs from "rxjs";
import { Card, CardStack } from "../../../../tool/table";
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

export type Event =
  | OnClickNewGame
  | OnClickChangeClient
  | OnClickCardEvent
  | OnModelFromFirebase;

export const OnEvent = new rxjs.Subject<Event>();
export const OnError = new rxjs.Subject<Error>();
