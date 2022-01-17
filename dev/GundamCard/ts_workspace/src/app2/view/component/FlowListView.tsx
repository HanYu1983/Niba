import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { queryFlow, Flow } from "../../tool/alg/handleClient";
import { getTargetType } from "../../tool/alg/helper";
import { getBaShou, getBaShouID } from "../../tool/tool/basic/basic";
import { BlockPayload, Require } from "../../tool/tool/basic/blockPayload";
import { Condition } from "../../tool/tool/basic/condition";
import { getBlockOwner, mapEffect } from "../../tool/tool/basic/gameContext";
import { getAbsoluteBaSyou } from "../../tool/tool/basic/handleCard";
import { TargetType } from "../../tool/tool/basic/targetType";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { CardView } from "./CardView";
import { BlockPayloadView } from "./BlockPayloadView";

export const FlowListView = (props: { clientID: string }) => {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return queryFlow(appContext.viewModel.model, props.clientID);
  }, [appContext.viewModel.model, props.clientID]);
  const onClickFlowConfirm = useCallback(
    (flow: Flow) => {
      OnEvent.next({
        id: "OnClickFlowConfirm",
        clientID: props.clientID,
        flow: flow,
      });
    },
    [props.clientID]
  );
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        {flows.map((flow, i) => {
          return (
            <div key={i} style={{ border: "1px solid black" }}>
              <button
                onClick={() => {
                  onClickFlowConfirm(flow);
                }}
              >
                {flow.id}
              </button>
              {(() => {
                switch (flow.id) {
                  case "FlowDoEffect":
                    return (
                      <BlockPayloadView
                        enabled={true}
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
                          {flow.description}
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
              {
                //<pre>{JSON.stringify(flow, null, 2)}</pre>
              }
            </div>
          );
        })}
      </div>
    );
  }, [flows, props.clientID]);
  return renderControlPanel;
};
