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

export const FlowListView = (props: { clientID: string }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return queryFlow(appContext.viewModel.model.gameState, props.clientID);
  }, [appContext.viewModel.model.gameState, props.clientID]);
  useEffect(() => {
    const speed = 50
    const isPlayerControl = false
    if (isPlayerControl && props.clientID == PlayerA) {
      const payCost = flows.find((flow) => flow.id == "FlowPassPayCost");
      if (payCost) {
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientID: props.clientID,
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
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientID: props.clientID,
            flow: flow,
          });
        }, speed)
      }
      return
    }
    if (flows.length) {
      //const aiChoiseList = flows.flatMap(flow => createAIChoiseList(appContext.viewModel.model.gameState, flow))
      // if (aiChoiseList.length > 0) {
      //   aiChoiseList.sort((a, b) => b.weight - a.weight)
      //   const flow = aiChoiseList[0].flow
      //   setTimeout(() => {
      //     OnEvent.next({
      //       id: "OnClickFlowConfirm",
      //       clientID: props.clientID,
      //       flow: flow,
      //     });
      //   }, speed)
      // }
      let flow: Flow | undefined = flows.find((flow) => flow.id == "FlowPassPayCost")
      if (flow == null) {
        flow = flows[Math.round(Math.random() * 1000) % flows.length]
      }
      if (flow.id == "FlowCancelPassPhase") {
        return
      }
      if (flow.id == "FlowCancelPassCut") {
        return
      }
      if (flow) {
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientID: props.clientID,
            flow: flow,
          });
        }, speed)
      }
    }
  }, [appContext.viewModel.model.gameState, props.clientID, flows]);
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
                    clientID: props.clientID,
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
                        clientID={props.clientID}
                        effectID={flow.effectID}
                      ></EffectView>
                    );
                  case "FlowDoEffect":
                  case "FlowObserveEffect":
                    return (
                      <EffectView
                        enabled={false}
                        clientID={props.clientID}
                        effectID={flow.effectID}
                      ></EffectView>
                    );
                  case "FlowSetActiveEffectID":
                    return flow.tips.map((tip) => {
                      if (tip.id == null) {
                        return <div>hide</div>;
                      }
                      return (
                        <div key={tip.id}>
                          <button
                            onClick={() => {
                              OnEvent.next({
                                id: "OnClickFlowConfirm",
                                clientID: props.clientID,
                                flow: { ...flow, effectID: tip.id },
                              });
                            }}
                          >
                            {flow.description}({tip.id})
                          </button>
                          <EffectView
                            enabled={false}
                            clientID={props.clientID}
                            effectID={tip.id}
                          ></EffectView>
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
  }, [flows, props.clientID]);
  return renderControlPanel;
};
