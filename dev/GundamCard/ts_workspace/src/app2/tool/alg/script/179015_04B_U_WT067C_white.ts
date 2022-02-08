import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro } from "./getCardTextMacro";

// 179015_04B_U_WT067C_white
// アストレイ ブルーフレーム セカンドG
// アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」
// 速攻　〔０〕：改装［ブルーフレーム系］
// 〔２〕：クロスウェポン［アストレイ系］
// （クロスウェポンのルール＞（戦闘フェイズ）：［ ］の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "アストレイ ブルーフレーム セカンドG",
  characteristic: "アストレイ系　ブルーフレーム系　MS　専用「叢雲劾」".split(
    "　"
  ),
  category: "キャラクター",
  color: "白",
  rollCost: ["白", "白", null, null],
  battlePoint: [5, 0, 4],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(2, "白")],
    }),
    createTokuSyuKouKaText(["速攻"], {}),
    createTokuSyuKouKaText(["改装", "ブルーフレーム系"], {}),
    createTokuSyuKouKaText(["クロスウェポン", "アストレイ系"], { cost: 2 }),
  ],
};

module.exports = prototype;
