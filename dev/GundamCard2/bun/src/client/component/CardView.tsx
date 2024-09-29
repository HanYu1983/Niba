import { useContext, useMemo } from "react";
import { getCard } from "../../game/gameState/CardTableComponent";
import { getImgSrc } from "../../script";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { getItemBaSyou, getItemController, getItemPrototype } from "../../game/gameState/ItemTableComponent";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { EffectFn } from "../../game/define/Effect";
import { EffectView } from "./EffectView";
import { prototype } from "events";
import { getSetGroupBattlePoint } from "../../game/gameState/setGroup";
import { getSetGroup, getSetGroupRoot } from "../../game/gameState/SetGroupComponent";
import { getCardIdByCoinId, getCoin, getCoinIdsByCardId } from "../../game/gameState/CoinTableComponent";
import { getCardTexts } from "../../game/gameState/card";

const CARD_SIZE = 100;

export const CardView = (props: {
  clientId: string;
  cardID: string;
  enabled: boolean;
  size?: number,
  isShowCmd?: boolean,
  isShowInfo?: boolean,
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
  const renderBp = useMemo(() => {
    const bp = getSetGroupBattlePoint(appContext.viewModel.model.gameState, props.cardID)
    return <div>{bp[0]}/{bp[0]}/{bp[0]}</div>
  }, [appContext.viewModel.model.gameState, props.cardID])
  const renderCoin = useMemo(() => {
    const isRoot = getSetGroupRoot(appContext.viewModel.model.gameState, props.cardID) == props.cardID
    if (isRoot == false) {
      return <></>
    }
    const coins = getCoinIdsByCardId(appContext.viewModel.model.gameState, props.cardID).map(id => getCoin(appContext.viewModel.model.gameState, id))
    return <div>
      {
        coins.map(coin => {
          return <div key={coin.id}>{JSON.stringify(coin.title)}</div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState, props.cardID])
  const renderText = useMemo(() => {
    const proto = getItemPrototype(appContext.viewModel.model.gameState, props.cardID)
    if (props.isShowInfo != true) {
      return <></>
    }
    let texts = getCardTexts(appContext.viewModel.model.gameState, props.cardID)
    texts = [...(proto.commandText ? [proto.commandText] : []), ...texts]
    return <div>
      <div>{proto.title}</div>
      {
        texts.map((text, i) => {
          return <div key={text.id}>
            <div style={{ border: "1px solid black" }}>{
              text.title[0] == "特殊型" ? JSON.stringify(text.title[1]) : text.description
            }</div>
          </div>
        })
      }
      <div style={{color: "grey"}}>{proto.description}</div>
    </div>
  }, [appContext.viewModel.model.gameState, props.cardID, props.isShowInfo])
  const renderCmds = useMemo(() => {
    if (props.isShowCmd && flow?.id == "FlowSetActiveEffectID") {
      return flow.tips.filter(e => EffectFn.getCardID(e) == props.cardID).map((tip) => {
        if (tip.id == null) {
          return <div>hide</div>;
        }
        return (
          <div key={tip.id}>
            <button style={{ width: "100%", height: "100px" }}
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
      })
    }
    return <></>
  }, [props.isShowCmd, flow])
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
        {renderCmds}
        {renderBp}
        {renderCoin}
        {renderText}
      </div>

    );
  }, [card, isVisible, appContext.viewModel.cardSelection, props, flow]);
  return render
};
