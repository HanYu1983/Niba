import { GameContext } from "../model/gameContext";
import { TextCategory } from "../model/basic";
import { BlockPayload } from "../model/blockPayload";

export type Text = {
  absolute?: boolean;
  text: string;
  category: TextCategory;
  block: BlockPayload;
};

export type QueryText = {
  id: "QueryText";
  texts: Text[];
};

export type Query = QueryText;

export type Script = {
  texts: Text[];
  query: (ctx: GameContext, q: Query) => void;
};
