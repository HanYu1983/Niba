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
import { getGlobalEffects } from "../../game/gameState/globalEffects";
import { TipFn } from "../../game/define/Tip";

const CARD_SIZE = 100;

export const CardView = (props: {
  clientId?: string;
  cardID?: string;
  enabled?: boolean;
  size?: number,
  isShowCmd?: boolean,
  isShowInfo?: boolean,
  isCheat?: boolean
}) => {
  if (props.cardID == null || props.clientId == null) {
    return <img src={"https://particle-979.appspot.com/common/images/card/cardback_0.jpg"} style={{ height: props.size || CARD_SIZE }}></img>
  }
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return appContext.viewModel.playerCommands[props.clientId || "unknown"] || []
  }, [appContext.viewModel.playerCommands]);
  const tipTargetCardIds = useMemo(() => {
    return flows.filter(flow => flow.id == "FlowSetTipSelection").flatMap(flow=>{
      switch (flow.tip.title[0]) {
        case "カード":
          return flow.tip.title[1].map(i => i[0])
      }
      return []
    })
  }, [flows])
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
    return getCard(appContext.viewModel.model.gameState, props.cardID || "unknown");
  }, [props.cardID, appContext.viewModel.model.gameState]);
  const isVisible = useMemo(() => {
    if (props.isCheat) {
      return true
    }
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
  }, [props.clientId, props.isCheat, card, appContext.viewModel.model.gameState]);
  const renderBp = useMemo(() => {
    const bp = getSetGroupBattlePoint(appContext.viewModel.model.gameState, props.cardID || "unknown")
    return <div>{bp[0]}/{bp[1]}/{bp[2]}</div>
  }, [appContext.viewModel.model.gameState, props.cardID])
  const renderCoin = useMemo(() => {
    const isRoot = getSetGroupRoot(appContext.viewModel.model.gameState, props.cardID || "unknown") == props.cardID
    if (isRoot == false) {
      return <></>
    }
    const coins = getCoinIdsByCardId(appContext.viewModel.model.gameState, props.cardID || "unknown").map(id => getCoin(appContext.viewModel.model.gameState, id))
    return <div>
      {
        coins.map(coin => {
          return <div key={coin.id}>{JSON.stringify(coin.title)}</div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState, props.cardID])
  const renderGlobalEffects = useMemo(() => {
    const isRoot = getSetGroupRoot(appContext.viewModel.model.gameState, props.cardID || "unknown") == props.cardID
    if (isRoot == false) {
      return <></>
    }
    const ges = getGlobalEffects(appContext.viewModel.model.gameState, null).filter(ge => ge.cardIds.includes(props.cardID || "unknown"))
    return <div>
      {
        ges.map((ge, i) => {
          return <div key={i}>{JSON.stringify(ge.title)}</div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState, props.cardID])
  const renderText = useMemo(() => {
    const proto = getItemPrototype(appContext.viewModel.model.gameState, props.cardID || "unknown")
    if (props.isShowInfo != true) {
      return <></>
    }
    let texts = getCardTexts(appContext.viewModel.model.gameState, props.cardID || "unknown")
    texts = [...(proto.commandText ? [proto.commandText] : []), ...texts]
    return <div>
      <div>{proto.title}</div>
      {
        texts.map((text, i) => {
          return <div key={i}>
            <div style={{ border: "1px solid black" }}>{
              text.title[0] == "特殊型" ? JSON.stringify(text.title[1]) : text.description
            }</div>
          </div>
        })
      }
      <div>{proto.characteristic}</div>
      <div style={{ color: "grey" }}>{proto.description}</div>
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
                  clientId: props.clientId || "unknown",
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
      <div style={{
        ...(tipTargetCardIds.includes(card.id) ? {
          border: "2px solid lightgreen"
        } : null)
      }}>
        <div
          style={{
            border: "2px solid black",
            ...(isSelect ? { border: "2px solid red" } : null),
          }}
          onClick={() => {
            if (props.enabled == false) {
              return;
            }
            OnEvent.next({ id: "OnClickCardEvent", card: card });
          }}
        >
          <div style={{
            ...(card.isRoll ? { transform: "rotate(90deg)" } : null),
          }}>
            <img src={imgSrc} style={{ height: props.size || CARD_SIZE }}></img>
          </div>
          {
            isVisible ? <>
              <div>{card.id}</div>
              {renderCmds}
              {renderBp}
              {renderCoin}
              {renderGlobalEffects}
              {renderText}
            </> : <></>
          }
        </div>

      </div>

    );
  }, [props, card, isVisible, appContext.viewModel.cardSelection, renderCmds, renderBp, renderCoin, renderGlobalEffects, tipTargetCardIds]);
  return render
};
