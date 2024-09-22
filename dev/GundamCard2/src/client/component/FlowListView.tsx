import { useContext, useMemo, useEffect } from "react";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { EffectView } from "./EffectView";
import { getEffect } from "../../game/gameState/EffectStackComponent";

export const FlowListView = (props: { clientID: string }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return queryFlow(appContext.viewModel.model.gameState, props.clientID);
  }, [appContext.viewModel.model.gameState, props.clientID]);
  useEffect(() => {
    const payCost = flows.find((flow) => flow.id == "FlowPassPayCost");
    if (payCost == null) {
      return;
    }
    if (payCost.id != "FlowPassPayCost") {
      throw new Error("must be FlowPassPayCost");
    }
    const effect = getEffect(appContext.viewModel.model.gameState, payCost.effectID)
    if (effect == null) {
      throw new Error("must find effect");
    }
    if (effect.text.conditions == null) {
      OnEvent.next({
        id: "OnClickFlowConfirm",
        clientID: props.clientID,
        flow: payCost,
      });
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
                                flow: { ...flow, effectID: tip.id || "" },
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
