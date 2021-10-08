import { Context, CardPosition, Action, Payment, Effect } from "../tool/types";
import {
  opponent,
  askPlayerG,
  cardPositionID,
  askCardType,
} from "../model/alg";
import { Card } from "../tool/table";
import { askRowData } from "../tool/data";

const askAction = (ctx: Context, card: Card): Action[] => {
  if (card.ownerID == null) {
    throw new Error("card.ownerID not found");
  }
  //   const rowData = askRowData(card.protoID);
  //   const cardType = askCardType(ctx, card);
  //   if (cardType == "GRAPHIC") {
  //   }
  const playAction: Action = {
    id: "PlayCardAction",
    playerID: card.ownerID,
    cardID: card.id,
    position: null,
  };
  return [playAction];
};

module.exports = { askAction };
