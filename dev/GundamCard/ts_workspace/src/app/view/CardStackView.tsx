import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";
import { cardPositionID } from "../../model/alg/tool";
import { CardPosition } from "../../tool/types";
import { CardView } from "./CardView";

const CARD_SIZE = 100;

export const CardStackView = (props: { cardPosition: CardPosition }) => {
  const appContext = useContext(AppContext);
  const cards = useMemo(() => {
    return (
      appContext.viewModel.model.gameState.table.cardStack[
        cardPositionID(props.cardPosition)
      ] || []
    );
  }, [
    props.cardPosition,
    appContext.viewModel.model.gameState.table.cardStack,
  ]);
  return (
    <div style={{ border: "1px solid", height: CARD_SIZE, display: "flex" }}>
      <div style={{ width: 100 }}></div>
      {cards.map((card) => {
        return <CardView key={card.id} cardID={card.id}></CardView>;
      })}
    </div>
  );
};
