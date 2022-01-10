import { createRollCostRequire } from "../tool/basic/blockPayload";
import { CardPrototype, GameContext } from "../tool/basic/gameContext";
import { RequireCustomID } from "../tool/basic/requireCustom";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179030_11E_U_BL210N_blue
// N
// CCA
// リ・ガズィ（ケーラ機）
// リ・ガズィ系　MS　専用「ケーラ・スゥ」
// 戦闘配備　〔１〕：改装［リ・ガズィ系］
// 『起動』：青のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。

const prototype: CardPrototype = {
  title: "リ・ガズィ（ケーラ機）",
  characteristic: "リ・ガズィ系　MS　専用「ケーラ・スゥ」".split("　"),
  category: "ユニット",
  color: "青",
  texts: [
    createTokuSyuKouKaText(["戦闘配備"], { cost: 0 }),
    createTokuSyuKouKaText(["改装", "リ・ガズィ系"], { cost: 1 }),
    {
      id: "自動型",
      category: "起動",
      description:
        "『起動』：青のGサインを持つ自軍Gが４枚以上ある状態で、このカードが場に出た場合、ターン終了時に、このカードを持ち主のGにできる。",
      block: {
        require: {
          id: "RequireAnd",
          and: [
            {
              id: "RequireCustom",
              customID: {
                id: "{color}のGサインを持つ自軍Gが{number}枚以上ある場合",
                color: "青",
                number: 4,
              } as RequireCustomID,
            },
            {
              id: "RequireEvent",
              // このカードが場に出た場合
            },
            {
              id: "RequireTarget",
              targets: {},
              action: [],
            },
          ],
        },
      },
    },
  ],
};

module.exports = prototype;
