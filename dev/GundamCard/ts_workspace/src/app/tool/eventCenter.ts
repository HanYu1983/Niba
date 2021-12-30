import * as rxjs from "rxjs";
import { Card, CardStack } from "../../tool/table";
import { CardPosition, Context, Action } from "../types";

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

export type OnClickActionConfirm = {
  id: "OnClickActionConfirm";
  action: Action;
};

export type Event =
  | OnClickNewGame
  | OnClickChangeClient
  | OnClickCardEvent
  | OnClickCardPositionEvent
  | OnModelFromFirebase
  | OnClickActionConfirm;

export const OnEvent = new rxjs.Subject<Event>();
export const OnError = new rxjs.Subject<Error>();
