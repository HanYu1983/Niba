import React, { useContext, useMemo } from "react";
import { getCard } from "../../../tool/table";
import { getImgSrc } from "../../tool/alg/script";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";

const CARD_SIZE = 100;

export const CardView = (props: { clientID?: string; cardID: string }) => {
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
        <div>{card.id}</div>
        <img src={getImgSrc(card.protoID)} style={{ height: CARD_SIZE }}></img>
      </div>
    );
  }, [card, appContext.viewModel.cardSelection]);
  return <>{render}</>;
};
