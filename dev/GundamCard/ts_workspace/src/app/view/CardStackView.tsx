import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";
import { cardPositionID } from "../../model/alg/tool";
import { CardPosition } from "../../tool/types";
import { CardView } from "./CardView";
import { OnEvent } from "../../tool/eventCenter";
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
  const render = useMemo(() => {
    const _cardPositionID = cardPositionID(props.cardPosition);
    return (
      <div
        style={{
          height: CARD_SIZE,
          display: "flex",
          border: "2px solid black",
          ...(appContext.viewModel.cardPositionSelection[_cardPositionID]
            ? { border: "2px solid red" }
            : null),
        }}
      >
        <div style={{ width: 100 }}>
          <button
            onClick={() => {
              OnEvent.next({
                id: "OnClickCardPositionEvent",
                where: props.cardPosition,
              });
            }}
          >
            select
          </button>
        </div>
        {cards.map((card) => {
          return <CardView key={card.id} cardID={card.id}></CardView>;
        })}
      </div>
    );
  }, [props.cardPosition, cards, appContext.viewModel.cardPositionSelection]);
  return <>{render}</>;
};
