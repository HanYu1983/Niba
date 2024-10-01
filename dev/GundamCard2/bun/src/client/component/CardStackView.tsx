import { useContext, useMemo } from "react";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../../game/define/BaSyou";
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";

export const CardStackView = (props: {
  clientId: string;
  cardPosition: AbsoluteBaSyou;
  cardSize?: number;
  isShowCardInfo?: boolean,
  isShowStack?: boolean,
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
    appContext.viewModel.model.gameState,
  ]);
  // 整個setGroup一起移動
  const cardsOnlySetGroupRoot = useMemo(() => {
    return cards.filter((cardId) => {
      return appContext.viewModel.model.gameState.setGroup.itemGroupParent[cardId] == null
    });
  }, [cards, appContext.viewModel.model.gameState.setGroup.itemGroupParent]);
  const render = useMemo(() => {
    const _cardPositionID = AbsoluteBaSyouFn.toString(props.cardPosition);
    if (props.isShowStack) {
      return <div>
        <CardView></CardView>
        <div>{cards.length} cards</div>
      </div>
    }
    return (
      <div
        style={{
          display: "flex",
          border: "2px solid black",
          overflow: "scroll",
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
            {_cardPositionID}
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
              style={{ display: "flex" }}
            >
              {cardsInSetGroup.map((cardID, i) => {
                return (
                  <CardView
                    key={cardID}
                    enabled={true}
                    clientId={props.clientId}
                    cardID={cardID}
                    size={props.cardSize}
                    isShowCmd={true}
                    isShowInfo={props.isShowCardInfo}
                  ></CardView>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }, [
    props,
    cardsOnlySetGroupRoot,
    appContext.viewModel.cardPositionSelection,
    appContext.viewModel.model,
    cards
  ]);
  return render;
};

