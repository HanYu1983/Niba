import * as rxjs from "rxjs";
import { Card, CardStack } from "./table";
import { CardPosition, Context } from "./types";

export type OnClickCardEvent = {
  id: "OnClickCardEvent";
  card: Card;
};

export type OnClickCardPositionEvent = {
  id: "OnClickCardPositionEvent";
  where: CardPosition;
};

export type OnModelFromFirebase = {
  id: "OnModelFromFirebase";
  model: Context;
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
  | OnClickCardPositionEvent
  | OnModelFromFirebase;

export const OnEvent = new rxjs.Subject<Event>();
