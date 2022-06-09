import * as rxjs from "rxjs";
import { Card, CardStack } from "../../../../tool/table";
import { Flow } from "../../../tool/alg/handleClient";
import {
  BlockPayload,
  Require,
  RequireTarget,
} from "../../../tool/tool/basic/blockPayload";
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

export type OnClickRequireTargetConfirm = {
  id: "OnClickRequireTargetConfirm";
  clientID: string;
  blockPayload: BlockPayload;
  require: RequireTarget;
  varID: string;
};

export type Event =
  | OnClickNewGame
  | OnClickChangeClient
  | OnClickCardEvent
  | OnModelFromFirebase
  | OnClickFlowConfirm
  | OnClickRequireTargetConfirm;

export const OnEvent = new rxjs.Subject<Event>();
export const OnError = new rxjs.Subject<any>();
