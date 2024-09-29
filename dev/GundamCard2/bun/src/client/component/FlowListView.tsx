import { useContext, useMemo, useEffect } from "react";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { EffectView } from "./EffectView";
import { getEffect } from "../../game/gameState/EffectStackComponent";
import { getEffectIncludePlayerCommand } from "../../game/gameStateWithFlowMemory/effect";
import { CommandEffecTipFn } from "../../game/define/CommandEffectTip";
import { TargetMissingError } from "../../game/define/GameError";
import { createCommandEffectTips, setTipSelectionForUser } from "../../game/gameState/doEffect";
import { applyFlow, createAIChoiseList } from "../../game/gameStateWithFlowMemory/applyFlow";
import { GameStateWithFlowMemory } from "../../game/gameStateWithFlowMemory/GameStateWithFlowMemory";
import { Flow } from "../../game/gameStateWithFlowMemory/Flow";
import { PlayerA, PlayerB } from "../../game/define/PlayerID";
import { FlowSetTipSelectionView } from "./FlowSetTipSelectionView";

export const FlowListView = (props: { clientId: string }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return queryFlow(appContext.viewModel.model.gameState, props.clientId);
  }, [appContext.viewModel.model.gameState, props.clientId]);
  useEffect(() => {
    const speed = 50
    const isPlayerControl = true
    if (isPlayerControl && props.clientId == PlayerA) {
      const payCost = flows.find((flow) => flow.id == "FlowPassPayCost");
      if (payCost) {
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientId: props.clientId,
            flow: payCost,
          });
        }, speed)
        return
      }
      if (flows.length == 1) {
        const flow = flows[0]
        if (flow.id == "FlowCancelPassPhase") {
          return
        }
        if (flow.id == "FlowCancelPassCut") {
          return
        }
        if (flow.id == "FlowWaitPlayer") {
          return
        }
        if (flow.id == "FlowCancelActiveEffectID") {
          return
        }
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientId: props.clientId,
            flow: flow,
          });
        }, speed)
      }
      return
    }
    if (flows.length) {
      const useFlows = flows.filter(flow => {
        switch (flow.id) {
          case "FlowCancelActiveEffectID":
          case "FlowCancelActiveLogicID":
          case "FlowCancelPassCut":
          case "FlowCancelPassPhase":
          case "FlowWaitPlayer":
          case "FlowObserveEffect":
            return false
        }
        return true
      })
      if (useFlows.length == 0) {
        return
      }
      let flow = useFlows[Math.round(Math.random() * 1000) % useFlows.length]
      setTimeout(() => {
        OnEvent.next({
          id: "OnClickFlowConfirm",
          clientId: props.clientId,
          flow: flow,
        });
      }, speed)
    }
  }, [appContext.viewModel.model.gameState, props.clientId, flows]);
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        {flows.map((flow, i) => {
          return (
            <div key={i} style={{ border: "1px solid black" }}>
              <button
                onClick={() => {
                  OnEvent.next({
                    id: "OnClickFlowConfirm",
                    clientId: props.clientId,
                    flow: flow,
                  });
                }}
              >
                {flow.id}({flow.description})
              </button>
              {(() => {
                switch (flow.id) {
                  case "FlowPassPayCost":
                    return (
                      <EffectView
                        enabled={true}
                        clientId={props.clientId}
                        effectID={flow.effectID}
                      ></EffectView>
                    );
                  case "FlowDoEffect":
                  case "FlowObserveEffect":
                    return (
                      <EffectView
                        enabled={false}
                        clientId={props.clientId}
                        effectID={flow.effectID}
                      ></EffectView>
                    );
                  case "FlowSetTipSelection":
                    const effect = getEffect(appContext.viewModel.model.gameState, flow.effectID)
                    return <>
                      <div>{effect.text.description || effect.description}</div>
                      <FlowSetTipSelectionView clientId={props.clientId} flow={flow}></FlowSetTipSelectionView>
                    </>
                  case "FlowSetActiveEffectID":
                    return flow.tips.map((tip) => {
                      if (tip.id == null) {
                        return <div>hide</div>;
                      }
                      return (
                        <div key={tip.id}>
                          {
                            tip.reason[0] == "GameRule" ? <>
                              <button
                                onClick={() => {
                                  OnEvent.next({
                                    id: "OnClickFlowConfirm",
                                    clientId: props.clientId,
                                    flow: { ...flow, effectID: tip.id },
                                  });
                                }}
                              >
                                {flow.description}({tip.id})
                              </button>
                            </> : <></>
                          }
                          {/*
                          <EffectView
                            enabled={false}
                            clientId={props.clientId}
                            effectID={tip.id}
                          ></EffectView>
                          */}
                        </div>
                      );
                    });
                  default:
                    return <></>
                }
              })()}
            </div>
          );
        })}
      </div>
    );
  }, [flows, props.clientId]);
  return renderControlPanel;
};
