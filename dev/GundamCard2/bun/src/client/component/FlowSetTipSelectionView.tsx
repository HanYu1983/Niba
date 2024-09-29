import { useContext, useMemo, useState } from "react";
import { AppContext } from "../tool/appContext";
import { Flow, FlowSetTipSelection } from "../../game/gameStateWithFlowMemory/Flow";
import { StrBaSyouPair, Tip, TipFn } from "../../game/define/Tip";
import { CardView } from "./CardView";
import { createStrBaSyouPair } from "../../game/gameState/ItemTableComponent";
import { OnEvent } from "../tool/appContext/eventCenter";
import { getEffect } from "../../game/gameState/EffectStackComponent";

export const FlowSetTipSelectionView = (props: { clientId: string, flow: FlowSetTipSelection }) => {
  const appContext = useContext(AppContext);
  const renderWant = useMemo(() => {
    const wants = TipFn.getWant(props.flow.tip)
    switch (props.flow.tip.title[0]) {
      case "カード": {
        const pairs = wants as StrBaSyouPair[]
        const cardIds = pairs.map(p => p[0])
        return <div style={{
          display: "flex",
          border: "2px solid black",
          overflow: "scroll",
        }}>
          {
            cardIds.map(cardId => (
              <CardView
                key={cardId}
                enabled={true}
                clientId={props.clientId}
                cardID={cardId}
                size={200}
              ></CardView>)
            )
          }
        </div>
      }
    }
    return <div>not support {props.flow.tip.title[0]}</div>
  }, [props])

  const userSelection = useMemo(() => {
    const wants = TipFn.getWant(props.flow.tip)
    switch (props.flow.tip.title[0]) {
      case "カード": {
        const wantsPairs = wants as StrBaSyouPair[]
        const wantCardIds = wantsPairs.map(p => p[0])
        const cardIds = appContext.viewModel.cardSelection.filter(cardId => wantCardIds.includes(cardId))
        return cardIds
      }
    }
    return []
  }, [props, appContext.viewModel.cardSelection])
  // const renderSelection = useMemo(() => {
  //   return userSelection.map(cardId => (
  //     <CardView
  //       key={cardId}
  //       enabled={true}
  //       clientId={props.clientId}
  //       cardID={cardId}
  //       size={200}
  //     ></CardView>)
  //   )
  // }, [props, userSelection])
  const userTip = useMemo(() => {
    const tip: Tip = {
      ...props.flow.tip,
      title: [
        "カード",
        TipFn.getWant(props.flow.tip) as StrBaSyouPair[],
        userSelection.map(cardId => createStrBaSyouPair(appContext.viewModel.model.gameState, cardId))
      ],
    }
    return tip
  }, [props, userSelection, appContext.viewModel.model.gameState])
  const renderCheckTip = useMemo(() => {
    const error = TipFn.checkTipSatisfies(userTip)
    if (error) {
      return <div>{error.message}</div>
    }
    return <>OK</>
  }, [userTip])
  const renderButton = useMemo(() => {
    const flow = {
      ...props.flow,
      tip: userTip,
    }
    return <button
      onClick={() => {
        OnEvent.next({
          id: "OnClickFlowConfirm",
          clientId: props.clientId,
          flow: flow,
        });
      }}
    >
      {renderCheckTip}
    </button>
  }, [renderCheckTip, userTip])
  const render = useMemo(() => {
    return <div>
      <div>
        {renderWant}
        {renderButton}
      </div>
    </div>
  }, [renderWant, renderCheckTip])
  return render
}