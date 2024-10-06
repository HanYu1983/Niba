import { useContext, useMemo, useEffect, CSSProperties } from "react";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { EffectView } from "./EffectView";
import { getEffect, isImmediateEffect } from "../../game/gameState/EffectStackComponent";
import { PlayerA, PlayerB } from "../../game/define/PlayerID";
import { FlowSetTipSelectionView } from "./FlowSetTipSelectionView";
import { getPhase } from "../../game/gameState/PhaseComponent";
import { PhaseFn } from "../../game/define/Timing";
import { thinkVer1 } from "../../game/gameStateWithFlowMemory/ai/thinkVer1";

export const FlowListView = (props: { clientId: string, style?: CSSProperties }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return appContext.viewModel.playerCommands[props.clientId] || []
  }, [appContext.viewModel.playerCommands[props.clientId]]);
  useEffect(() => {
    const speed = 10
    const isPlayerControl = false
    if (isPlayerControl && props.clientId == PlayerA) {
      // 規定效果自動按
      const phase = getPhase(appContext.viewModel.model.gameState)
      if (PhaseFn.isRuleEffect(phase)) {
        let flow = flows.find(flow => flow.id == "FlowPassPayCost")
        if (flow == null) {
          flows.find(flow => flow.id == "FlowSetActiveEffectID" && phase[0] == "戦闘フェイズ" && (phase[1] != "攻撃ステップ" && phase[1] != "防御ステップ"))
        }
        if (flow != null) {
          setTimeout(() => {
            OnEvent.next({
              id: "OnClickFlowConfirm",
              clientId: props.clientId,
              flow: flow,
              versionID: appContext.viewModel.model.versionID
            });
          }, speed)
          return
        }
      }
      {
        // 立即效果自動按
        const flow = flows.find(flow => flow.id == "FlowPassPayCost")
        if (flow && isImmediateEffect(appContext.viewModel.model.gameState, flow.effectID)) {
          setTimeout(() => {
            OnEvent.next({
              id: "OnClickFlowConfirm",
              clientId: props.clientId,
              flow: flow,
              versionID: appContext.viewModel.model.versionID
            });
          }, speed)
          return
        }
      }
      // 只剩下一個命令時自動按，一些狀況除外
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
        if (flow.id == "FlowDeleteImmediateEffect") {
          return
        }
        if (flow.id == "FlowSetTipSelection") {
          return
        }

        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientId: props.clientId,
            flow: flow,
            versionID: appContext.viewModel.model.versionID
          });
        }, speed)
      }
      return
    }
    if (flows.length) {
      const flow = thinkVer1(appContext.viewModel.model.gameState, props.clientId, flows)
      if (flow) {
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientId: props.clientId,
            flow: flow,
            versionID: appContext.viewModel.model.versionID
          });
        }, speed)
      }
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
