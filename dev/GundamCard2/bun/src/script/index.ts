import { repeat } from "ramda";
import { BattleAreaKeyword } from "../game/define/BaSyou";
import { CardCategory, CardColor, CardColorFn, CardPrototype, RollCostColor } from "../game/define/CardPrototype";
import { CardText, Condition, createRollCostRequire } from "../game/define/CardText";

export async function importJson(path: string): Promise<any> {
  // https://stackoverflow.com/questions/69548822/how-to-import-js-that-imported-json-from-html
  // 加入, {with: {type: "json"}}到編譯過後的檔案裡
  return (await import(path, { with: { type: "json" } })).default
}

export async function importJs(path: string): Promise<any> {
  return await import(path)
}

export async function loadPrototype(imgID: string): Promise<CardPrototype> {
  if (_preloadPrototype[imgID]) {
    return _preloadPrototype[imgID]
  }
  let proto: CardPrototype = {
    id: imgID
  }
  if (imgID.split("_").length > 1) {
    const [prodid, ...parts] = imgID.split("_")
    const info_25 = parts.join("_")
    const data = (await importJson(`./data/${prodid}.json`)).data.find((d: any) => {
      return d.info_25 == info_25
    });
    if (data) {
      //console.log(`find origin data: ${data.info_2}`)
      const id = data.id
      const title = data.info_2
      const categoryStr = data.info_3
      const totalCostLengthStr = data.info_4
      const colorCost = data.info_5
      const gsignProperty = data.info_6
      const bp1 = data.info_7
      const bp2 = data.info_8
      const bp3 = data.info_9
      const area = data.info_10
      const characteristic = data.info_11
      // 只取前文字判斷特殊技能比較準
      const textstr = data.info_12.substr(0, 50)
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
        "OPERATION（UNIT）": "オペレーション(ユニット)",
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
      if (textstr.indexOf("ステイ") != -1) {
        texts.push({
          id: "",
          title: ["特殊型", ["ステイ"]]
        })
      }
      texts.forEach(text => {
        text.description = JSON.stringify(text.title)
      })
      // 自動解特殊效果的黑名單
      // 在名單內的要手動設置
      const textBlackList = ["179001_01A_CH_WT007R_white"]
      if (textBlackList.includes(imgID)) {
        texts.length = 0
      }

      const category = categoryMapping[categoryStr]
      if (category == null) {
        throw new Error(`unknown categoryStr: ${categoryStr}`)
      }
      const originData: CardPrototype = {
        originCardId: id,
        title: title,
        category: category,
        color: color,
        totalCost: totalCostLengthStr == "X" ? "X" : parseInt(totalCostLengthStr, 10),
        rollCost: parseColors(color, colorCost),
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
    } else {
      console.log(`loadPrototype not found: ${imgID}`)
    }
  }
  {
    // 修改成import(`./ext/${imgID}.js`)到編譯後的檔案裡
    const scriptProto = (await importJs(`./ext/${imgID}`).catch(() => {
      console.log(`script/${imgID}.ts not found. use default`)
      return { prototype: {} }
    })).prototype as CardPrototype;
    proto = {
      ...proto,
      ...scriptProto,
      texts: [
        ...scriptProto.texts || [],
        ...proto.texts || [],
      ]
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

function parseColors(color: any, colorCostLength: string): "X" | (RollCostColor | null)[] {
  if (colorCostLength == "X") {
    return "X"
  }
  if (colorCostLength == "-") {
    return []
  }
  const onlyNum = parseInt(colorCostLength, 10)
  if (isNaN(onlyNum) == false) {
    return repeat(color, onlyNum)
  }
  // "赤1青1" => ["赤", "青"]
  const parsedColors = colorCostLength.split(/(\d+)/).filter(Boolean).map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      return parseInt(part, 10);
    }
  })
  if (parsedColors.length % 2 == 0) {
    const pairs: [string, number][] = []
    for (let i = 0; i < parsedColors.length; i += 2) {
      pairs.push([parsedColors[i], parsedColors[i + 1]] as [string, number])
    }
    const ret = []
    for (const [str, num] of pairs) {
      if (num == 1) {
        ret.push(str)
      } else if (num > 1) {
        ret.push(...repeat(str, num))
      }
    }
  }
  if (CardColorFn.getAll().includes(color)) {
    return [color]
  }
  throw new Error(`parseColors ${color} ${colorCostLength}`)
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
      description: `(${rollcost})ゲイン`,
      conditions: createRollCostRequire(rollcost, null),
    }
  ]
}
function getKaiSo(gainStr: string): CardText[] {
  let match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：改装［(.+)］/);
  if (match == null) {
    match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：改装〔(.+)〕/);
    if (match == null) {
      return []
    }
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
      description: `(${rollcost})改装[${char}]`,
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

// 〔黒１毎〕：クロスウェポン［T3部隊］
function getCrossWeapon(gainStr: string): CardText[] {
  let match = gainStr.match(/〔(.?)(０|１|２|３|４|５|６|７|８|９+)(毎?)〕：クロスウェポン［(.+)］/);
  if (match == null) {
    return []
  }
  const [matchstr, colorstr, rollcoststr, every, char] = match
  if (colorstr != "" && CardColorFn.getAll().includes(colorstr as CardColor) == false) {
    throw new Error(`getCrossWeapon ${gainStr}`)
  }
  const color: CardColor | null = colorstr == "" ? null : (colorstr as CardColor)
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["クロスウェポン", char]],
      isEachTime: every == "毎",
      description: `(${color}${rollcost}${every})クロスウェポン[${char}]`,
      conditions: createRollCostRequire(rollcost, color)
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
      description: `(${rollcost})範囲兵器[${num}]`,
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
      description: `(${rollcost})サイコミュ[${num}]`,
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

function getHave(gainStr: string): CardText[] {
  let match = gainStr.match(/〔(.?)(０|１|２|３|４|５|６|７|８|９+)(毎?)〕：クロスウェポン［(.+)］/);
  if (match == null) {
    return []
  }
  const [matchstr, colorstr, rollcoststr, every, char] = match
  if (colorstr != "" && CardColorFn.getAll().includes(colorstr as CardColor) == false) {
    throw new Error(`getCrossWeapon ${gainStr}`)
  }
  const color: CardColor | null = colorstr == "" ? null : (colorstr as CardColor)
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["共有", char]],
      description: `(${rollcost})共有[${char}]`,
      conditions: createRollCostRequire(rollcost, color)
    }
  ]
}

function getSupply(gainStr: string): CardText[] {
  const match = gainStr.match(/〔(０|１|２|３|４|５|６|７|８|９+)〕：供給/);
  if (match == null) {
    return []
  }
  const [matchstr, rollcoststr] = match
  const rollcost = uppercaseDigits.indexOf(rollcoststr)
  if (rollcost == -1) {
    throw new Error(`getGainTexts error: ${matchstr}`)
  }
  return [
    {
      id: "",
      title: ["特殊型", ["供給"]],
      description: `(${rollcost})供給`,
      conditions: createRollCostRequire(rollcost, null)
    }
  ]
}

