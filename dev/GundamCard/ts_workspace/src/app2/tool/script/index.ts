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
  texts?: Text[];
  query?: (ctx: any, q: Query) => void;
};

export function getCardScript(cardRowDataID: string): Script {
  try {
    return require(`./script/${cardRowDataID}.ts`);
  } catch (e) {
    console.error(`script/${cardRowDataID}.ts not found`);
  }
  return {};
}
