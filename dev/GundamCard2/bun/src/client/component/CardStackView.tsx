import { useContext, useMemo } from "react";
import { AbsoluteBaSyou, AbsoluteBaSyouFn, BaSyouKeywordFn } from "../../game/define/BaSyou";
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";
import { getSetGroup, getSetGroupChildren, getSetGroupRoot } from "../../game/gameState/SetGroupComponent";
import { getBattleGroupBattlePoint } from "../../game/gameState/battleGroup";

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
    appContext.viewModel.model.gameState.table.cardStack,
  ]);
  // 整個setGroup一起移動
  const cardsOnlySetGroupRoot = useMemo(() => {
    return cards.filter((cardId) => {
      return getSetGroupRoot(appContext.viewModel.model.gameState, cardId) == cardId
    });
  }, [cards, appContext.viewModel.model.gameState]);
  const renderBattlePoint = useMemo(() => {
    if (BaSyouKeywordFn.getBattleArea().includes(props.cardPosition.value[1]) != true) {
      return <></>
    }
    const bp = getBattleGroupBattlePoint(appContext.viewModel.model.gameState, cardsOnlySetGroupRoot)
    return <>
      <div>部隊戰鬥力:{bp}</div>
    </>
  }, [props.cardPosition, appContext.viewModel.model.gameState, cardsOnlySetGroupRoot])
  const render = useMemo(() => {
    const _cardPositionID = AbsoluteBaSyouFn.toString(props.cardPosition);
    if (props.isShowStack) {
      return <div>
        <CardView></CardView>
        <div>{cards.length} cards</div>
      </div>
    }
    return (
      <>
        <div>
          <button
            onClick={() => {
              // OnEvent.next({
              //   id: "OnClickCardPositionEvent",
              //   where: props.cardPosition,
              // });
            }}
          >
            {_cardPositionID}:{cards.length}:{renderBattlePoint}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            border: "2px solid black",
            overflow: "scroll",
            ...(appContext.viewModel.cardPositionSelection.includes(_cardPositionID) ? { border: "2px solid red" } : null),
          }}
        >
          {cardsOnlySetGroupRoot.map((rootCardId) => {
            const cardsInSetGroup = getSetGroup(appContext.viewModel.model.gameState, rootCardId)
            return (
              <div
                key={rootCardId}
                style={{ display: "flex", border: "2px solid blue" }}
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
      </>
    );
  }, [
    props,
    cardsOnlySetGroupRoot,
    appContext.viewModel.cardPositionSelection,
    appContext.viewModel.model,
    appContext.viewModel.model.gameState,
    cards,
    renderBattlePoint
  ]);
  return render;
};

