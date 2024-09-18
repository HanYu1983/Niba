import { CardPrototype } from "../game/define/CardPrototype";

export async function loadPrototype(imgID: string): Promise<CardPrototype> {
  try {
    if (_preloadPrototype[imgID]) {
      return _preloadPrototype[imgID]
    }
    const proto = (await import(`./${imgID}`)).prototype as CardPrototype;
    if (proto.id == null) {
      proto.id = imgID
    }
    if(proto.texts){
      for (const i in proto.texts) {
        const text = proto.texts[i]
        if (text.id == "") {
          text.id = `${proto.id}_text_${i}`
        }
      }
    }
    _preloadPrototype[imgID] = proto
    return proto
  } catch (e) {
    console.log(e)
    throw new Error(`script/${imgID}.ts not found`);
  }
}

const _preloadPrototype: { [key: string]: CardPrototype } = {}

export function getPrototype(imgId: string): CardPrototype {
  if (_preloadPrototype[imgId] == null) {
    throw new Error(`imgId not found: ${imgId}`)
  }
  return _preloadPrototype[imgId]
}

export function getImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}
