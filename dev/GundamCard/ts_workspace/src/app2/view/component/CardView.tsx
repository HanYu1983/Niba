import React, { useContext, useMemo } from "react";
import { getCard } from "../../../tool/table";
import { getImgSrc } from "../../tool/alg/script";
import { getCardController } from "../../tool/tool/basic/handleCard";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";

const CARD_SIZE = 100;

export const CardView = (props: {
  clientID?: string;
  cardID: string;
  enabled: boolean;
  visible: boolean;
}) => {
  const appContext = useContext(AppContext);
  const card = useMemo(() => {
    return getCard(appContext.viewModel.model.gameState.table, props.cardID);
  }, [props.cardID, appContext.viewModel.model.gameState.table]);
  if (card == null) {
    return <div>card({props.cardID}) not found</div>;
  }
  const controller = useMemo(() => {
    return getCardController(appContext.viewModel.model, props.cardID);
  }, [props.cardID]);
  const isMyControl = useMemo(() => {
    return controller == props.clientID;
  }, [appContext.viewModel.model, controller, props.clientID]);
  const isVisible = useMemo(() => {
    if (props.visible == false) {
      return false;
    }
    if (card.faceDown) {
      if (isMyControl) {
        return true;
      }
    }
    return card.faceDown;
  }, [props.visible, isMyControl, card.faceDown]);
  const render = useMemo(() => {
    const imgSrc = isVisible
      ? getImgSrc(card.protoID)
      : "https://particle-979.appspot.com/common/images/card/cardback_0.jpg";
    const isSelect = appContext.viewModel.cardSelection.includes(card.id);
    return (
      <div
        style={{
          border: "2px solid black",
          ...(isSelect ? { border: "2px solid red" } : null),
          ...(card.tap ? { transform: "rotate(90deg)" } : null),
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
        <div>{controller}</div>
        <div>{card.faceDown ? "O" : "X"}</div>
        <div>{isMyControl ? "O" : "X"}</div>
      </div>
    );
  }, [
    card,
    isVisible,
    controller,
    isMyControl,
    appContext.viewModel.cardSelection,
    props.enabled,
  ]);
  return <>{render}</>;
};
