import {
  CardPrototype
} from "../game/define";

export async function getPrototype(imgID: string): Promise<CardPrototype> {
  try {
    return (await import(`./${imgID}`)).prototype;
  } catch (e) {
    console.log(e)
    throw new Error(`script/${imgID}.ts not found`);
  }
}

const _preloadPrototype: { [key: string]: CardPrototype } = {}

export async function loadPrototype(imgID: string) {
  _preloadPrototype[imgID] = await getPrototype(imgID)
}

export function getPreloadPrototype(imgId: string): CardPrototype {
  if (_preloadPrototype[imgId] == null) {
    throw new Error(`imgId not found: ${imgId}`)
  }
  return _preloadPrototype[imgId]
}

export function getImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}
