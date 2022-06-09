import React, { useContext, useMemo } from "react";
import { getCard } from "../../../tool/table";
import { getImgSrc } from "../../tool/alg/script";
import {
  getCardBaSyou,
  getCardController,
} from "../../tool/tool/basic/handleCard";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";

const CARD_SIZE = 100;

export const CardView = (props: {
  clientID?: string;
  cardID: string;
  enabled: boolean;
}) => {
  const appContext = useContext(AppContext);
  const card = useMemo(() => {
    return getCard(appContext.viewModel.model.gameState.table, props.cardID);
  }, [props.cardID, appContext.viewModel.model.gameState.table]);
  if (card == null) {
    return <div>card({props.cardID}) not found</div>;
  }
  const isVisible = useMemo(() => {
    if (card.faceDown) {
      const baSyou = getCardBaSyou(appContext.viewModel.model, card.id);
      switch (baSyou.value[1]) {
        case "手札": {
          const controller = getCardController(
            appContext.viewModel.model,
            props.cardID
          );
          if (controller == props.clientID) {
            return true;
          }
        }
        default:
          break;
      }
    }
    return card.faceDown == false;
  }, [props.clientID, card.faceDown, appContext.viewModel.model]);
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
        <div>{card.faceDown ? "O" : "X"}</div>
      </div>
    );
  }, [card, isVisible, appContext.viewModel.cardSelection, props.enabled]);
  return <>{render}</>;
};
