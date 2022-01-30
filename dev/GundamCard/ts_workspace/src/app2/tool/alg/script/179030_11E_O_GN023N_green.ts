import { getCustomFunctionString } from "../../../../tool/helper";
import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { BlockPayload } from "../../tool/basic/blockPayload";
import {
  TargetType,
  TargetTypeCustomFunctionType,
} from "../../tool/basic/targetType";
import { getCardTextMacro } from "./cardTextMacro";
import { DEFAULT_CARD_TEXT_SIYOU_KATA } from "../../tool/basic/basic";

// 179030_11E_O_GN023N_green
// N
// CCA
// サイコミュテスト
// 破壊　装弾
// 『常駐』：「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合、このカードを自軍Gとしてロールできる。
// 『起動』：この記述の効果以外で、敵軍ユニットがダメージを受けた場合、戦闘エリアにいる敵軍ユニット１枚に１ダメージを与える。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "サイコミュテスト",
  characteristic: "破壊　装弾".split("　"),
  category: "オペレーション",
  color: "緑",
  rollCost: ["緑"],
  texts: [
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayOperation",
      additionalRequire: [createRollCostRequire(1, "緑")],
    }),
    // TODO
    // 當「特徴：装弾」を持つ自軍コマンドの効果で自軍Gをロールする場合時, 設定FLAG
    // updateEffect時, 新增一個EFFECT, 在詢問ROLE時, 這個等於G
  ],
};

module.exports = prototype;
