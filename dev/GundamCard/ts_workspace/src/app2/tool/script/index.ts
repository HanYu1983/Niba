import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../model/basic/gameContext";

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
