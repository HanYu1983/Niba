import { useContext, useMemo, useEffect, CSSProperties } from "react";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { EffectView } from "./EffectView";
import { FlowSetTipSelectionView } from "./FlowSetTipSelectionView";

export const FlowListView = (props: { clientId: string, style?: CSSProperties }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return appContext.viewModel.playerCommands[props.clientId] || []
  }, [appContext.viewModel.playerCommands[props.clientId]]);
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
                    versionID: appContext.viewModel.model.versionID
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
                  case "FlowSetActiveLogicID":
                    return <div>
                      <div>選擇一個行為</div>
                      {
                        flow.tips.map((tip, i) => {
                          return <button
                            key={i}
                            onClick={() => {
                              OnEvent.next({
                                id: "OnClickFlowConfirm",
                                clientId: props.clientId,
                                flow: { ...flow, logicID: tip.logicID, logicSubID: tip.logicSubID },
                                versionID: appContext.viewModel.model.versionID
                              });
                            }}
                          >
                            {JSON.stringify(tip.conditionKeys)}
                          </button>
                        })
                      }
                    </div>
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
                                    versionID: appContext.viewModel.model.versionID
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
