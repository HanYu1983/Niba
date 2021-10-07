import data179001 from "./179001.json";
import data179002 from "./179002.json";
import data179003 from "./179003.json";
import data179004 from "./179004.json";
import data179005 from "./179005.json";
import data179006 from "./179006.json";
import data179007 from "./179007.json";
import data179008 from "./179008.json";
import data179009 from "./179009.json";
import data179010 from "./179010.json";

const allData = [
  ...data179001.data,
  ...data179002.data,
  ...data179003.data,
  ...data179004.data,
  ...data179005.data,
  ...data179006.data,
  ...data179007.data,
  ...data179008.data,
  ...data179009.data,
  ...data179010.data,
];
const indexByImgID = allData
  .map((data, i): [string, number] => {
    return [data.prodid + "_" + data.info_25, i];
  })
  .reduce((acc, [k, v]) => {
    return {
      ...acc,
      [k]: v,
    };
  }, {} as { [key: string]: number });

export function askRowData(imgID: string) {
  const i = indexByImgID[imgID];
  if (i == null) {
    throw new Error(`${imgID} not found`);
  }
  return allData[i];
}

export function askImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}
