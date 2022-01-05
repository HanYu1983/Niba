import d179001 from "./179001.json";
import d179002 from "./179002.json";
import d179003 from "./179003.json";
import d179004 from "./179004.json";
import d179005 from "./179005.json";
import d179006 from "./179006.json";
import d179007 from "./179007.json";
import d179008 from "./179008.json";
import d179009 from "./179009.json";
import d179010 from "./179010.json";

import d179011 from "./179011.json";
import d179012 from "./179012.json";
import d179013 from "./179013.json";
import d179014 from "./179014.json";
import d179015 from "./179015.json";
import d179016 from "./179016.json";
import d179017 from "./179017.json";
import d179018 from "./179018.json";
import d179019 from "./179019.json";
import d179020 from "./179020.json";

import d179021 from "./179021.json";
import d179022 from "./179022.json";
import d179023 from "./179023.json";
import d179024 from "./179024.json";
import d179025 from "./179025.json";
import d179026 from "./179026.json";
import d179027 from "./179027.json";
import d179028 from "./179028.json";
import d179029 from "./179029.json";
import d179030 from "./179030.json";

import d179901 from "./179901.json";

const allData: any[] = [
  //...d179001.data,
  // ...d179002.data,
  // ...d179003.data,
  // ...d179004.data,
  // ...d179005.data,
  // ...d179006.data,
  // ...d179007.data,
  // ...d179008.data,
  // ...d179009.data,
  // ...d179010.data,
  // ...d179011.data,
  // ...d179012.data,
  // ...d179013.data,
  // ...d179014.data,
  // ...d179015.data,
  ...d179016.data,
  // ...d179017.data,
  // ...d179018.data,
  // ...d179019.data,
  // ...d179020.data,
  // ...d179021.data,
  // ...d179022.data,
  // ...d179023.data,
  // ...d179024.data,
  // ...d179025.data,
  // ...d179026.data,
  // ...d179027.data,
  // ...d179028.data,
  // ...d179029.data,
  // ...d179030.data,
  // ...d179901.data,
];

export type RowData = {
  id: string;
  title: string;
  category: "CHARACTER" | "UNIT" | "COMMAND" | "OPERATION" | "GRAPHIC";
  imgID: string;
};

const rowDataMapping: { [key: string]: RowData } = allData
  .map((data): RowData => {
    return {
      id: data["id"],
      title: data["info_2"],
      category: data["info_3"],
      imgID: data["prodid"] + "_" + data["info_25"],
    };
  })
  .reduce((acc, rowData) => {
    return {
      ...acc,
      [rowData.imgID]: rowData,
    };
  }, {} as { [key: string]: RowData });

export function askRowData(imgID: string): RowData {
  const i = rowDataMapping[imgID];
  if (i == null) {
    throw new Error(`imgID(${imgID}) not found`);
  }
  return i;
}

export function askImgSrc(imgID: string) {
  return `https://storage.googleapis.com/particle-resources/cardPackage/gundamWarN/${imgID}.jpg`;
}
