import { repeat } from "ramda";
import { BattleAreaKeyword } from "../game/define/BaSyou";
import { CardCategory, CardColor, CardPrototype, RollCostColor } from "../game/define/CardPrototype";
import { CardText, Condition, createRollCostRequire } from "../game/define/CardText";
import { getCardRollCost } from "../game/gameState/card";


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
    // https://stackoverflow.com/questions/69548822/how-to-import-js-that-imported-json-from-html
    // 加入, {with: {type: "json"}}到編譯過後的檔案裡
    const data = (await import(`./data/${prodid}.json`, { with: { type: "json" } })).default.data.find((d: any) => {
      return d.info_25 == info_25
    });
    if (data) {
      //console.log(`find origin data: ${data.info_2}`)
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
      const textstr = data.info_12
      const description = data.info_15
      const prod = data.info_16
      const rarity = data.info_17
      const color = data.info_18

      const categoryMapping: { [key: string]: CardCategory } = {
        "UNIT": "ユニット",
        "CHARACTER": "キャラクター",
        "COMMAND": "コマンド",
        "OPERATION": "オペレーション",
        "OPERATION(UNIT)": "オペレーション(ユニット)",
        "ACE": "ACE",
        "GRAPHIC": "グラフィック",
      }

      const texts = getGainTexts(textstr)
        .concat(getKaiSo(textstr))
        .concat(getSupply(textstr))
        .concat(getCrossWeapon(textstr))
        .concat(getPao(textstr))
        .concat(getHave(textstr))
        .concat(getRange(textstr))
      if (textstr.indexOf("強襲") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["強襲"]]
        })
      }
      if (textstr.indexOf("戦闘配備") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["戦闘配備"]]
        })
      }
      if (textstr.indexOf("【PS装甲】") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["PS装甲"]]
        })
      }
      if (textstr.indexOf("速攻") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["速攻"]]
        })
      }
      if (textstr.indexOf("クイック") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["クイック"]]
        })
      }
      if (textstr.indexOf("高機動") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["高機動"]]
        })
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
        texts: texts
      }
      proto = {
        ...proto,
        ...originData,
      }
    }
  }
  {
    // 修改成import(`./ext/${imgID}.js`)到編譯後的檔案裡
    const scriptProto = (await import(`./ext/${imgID}`).catch(() => {
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
        text.id = `loadPrototype_${proto.id}_text_${i}`
      }
    }
    if (proto.commandText && proto.commandText.id == "") {
      proto.commandText.id = `${proto.id}_text_command`
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

function parseColors(color: any, colorCostLength: string, totalCostLength: string): (RollCostColor | null)[] {
  if (colorCostLength == "X" || totalCostLength == "X") {
    return []
  }
  if (colorCostLength == "-" || totalCostLength == "-") {
    return []
  }
  const n1 = parseInt(colorCostLength, 10)
  const colors = []
  if (n1 == 1) {
    colors.push(color)
  } else if (n1 > 1) {
    colors.push(...repeat(color, n1))
  }
  const n2 = parseInt(totalCostLength, 10)
  if (n2 - n1 == 0) {
    return colors
  }
  if (n2 - n1 == 1) {
    return [...colors, null]
  }
  if (n2 > n1) {
    return [...colors, ...repeat(null, n2 - n1)]
  }
  throw new Error(`unknown ${color} ${colorCostLength} ${totalCostLength}`)
}
function parseBp(bp: string): "*" | number {
  if (bp == "-") {
    return "*"
  }
  const ret = parseInt(bp, 10)
  if (Number.isNaN(ret)) {
    throw new Error(`parseBp error: ${bp}`)
  }
  return ret
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

const uppercaseDigits = "０１２３４５６７８９";

function getGainTexts(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：ゲイン/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, char] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["ゲイン"]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}
function getKaiSo(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：改装［(.+)］/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, char] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["改装", char]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

function getCrossWeapon(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：クロスウェポン［(.+)］/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, char] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["クロスウェポン", char]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}
function getRange(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：範囲兵器（(０|１|２|３|４|５|６|７|８|９+)）/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, numstr] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  const num = uppercaseDigits.indexOf(numstr)
  if (num == -1) {
    throw new Error(`getGainTexts error: ${numstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["範囲兵器", num]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}


function getPao(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：サイコミュ（(０|１|２|３|４|５|６|７|８|９+)）/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, numstr] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  const num = uppercaseDigits.indexOf(numstr)
  if (num == -1) {
    throw new Error(`getGainTexts error: ${numstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["サイコミュ", num]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

function getHave(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：共有［(.+)］/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, char] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["共有", char]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

function getSupply(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：供給/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr, char] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["供給"]],
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

