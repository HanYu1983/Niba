import {
  CardPrototype,
  DEFAULT_CARD_PROTOTYPE,
  GameContext,
} from "../../tool/basic/gameContext";
import { createRollCostRequire } from "../../tool/basic/blockPayload";
import { createTokuSyuKouKaText } from "./createTokuSyuKouKaText";

// 179016_04B_U_RD083C_red
// C
// ZZ
// 量産型キュベレイ
// キュベレイ系　MS
// 〔１〕：サイコミュ（２）
// （自軍配備フェイズ）〔２〕：このカードの上に、NTチップ｛CHARACTER、「特徴：NT」、１／１／１｝１個を乗せる。

const prototype: CardPrototype = {
  title: "量産型キュベレイ",
  characteristic: "キュベレイ系　MS".split("　"),
  category: "ユニット",
  color: "白",
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
