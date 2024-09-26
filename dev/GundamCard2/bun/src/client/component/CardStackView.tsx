import { useContext, useMemo } from "react";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../../game/define/BaSyou";
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";

export const CardStackView = (props: {
  clinetID: string;
  cardPosition: AbsoluteBaSyou;
}) => {
  const appContext = useContext(AppContext);
  const cards = useMemo(() => {
    return (
      appContext.viewModel.model.gameState.table.cardStack[
      AbsoluteBaSyouFn.toString(props.cardPosition)
      ] || []
    );
  }, [
    props.cardPosition,
    appContext.viewModel.model.gameState.table.cardStack,
  ]);
  // 整個setGroup一起移動
  const cardsOnlySetGroupRoot = useMemo(() => {
    return cards.filter((cardId) => {
      return appContext.viewModel.model.gameState.setGroup.itemGroupParent[cardId] == null
    });
  }, [cards, appContext.viewModel.model.gameState.setGroup.itemGroupParent]);
  const render = useMemo(() => {
    const _cardPositionID = AbsoluteBaSyouFn.toString(props.cardPosition);
    return (
      <div
        style={{
          //height: CARD_SIZE,
          display: "flex",
          border: "2px solid black",
          ...(appContext.viewModel.cardPositionSelection.includes(_cardPositionID) ? { border: "2px solid red" } : null),
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
        {cardsOnlySetGroupRoot.map((rootCardId) => {
          const cardsInSetGroup = [
            rootCardId,
            ...Object.keys(appContext.viewModel.model.gameState.setGroup.itemGroupParent).filter((setCardID) => {
              return appContext.viewModel.model.gameState.setGroup.itemGroupParent[setCardID] == rootCardId
            }),
          ];
          return (
            <div
              key={rootCardId}
              style={{ border: "3px solid blue", display: "flex" }}
            >
              {cardsInSetGroup.map((cardID, i) => {
                return (
                  <CardView
                    key={`${rootCardId}_${cardID}_${i}`}
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
    appContext.viewModel.model.gameState.setGroup.itemGroupParent,
  ]);
  return render;
};

