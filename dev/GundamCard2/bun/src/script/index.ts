import { repeat, T } from "ramda";
import { BattleAreaKeyword } from "../game/define/BaSyou";
import { CardCategory, CardColor, CardColorFn, CardPrototype, RollCostColor } from "../game/define/CardPrototype";
import { CardText, Condition, createRollCostRequire, TextTitle } from "../game/define/CardText";
import { logCategory } from "../tool/logger";

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
      const textstr = data.info_12.substr(0, 60)
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
      // 先去掉這些字元並以這行字元分割字串
      const matches = textstr.matchAll(/([^：　［］（）〔〕]+)/g);
      const texts: CardText[] = []
      let allSp = []
      let currSp = []
      for (const match of matches) {
        const curr = match[0]
        if (curr.length < 20) {
          const kw = ["高機動", "速攻", "強襲", "【PS装甲】", "クイック", "戦闘配備", "【ステイ】", "1枚制限"].find(kw => curr.indexOf(kw) != -1)
          if (kw) {
            allSp.push(kw)
            continue
          }
        }
        if (currSp.length == 0) {
          const match = curr.match(/(.?)(０|１|２|３|４|５|６|７|８|９|R+)(毎?)/)
          if (match) {
            const [_, colorstr, rollcoststr, every] = match
            currSp.push([colorstr, rollcoststr, every])
            continue
          }
        }
        if (currSp.length == 1) {
          if (["供給", "ゲイン"].includes(curr)) {
            currSp.push(curr)
            allSp.push(currSp.slice())
            currSp.length = 0
          } else if (["サイコミュ", "範囲兵器", "ゲイン", "改装", "共有", "クロスウェポン"].includes(curr)) {
            currSp.push(curr)
          } else {
            currSp.shift()
          }
          continue
        }
        if (currSp.length == 2) {
          currSp.push(curr)
          allSp.push(currSp.slice())
          currSp.length = 0
          continue
        }
      }
      // 大於一個才可能出問題
      if (currSp.length > 1) {
        console.log(currSp)
        throw new Error()
      }

      allSp.forEach(sp => {
        if (typeof sp == "string") {
          switch (sp) {
            case "高機動":
            case "速攻":
            case "強襲":
            case "【PS装甲】":
            case "クイック":
            case "戦闘配備":
            case "【ステイ】":
            case "1枚制限":
              texts.push({ id: "", title: ["特殊型", [sp]], description: sp })
              break
            default:
              throw new Error()
          }
          return
        }
        if (Array.isArray(sp) && Array.isArray(sp[0])) {
          const uppercaseDigits = "０１２３４５６７８９";
          const [[colorstr, rollcoststr, every], titlestr, char] = sp
          const color: CardColor | null = colorstr == "" ? null : (colorstr as CardColor)
          let conditions: { [key: string]: Condition } = {}
          if (rollcoststr == "R") {
            conditions["R"] = {
              actions: [
                {
                  title: ["_ロールする", "ロール"],
                }
              ]
            }
          } else {
            const rollcost = uppercaseDigits.indexOf(rollcoststr)
            if (rollcost == -1) {
              throw new Error()
            }
            conditions = {
              ...conditions,
              ...createRollCostRequire(rollcost, color)
            }
          }
          let title: TextTitle | null = null
          switch (titlestr) {
            case "供給":
            case "ゲイン": {
              title = ["特殊型", titlestr]
              break
            }
            case "サイコミュ":
            case "範囲兵器": {
              const num = uppercaseDigits.indexOf(char)
              title = ["特殊型", [titlestr, num]]
              break
            }
            case "改装":
            case "共有":
            case "クロスウェポン":
              title = ["特殊型", [titlestr, char]]
              break
          }
          if (title == null) {
            throw new Error()
          }
          const text: CardText = {
            id: "",
            title: title,
            isEachTime: every == "毎",
            description: `〔${colorstr}${rollcoststr}${every}〕${titlestr}[${char || ""}]`,
            conditions: conditions
          }
          texts.push(text)
          return
        }
        throw new Error()
      })
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
    if (scriptProto.__ignoreAutoTexts) {
      // 不使用解析出來的內文，因為某些情況會解析錯誤
      proto = {
        ...proto,
        texts: scriptProto.texts
      }
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