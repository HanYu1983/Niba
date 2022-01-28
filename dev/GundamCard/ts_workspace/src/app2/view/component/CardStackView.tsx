import React, { useContext, useMemo, HTMLAttributes } from "react";
import { CardView } from "./CardView";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { AbsoluteBaSyou, getBaShouID } from "../../tool/tool/basic/basic";

const CARD_SIZE = 100;

export const CardStackView = (props: {
  clinetID: string;
  cardPosition: AbsoluteBaSyou;
}) => {
  const appContext = useContext(AppContext);
  const cards = useMemo(() => {
    return (
      appContext.viewModel.model.gameState.table.cardStack[
        getBaShouID(props.cardPosition)
      ] || []
    );
  }, [
    props.cardPosition,
    appContext.viewModel.model.gameState.table.cardStack,
  ]);
  // 整個setGroup一起移動
  const cardsOnlySetGroupRoot = useMemo(() => {
    return cards.filter((card) => {
      return appContext.viewModel.model.gameState.setGroupLink[card.id] == null;
    });
  }, [cards, appContext.viewModel.model.gameState.setGroupLink]);
  const render = useMemo(() => {
    const _cardPositionID = getBaShouID(props.cardPosition);
    return (
      <div
        style={{
          height: CARD_SIZE,
          display: "flex",
          border: "2px solid black",
          ...(appContext.viewModel.cardPositionSelection.includes(
            _cardPositionID
          )
            ? { border: "2px solid red" }
            : null),
        }}
      >
        <div>
          <button
            onClick={() => {
              // OnEvent.next({
              //   id: "OnClickCardPositionEvent",
              //   where: props.cardPosition,
              // });
            }}
          >
            select {_cardPositionID}
          </button>
        </div>
        {cardsOnlySetGroupRoot.map((rootCard) => {
          const cardsInSetGroup = [
            rootCard.id,
            ...Object.keys(
              appContext.viewModel.model.gameState.setGroupLink
            ).filter((setCardID) => {
              return (
                appContext.viewModel.model.gameState.setGroupLink[setCardID] ==
                rootCard.id
              );
            }),
          ];
          return (
            <div
              key={rootCard.id}
              style={{ border: "3px solid blue", display: "flex" }}
            >
              {cardsInSetGroup.map((cardID) => {
                return (
                  <CardView
                    key={`${rootCard.id}_${cardID}`}
                    enabled={true}
                    clientID={props.clinetID}
                    cardID={cardID}
                  ></CardView>
                );
              })}
            </div>
          );
        })}
        {
          // cards.map((card) => {
          //   return (
          //     <CardView
          //       key={card.id}
          //       enabled={true}
          //       clientID={props.clinetID}
          //       cardID={card.id}
          //     ></CardView>
          //   );
          // })
        }
      </div>
    );
  }, [
    props.cardPosition,
    props.clinetID,
    cardsOnlySetGroupRoot,
    appContext.viewModel.cardPositionSelection,
    appContext.viewModel.model.gameState.setGroupLink,
  ]);
  return <>{render}</>;
};
