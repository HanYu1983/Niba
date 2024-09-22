import { useContext, useMemo } from "react";
import { getCard } from "../../game/gameState/CardTableComponent";
import { getImgSrc } from "../../script";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { getItemBaSyou, getItemController } from "../../game/gameState/ItemTableComponent";

const CARD_SIZE = 100;

export const CardView = (props: {
  clientID?: string;
  cardID: string;
  enabled: boolean;
}) => {
  const appContext = useContext(AppContext);
  const card = useMemo(() => {
    return getCard(appContext.viewModel.model.gameState, props.cardID);
  }, [props.cardID, appContext.viewModel.model.gameState.table]);
  if (card == null) {
    return <div>card({props.cardID}) not found</div>;
  }
  const isVisible = useMemo(() => {
    if (card.isFaceDown) {
      const baSyou = getItemBaSyou(appContext.viewModel.model.gameState, card.id);
      switch (baSyou.value[1]) {
        case "手札": {
          const controller = getItemController(
            appContext.viewModel.model.gameState,
            props.cardID
          );
          if (controller == props.clientID) {
            return true;
          }
          break
        }
        default:
          break;
      }
    }
    return card.isFaceDown == false;
  }, [props.clientID, card.isFaceDown, appContext.viewModel.model]);
  const render = useMemo(() => {
    const imgSrc = isVisible
      ? getImgSrc(card.id)
      : "https://particle-979.appspot.com/common/images/card/cardback_0.jpg";
    const isSelect = appContext.viewModel.cardSelection.includes(card.id);
    return (
      <div
        style={{
          border: "2px solid black",
          ...(isSelect ? { border: "2px solid red" } : null),
          ...(card.isRoll ? { transform: "rotate(90deg)" } : null),
        }}
        onClick={() => {
          if (props.enabled == false) {
            return;
          }
          OnEvent.next({ id: "OnClickCardEvent", card: card });
        }}
      >
        <img src={imgSrc} style={{ height: CARD_SIZE }}></img>
        <div>{card.id}</div>
        <div>{card.isFaceDown ? "O" : "X"}</div>
      </div>
    );
  }, [card, isVisible, appContext.viewModel.cardSelection, props.enabled]);
  return <>{render}</>;
};
