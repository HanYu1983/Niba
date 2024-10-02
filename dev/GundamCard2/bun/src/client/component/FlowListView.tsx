import { useContext, useMemo, useEffect, CSSProperties } from "react";
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
import { CardView } from "./CardView";
import { EffectFn } from "../../game/define/Effect";

export const FlowListView = (props: { clientId: string, style?: CSSProperties }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return appContext.viewModel.playerCommands[props.clientId] || []
  }, [appContext.viewModel.playerCommands[props.clientId]]);
  useEffect(() => {
    const speed = 10
    const isPlayerControl = true
    if (isPlayerControl && props.clientId == PlayerA) {
      // const payCost = flows.find((flow) => flow.id == "FlowPassPayCost");
      // if (payCost) {
      //   setTimeout(() => {
      //     OnEvent.next({
      //       id: "OnClickFlowConfirm",
      //       clientId: props.clientId,
      //       flow: payCost,
      //     });
      //   }, speed)
      //   return
      // }
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
        if (flow.id == "FlowSetTipSelection") {
          return
        }
        if (flow.id == "FlowDeleteImmediateEffect") {
          return
        }
        if (flow.id == "FlowSetActiveEffectID") {
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
      <div style={props.style}>
        {flows.map((flow, i) => {
          return (
            <div key={i}
              style={{ border: "1px solid black" }}
            >
              <button style={{
                height: 50

              }}
                onClick={() => {
                  OnEvent.next({
                    id: "OnClickFlowConfirm",
                    clientId: props.clientId,
                    flow: flow,
                  });
                }}>
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
                    return <div style={{ border: "1px solid black" }}>
                      <FlowSetTipSelectionView clientId={props.clientId} flow={flow}></FlowSetTipSelectionView>
                    </div>
                  case "FlowSetActiveEffectID":
                    return flow.tips.filter(tip => tip.reason[0] == "GameRule").map((tip, i) => {
                      return (
                        <div key={tip.id} style={{ display: "flex", width: "100%" }}>
                          {
                            tip.reason[0] == "GameRule" ? <>
                              <button
                                style={{ flex: 1, height: 50 }}
                                onClick={() => {
                                  OnEvent.next({
                                    id: "OnClickFlowConfirm",
                                    clientId: props.clientId,
                                    flow: { ...flow, effectID: tip.id },
                                  });
                                }}
                              >
                                {tip.text.description || tip.description}
                              </button>
                            </> : <></>
                          }
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
