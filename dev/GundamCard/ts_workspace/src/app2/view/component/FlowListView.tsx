import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { queryFlow, Flow } from "../../tool/alg/handleClient";
import { iterateEffect } from "../../tool/tool/basic/gameContext";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { BlockPayloadView } from "./BlockPayloadView";

export const FlowListView = (props: { clientID: string }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return queryFlow(appContext.viewModel.model, props.clientID);
  }, [appContext.viewModel.model, props.clientID]);
  useEffect(() => {
    const payCost = flows.find((flow) => flow.id == "FlowPassPayCost");
    if (payCost == null) {
      return;
    }
    if (payCost.id != "FlowPassPayCost") {
      throw new Error("must be FlowPassPayCost");
    }
    const effect = iterateEffect(appContext.viewModel.model).find(
      (e) => e.id == payCost.effectID
    );
    if (effect == null) {
      throw new Error("must find effect");
    }
    if (effect.require == null) {
      OnEvent.next({
        id: "OnClickFlowConfirm",
        clientID: props.clientID,
        flow: payCost,
      });
    }
  }, [appContext.viewModel.model, props.clientID, flows]);
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
                      <BlockPayloadView
                        enabled={true}
                        clientID={props.clientID}
                        blockID={flow.effectID}
                      ></BlockPayloadView>
                    );
                  case "FlowDoEffect":
                  case "FlowObserveEffect":
                    return (
                      <BlockPayloadView
                        enabled={false}
                        clientID={props.clientID}
                        blockID={flow.effectID}
                      ></BlockPayloadView>
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
                          <BlockPayloadView
                            enabled={false}
                            clientID={props.clientID}
                            blockID={tip.id}
                          ></BlockPayloadView>
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
