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
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_RD083C_red
// C
// ZZ
// 量産型キュベレイ
// キュベレイ系　MS
// 〔１〕：サイコミュ（２）
// （自軍配備フェイズ）〔２〕：このカードの上に、NTチップ｛CHARACTER、「特徴：NT」、１／１／１｝１個を乗せる。

const prototype: CardPrototype = {
  ...DEFAULT_CARD_PROTOTYPE,
  title: "量産型キュベレイ",
  characteristic: "キュベレイ系　MS".split("　"),
  category: "ユニット",
  color: "白",
  rollCost: ["白", null, null],
  battlePoint: [5, 1, 5],
  texts: [
    createTokuSyuKouKaText(["サイコミュ", 2], { cost: 1 }),
    {
      id: "使用型",
      timing: ["自軍", "配備フェイズ"],
      description:
        "（自軍配備フェイズ）〔２〕：このカードの上に、NTチップ｛CHARACTER、「特徴：NT」、１／１／１｝１個を乗せる。",
      block: {
        require: createRollCostRequire(2, null),
        feedback: [
          {
            id: "FeedbackAction",
            action: [
              {
                id: "ActionRegisterChip",
                protoID: "NTチップ",
                prototype: {
                  ...DEFAULT_CARD_PROTOTYPE,
                  category: "キャラクター",
                },
              },
              {
                id: "ActionCreateChip",
                protoID: "NTチップ",
                createChipTarget: "このカードの上に",
              },
            ],
          },
        ],
      },
    },
  ],
};

module.exports = prototype;
