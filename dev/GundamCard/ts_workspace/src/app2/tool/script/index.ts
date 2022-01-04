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
  query: <T>(ctx: any, q: T) => T;
};

export function getCardScript(cardRowDataID: string): Script {
  try {
    return require(`./${cardRowDataID}.ts`);
  } catch (e) {
    console.error(`script/${cardRowDataID}.ts not found`);
  }
  return {
    query: <T>(ctx: any, q: T) => {
      console.log(`script/${cardRowDataID}.ts query not impl`);
      return q;
    },
  };
}
