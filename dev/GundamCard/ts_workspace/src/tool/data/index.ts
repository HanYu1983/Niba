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

export type Data = {
  img: string;
};

export const datas: { [key: string]: Data } = [
  data179001,
  data179002,
  data179003,
  data179004,
  data179005,
  data179006,
  data179007,
  data179008,
  data179009,
  data179010,
]
  .flatMap((d) => d.data as any)
  .map((data) => {
    return { ...data, img: data.prodid + "_" + data.info_25 };
  })
  .reduce((acc, c) => {
    // 用img當id支援卡牌風雲
    return {
      ...acc,
      [c.img]: c,
    };
  }, {});

export function getImgSrc(img: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${img}.jpg`;
}
