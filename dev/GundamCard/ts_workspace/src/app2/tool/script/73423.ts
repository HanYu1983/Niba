import { Query, Text } from ".";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_WT075C_white
// アストレイ ブルーフレーム セカンドL（ローエングリンランチャー）
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 〔０〕：改装［ブルーフレーム系］
// 『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。
// （注：このカードが場に出た時にも起動する）
module.exports.texts = [
  createTokuSyuKouKaText(["改装", "ブルーフレーム系"], { cost: 0 }),
  {
    text: "『起動』：「特徴：アストレイ系」を持つ自軍ユニットが、「改装」の効果で場に出た場合、〔白２〕を支払う事ができる。その場合、５以下の防御力を持つ敵軍ユニット１枚を破壊する。",
    category: {
      id: "自動型",
      category: "起動",
    },
    block: {},
  },
] as Text[];

module.exports.query = (q: Query): void => {
  switch (q.id) {
    case "QueryText": {
    }
  }
};
