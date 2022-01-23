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
import { getBlockOwner, getRequireTargetOwner, mapEffect } from "../../tool/tool/basic/gameContext";
import { getAbsoluteBaSyou } from "../../tool/tool/basic/handleCard";
import { TargetType } from "../../tool/tool/basic/targetType";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { CardView } from "./CardView";
import { ConditionView } from "./ConditionView";
import { TargetTypeView } from "./TargetTypeView";

export const RequireView = (props: { clientID: string; blockPayload: BlockPayload, require: Require }) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    switch (props.require.id) {
      case "RequireAnd":
        return (
          <div>
            <div>必須符合全部</div>
            {props.require.and.map((r) => {
              return (
                <div key={r.key}>
                  <RequireView
                    clientID={props.clientID}
                    blockPayload={props.blockPayload}
                    require={r}
                  ></RequireView>
                  ;
                </div>
              );
            })}
          </div>
        );
      case "RequireOr":
        return (
          <div>
            <div>必須符合其中一項</div>
            {props.require.or.map((r) => {
              return (
                <div key={r.key}>
                  <RequireView
                    clientID={props.clientID}
                    blockPayload={props.blockPayload}
                    require={r}
                  ></RequireView>
                  ;
                </div>
              );
            })}
          </div>
        );
      case "RequireTarget":
        const requireTarget = props.require
        return (
          <div style={{ border: "1px solid black" }}>
            {Object.entries(requireTarget.targets).map(([k, v]) => {
              const responsePlayer = getRequireTargetOwner(appContext.viewModel.model, props.blockPayload, props.require, v)
              const isTargetOwner = responsePlayer == props.clientID
              return (
                <div key={k} style={{ border: "1px solid black" }}>
                  {isTargetOwner ? <button
                    onClick={() => {
                      OnEvent.next({
                        id: "OnClickRequireTargetConfirm",
                        clientID: props.clientID,
                        blockPayload: props.blockPayload,
                        require: requireTarget,
                        varID: k,
                      });
                    }}
                  >
                    設定{k}
                  </button> : null}
                  <TargetTypeView target={v}></TargetTypeView>
                </div>
              );
            })}
            {props.require.condition ? (
              <ConditionView
                require={props.require}
                condition={props.require.condition}
              ></ConditionView>
            ) : null}
          </div>
        );
      default:
        return (
          <div>
            <pre>{JSON.stringify(props.require, null, 2)}</pre>
          </div>
        );
    }
  }, [appContext.viewModel.model, props.require, props.blockPayload, props.clientID]);
  return (
    <div style={{ border: "1px solid black" }}>
      {props.require.key}
      {render}
    </div>
  );
};
