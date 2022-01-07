import { Query, Text } from ".";
import { cardPosition } from "../../../app/model/alg/tool";
import { TextCategory } from "../model/basic";
import { GameContext } from "../model/gameContext";
import { wrapRequireKey } from "../model/scriptContext";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179030_11E_U_BL208S_blue
// 11E/U BL208S Hi-νガンダム［†］ νガンダム系　MS　専用「アムロ・レイ」
// 戦闘配備　高機動　〔１〕：サイコミュ（３）　〔１〕：改装［νガンダム系］
//『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、全ての敵軍ユニットは、－３／ー３／±０を得る。
// （戦闘フェイズ）〔１〕：本来の記述に「特徴：装弾」を持つ自軍G１枚をロールする。その場合、このターン、このカードの部隊が与える戦闘ダメージは、「速度１」と「速度２」の両方で与えられる。

// 179030_11E_U_BL215R_blue
// 戦闘配備　〔１〕：改装［ペーネロペー系］
//『恒常』：このカードが自軍手札にある状態で、青のGサインを持つ自軍ユニットが破壊されて廃棄された場合、〔１〕を支払う事ができる。その場合、このカードを、自軍配備エリアにリロール状態で出す。
//『起動』：このカードが場に出た場合、自軍ジャンクヤードにある、青のGサインを持つユニット１枚を自軍ハンガーに移す事ができる。

// 179901_00_U_BL006P_blue
// 『常駐』：このセットグループの、「特徴：NT」を持つ全ての自軍キャラは、「〔１〕：共有［バンシィ系］」を得る。
const texts: Text[] = [
  createTokuSyuKouKaText(["高機動"], {}),
  createTokuSyuKouKaText(["サイコミュ", 3], { cost: 1 }),
  createTokuSyuKouKaText(["改装", "νガンダム系"], { cost: 1 }),
  // {
  //   text: "『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、全ての敵軍ユニットは、－３／ー３／±０を得る。",
  //   category: {
  //     id: "自動型",
  //     category: "常駐",
  //   },
  //   block: {
  //     require: {
  //       id: "RequireAnd",
  //       and: [
  //         {
  //           id: "RequireTarget",
  //           targets: {
  //             青のGサインを持つ自軍G: {
  //               id: "collect",
  //               filter: {
  //                 id: "filterAnd",
  //                 and: [
  //                   {
  //                     id: "filterTypeIsG",
  //                   },
  //                   {
  //                     id: "filterMySide",
  //                   },
  //                 ],
  //               },
  //             },
  //           },
  //           condition: {
  //             id: "compare",
  //             value: [
  //               "青のGサインを持つ自軍G",
  //               { id: "operator", value: ">=" },
  //               { id: "number", value: 5 },
  //             ],
  //           },
  //         },
  //         {
  //           id: "RequireTarget",
  //           targets: {
  //             全ての敵軍ユニット: {
  //               id: "collect",
  //               filter: {
  //                 id: "filterUnit",
  //               },
  //             },
  //           },
  //           action: [
  //             {
  //               id: "－３／ー３／±０を得る",
  //               cardID: "全ての敵軍ユニット",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   },
  // },
];

module.exports.query = (ctx: GameContext, q: Query): Query => {
  switch (q.id) {
    case "QueryText": {
      q.texts = texts;
      break;
    }
  }
  return q;
};
