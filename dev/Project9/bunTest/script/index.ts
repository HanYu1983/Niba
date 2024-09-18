import { repeat } from "ramda";
import { BattleAreaKeyword } from "../game/define/BaSyou";
import { CardCategory, CardPrototype, RollCostColor } from "../game/define/CardPrototype";

export async function loadPrototype(imgID: string): Promise<CardPrototype> {
  if (_preloadPrototype[imgID]) {
    return _preloadPrototype[imgID]
  }
  let proto: CardPrototype = {
    id: imgID
  }
  if (imgID.split("_").length > 1) {
    const [prodid, part2, part3, part4, part5] = imgID.split("_")
    const info_25 = `${part2}_${part3}_${part4}_${part5}`
    const data = require(`../data/${prodid}.json`).data.find((d: any) => {
      return d.info_25 == info_25
    });
    if (data) {
      console.log(`find origin data: ${data.info_2}`)
      const id = data.id
      const title = data.info_2
      const category = data.info_3
      const totalCostLength = data.info_4
      const colorCostLength = data.info_5
      const gsignProperty = data.info_6
      const bp1 = data.info_7
      const bp2 = data.info_8
      const bp3 = data.info_9
      const area = data.info_10
      const characteristic = data.info_11
      const description = data.info_15
      const prod = data.info_16
      const rarity = data.info_17
      const color = data.info_18
      function parseColors(color: any, colorCostLength: number, totalCostLength: number): (RollCostColor | null)[] {
        return [...repeat(color, colorCostLength), ...repeat(null, totalCostLength - colorCostLength)]
      }
      function parseBp(bp: string): "*" | number {
        if (bp == "*") {
          return "*"
        }
        return parseInt(bp, 10)
      }
      function parseArea(a: string): BattleAreaKeyword[] {
        if (a == "宇、地") {
          return ["地球エリア", "宇宙エリア"]
        }
        if (a == "宇") {
          return ["宇宙エリア"]
        }
        if (a == "地") {
          return ["地球エリア"]
        }
        return []
      }
      const categoryMapping: { [key: string]: CardCategory } = {
        "UNIT": "ユニット",
        "CHARACTER": "キャラクター",
        "COMMAND": "コマンド",
        "OPERATION": "オペレーション",
        "OPERATION(UNIT)": "オペレーション(ユニット)",
        "ACE": "ACE",
        "GRAPHIC": "グラフィック",
      }
      const originData: CardPrototype = {
        originCardId: id,
        title: title,
        category: categoryMapping[category],
        color: color,
        rollCost: parseColors(color, colorCostLength, totalCostLength),
        battlePoint: [parseBp(bp1), parseBp(bp2), parseBp(bp3)],
        battleArea: parseArea(area),
        characteristic: characteristic,
        description: description,
        isCross: title.indexOf("［†］") != -1,
        rarity: rarity,
        gsign: [[color], gsignProperty],
      }
      proto = {
        ...proto,
        ...originData
      }
      console.log(proto)
    }
  }
  {
    const scriptProto = (await import(`./${imgID}`).catch(() => {
      console.log(`script/${imgID}.ts not found. use default`)
      return { prototype: {} }
    })).prototype as CardPrototype;
    proto = {
      ...proto,
      ...scriptProto
    }
  }
  if (proto.texts) {
    for (const i in proto.texts) {
      const text = proto.texts[i]
      if (text.id == "") {
        text.id = `${proto.id}_text_${i}`
      }
    }
  }
  _preloadPrototype[imgID] = proto
  return proto
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
