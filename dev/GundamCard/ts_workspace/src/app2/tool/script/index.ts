import { CardText } from "../model/basic";
import { BlockPayload } from "../model/blockPayload";
import { CardPrototype, DEFAULT_CARD_PROTOTYPE } from "../model/gameContext";

export type Text = {
  absolute?: boolean;
  text: string;
  category: CardText;
  block: BlockPayload;
};

export type QueryText = {
  id: "QueryText";
  texts: Text[];
};

export type Query = QueryText;

export type Script = {
  texts: Text[];
  query: <T>(ctx: any, q: T) => T;
};

export function getCardScript(cardRowDataID: string): Script {
  try {
    return require(`./${cardRowDataID}.ts`);
  } catch (e) {
    console.error(`script/${cardRowDataID}.ts not found`);
  }
  return {
    texts: [],
    query: <T>(ctx: any, q: T) => {
      console.log(`script/${cardRowDataID}.ts query not impl`);
      return q;
    },
  };
}

export function getPrototype(imgID: string): CardPrototype {
  try {
    return require(`./${imgID}.ts`);
  } catch (e) {
    console.error(`script/${imgID}.ts not found`);
  }
  return DEFAULT_CARD_PROTOTYPE;
}

export function getImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}
