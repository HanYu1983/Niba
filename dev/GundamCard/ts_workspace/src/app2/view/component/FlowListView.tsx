import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { queryFlow, Flow } from "../../tool/alg/handleClient";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";

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
            <div
              key={i}
              style={{ border: "1px solid black" }}
              onClick={() => {
                onClickFlowConfirm(flow);
              }}
            >
              {JSON.stringify(flow)}
            </div>
          );
        })}
      </div>
    );
  }, [flows]);
  return renderControlPanel;
};
