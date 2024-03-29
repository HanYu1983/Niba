import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";
import { getCardTextMacro, VAR_PLAY_CARD } from "./getCardTextMacro";
import { getConditionMacro } from "./getConditionMacro";
import { RequireTarget } from "../../tool/basic/blockPayload";
import { CardColor } from "../../tool/basic/basic";

import { RequireCustomID } from "../../tool/basic/requireCustom";
// 179030_11E_U_BL208S_blue
// Hi-νガンダム［†］ νガンダム系　MS　専用「アムロ・レイ」
// 戦闘配備　高機動　〔１〕：サイコミュ（３）　〔１〕：改装［νガンダム系］
//『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、全ての敵軍ユニットは、－３／ー３／±０を得る。
// （戦闘フェイズ）〔１〕：本来の記述に「特徴：装弾」を持つ自軍G１枚をロールする。その場合、このターン、このカードの部隊が与える戦闘ダメージは、「速度１」と「速度２」の両方で与えられる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "Hi-νガンダム［†］",
  characteristic: "νガンダム系　MS　専用「アムロ・レイ」".split("　"),
  category: "ユニット",
  color: "青",
  rollCost: ["青", null, null, null, null, null],
  texts: [
    createTokuSyuKouKaText(["高機動"], { cost: 0 }),
    createTokuSyuKouKaText(["サイコミュ", 3], { cost: 1 }),
    createTokuSyuKouKaText(["改装", "νガンダム系"], { cost: 1 }),
    getCardTextMacro({ id: "PlayG" }),
    getCardTextMacro({
      id: "PlayUnit",
      additionalRequire: [createRollCostRequire(1, "青")],
    }),
    {
      id: "自動型",
      category: "常駐",
      description:
        "『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、全ての敵軍ユニットは、－３／ー３／±０を得る。",
      block: {
        require: {
          id: "RequireCustom",
          customID: {
            id: "{color}のGサインを持つ自軍Gが{number}枚以上ある場合",
            color: "青",
            number: 5,
          } as RequireCustomID,
        },
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionAddEffect",
                effectID: "全ての敵軍ユニットは、－３／ー３／±０を得る。",
                effect: {
                  id: "GameEffectCustom",
                  customID: {
                    id: "全ての敵軍ユニットは、－３／ー３／±０を得る。",
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

module.exports = prototype;
