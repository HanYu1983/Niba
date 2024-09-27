import { writeFile } from "fs/promises";
import { readdir } from "fs/promises";

async function readDataJson(prodid: string): Promise<any> {
  const pkg = await import(`./script/data/${prodid}.json`)
  const outputJsons = []
  for (const data of pkg.data) {
    const id = data.id
    const title = data.info_2
    const category = data.info_3
    const totalCostLength = data.info_4
    const colorCost = data.info_5
    const gsignProperty = data.info_6
    const bp1 = data.info_7
    const bp2 = data.info_8
    const bp3 = data.info_9
    const area = data.info_10
    const characteristic = data.info_11
    const text = data.info_12
    const description = data.info_15
    const prod = data.info_16
    const rarity = data.info_17
    const color = data.info_18
    const imgID = `${prodid}_${data.info_25}`
    const outputJson = {
      id, title, categoryStr: category, totalCostLengthStr: totalCostLength, colorCost, gsignProperty,
      bp1, bp2, bp3, area, characteristic, textstr: text, description, prod, rarity, color, imgID
    }
    outputJsons.push(outputJson)
  }
  return outputJsons
}

async function readFoldPaths(path: string) {
  const files = await readdir(path);
  return files;
}

async function write() {
  const fileNames = await readFoldPaths("./src/script/data")
  const proids = fileNames.filter(name => name.indexOf(".json") != -1).map(name => name.replace(".json", ""))
  const datas = await Promise.all(proids.map(readDataJson)).then(args => {
    return args.flatMap(v => v)
  })
  const output = {
    data: datas
  }
  await writeFile(`GundamCard.json`, JSON.stringify(output, null, 2))
}

write().catch(console.log)