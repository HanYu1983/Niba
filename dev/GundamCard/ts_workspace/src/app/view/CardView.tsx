import React, { useContext, useMemo } from "react";
import { AppContext } from "../context";
import { askImgSrc } from "../../tool/data";
import { getCard } from "../../tool/table";
import { OnEvent } from "../../tool/eventCenter";

const CARD_SIZE = 100;

export const CardView = (props: { cardID: string }) => {
  const appContext = useContext(AppContext);
  const card = useMemo(() => {
    return getCard(appContext.viewModel.model.gameState.table, props.cardID);
  }, [props.cardID, appContext.viewModel.model.gameState.table]);
  if (card == null) {
    return <div>card({props.cardID}) not found</div>;
  }
  const render = useMemo(() => {
    return (
      <div
        style={{
          ...(card.tap ? { transform: "rotate(90deg)" } : null),
          border: "2px solid black",
          ...(appContext.viewModel.cardSelection[card.id]
            ? { border: "2px solid red" }
            : null),
        }}
        onClick={() => {
          OnEvent.next({ id: "OnClickCardEvent", card: card });
        }}
      >
        <img src={askImgSrc(card.protoID)} style={{ height: CARD_SIZE }}></img>
      </div>
    );
  }, [card, appContext.viewModel.cardSelection]);
  return <>{render}</>;
};
