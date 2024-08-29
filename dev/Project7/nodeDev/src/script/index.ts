import {
  CardPrototype
} from "../game/define";

export async function getPrototype(imgID: string): Promise<CardPrototype> {
  try {
    if (_preloadPrototype[imgID]) {
      return _preloadPrototype[imgID]
    }
    const proto = (await import(`./${imgID}`)).prototype;
    _preloadPrototype[imgID] = proto
    return proto
  } catch (e) {
    console.log(e)
    throw new Error(`script/${imgID}.ts not found`);
  }
}

const _preloadPrototype: { [key: string]: CardPrototype } = {}

export function getPreloadPrototype(imgId: string): CardPrototype {
  if (_preloadPrototype[imgId] == null) {
    throw new Error(`imgId not found: ${imgId}`)
  }
  return _preloadPrototype[imgId]
}

export function getImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}
