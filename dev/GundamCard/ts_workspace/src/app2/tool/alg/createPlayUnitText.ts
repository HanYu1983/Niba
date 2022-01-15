import { reduce } from "rxjs";
import { Action } from "../tool/basic/action";
import { CardCategory, CardColor, CardText } from "../tool/basic/basic";
import { createRollCostRequire } from "../tool/basic/blockPayload";
import { GameContext } from "../tool/basic/gameContext";
import { getCardState } from "./helper";

// function XXXcreatePlayUnitText(ctx: GameContext, cardID: string): CardText {
//   const [_, cardState] = getCardState(ctx, cardID);
//   const hasQuick = false;
//   const hasSenToHaiBi = false;
//   const formatRollCost = (() => {
//     const [ret] = cardState.prototype.rollCost.reduce(
//       (
//         [result, source],
//         color
//       ): [[CardColor | null, number][], (CardColor | null)[]] => {
//         const number = source.filter((c) => c == color).length;
//         return [[...result, [color, number]], source.filter((c) => c != color)];
//       },
//       [[], cardState.prototype.rollCost] as [
//         [CardColor | null, number][],
//         (CardColor | null)[]
//       ]
//     );
//     return ret;
//   })();
//   return {
//     id: "使用型",
//     timing: hasQuick ? ["常時"] : ["自軍", "配備フェイズ"],
//     description: `プレイ${cardState.prototype.title}`,
//     block: {
//       contextID: "",
//       require: {
//         id: "RequireAnd",
//         and: [
//           ...formatRollCost.map(([color, num]) => {
//             return createRollCostRequire(num, color);
//           }),
//           {
//             id: "RequireTarget",
//             targets: {
//               cards: {
//                 id: "カード",
//                 cardID: "このカード",
//               },
//             },
//             condition: {
//               id: "ConditionCardOnBaSyou",
//               source: "cards",
//               baSyou: {
//                 id: "RelatedBaSyou",
//                 value: ["自軍", "手札"],
//               },
//             },
//             action: [
//               {
//                 id: "ActionSetFace",
//                 cards: "cards",
//                 faceDown: {
//                   id: "布林",
//                   value: false,
//                 },
//               },
//               {
//                 id: "ActionMoveCardToPosition",
//                 cards: "cards",
//                 baSyou: {
//                   id: "場所",
//                   baSyou: {
//                     id: "RelatedBaSyou",
//                     value: ["自軍", "プレイされているカード"],
//                   },
//                 },
//               },
//             ],
//           },
//         ],
//       },
//       feedback: [
//         {
//           id: "FeedbackAction",
//           action: [
//             {
//               id: "ActionMoveCardToPosition",
//               cards: "cards",
//               baSyou: {
//                 id: "場所",
//                 baSyou: {
//                   id: "RelatedBaSyou",
//                   value: ["自軍", "配備エリア"],
//                 },
//               },
//             },
//             ...(hasSenToHaiBi == false
//               ? [
//                   {
//                     id: "ActionRoll",
//                     cards: "cards",
//                   } as Action,
//                 ]
//               : []),
//           ],
//         },
//       ],
//     },
//   };
// }
