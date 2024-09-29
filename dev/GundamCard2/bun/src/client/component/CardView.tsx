import { useContext, useMemo } from "react";
import { getCard } from "../../game/gameState/CardTableComponent";
import { getImgSrc } from "../../script";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { getItemBaSyou, getItemController } from "../../game/gameState/ItemTableComponent";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { EffectFn } from "../../game/define/Effect";
import { EffectView } from "./EffectView";

const CARD_SIZE = 100;

export const CardView = (props: {
  clientId: string;
  cardID: string;
  enabled: boolean;
  size?: number,
  isShowCmd?: boolean,
}) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return queryFlow(appContext.viewModel.model.gameState, props.clientId);
  }, [appContext.viewModel.model.gameState, props.clientId]);
  const flow = useMemo(() => {
    return flows.find(flow => {
      switch (flow.id) {
        case "FlowSetActiveEffectID":
          return true
      }
      return false
    })
  }, [flows])
  const card = useMemo(() => {
    return getCard(appContext.viewModel.model.gameState, props.cardID);
  }, [props.cardID, appContext.viewModel.model.gameState]);
  const isVisible = useMemo(() => {
    if (card.isFaceDown) {
      const baSyou = getItemBaSyou(appContext.viewModel.model.gameState, card.id);
      switch (baSyou.value[1]) {
        case "手札": {
          const controller = getItemController(appContext.viewModel.model.gameState, card.id);
          if (controller == props.clientId) {
            return true;
          }
          break
        }
        default:
          break;
      }
    }
    return card.isFaceDown != true
  }, [props.clientId, card, appContext.viewModel.model.gameState]);
  const render = useMemo(() => {
    const imgSrc = isVisible
      ? getImgSrc(card.protoID || "unknown")
      : "https://particle-979.appspot.com/common/images/card/cardback_0.jpg";
    const isSelect = appContext.viewModel.cardSelection.includes(card.id);
    return (
      <div>
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
          <img src={imgSrc} style={{ height: props.size || CARD_SIZE }}></img>
          <div hidden>{card.id}</div>
          <div hidden>{card.isFaceDown ? "O" : "X"}</div>
        </div>
        {
            (props.isShowCmd && flow?.id == "FlowSetActiveEffectID") ? flow.tips.filter(e => EffectFn.getCardID(e) == props.cardID).map((tip) => {
              if (tip.id == null) {
                return <div>hide</div>;
              }
              return (
                <div key={tip.id}>
                  <button style={{ width: "100%" }}
                    onClick={() => {
                      OnEvent.next({
                        id: "OnClickFlowConfirm",
                        clientId: props.clientId,
                        flow: { ...flow, effectID: tip.id },
                      });
                    }}
                  >
                    <div>{tip.text.description || tip.description}</div>
                  </button>
                </div>
              );
            }) : <></>
          }
      </div>

    );
  }, [card, isVisible, appContext.viewModel.cardSelection, props, flow]);
  return render
};
