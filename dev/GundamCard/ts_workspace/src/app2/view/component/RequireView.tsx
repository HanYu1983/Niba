import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { getTargetType } from "../../tool/alg/getTargetType";
import { BlockPayload, Require } from "../../tool/tool/basic/blockPayload";
import {
  getBlockOwner,
  getRequireTargetOwner,
  mapEffect,
} from "../../tool/tool/basic/gameContext";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { ConditionView } from "./ConditionView";
import { TargetTypeView } from "./TargetTypeView";

export const RequireView = (props: {
  clientID: string;
  blockPayload: BlockPayload;
  require: Require;
}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    switch (props.require.id) {
      case "RequireAnd":
        return (
          <div>
            <div>必須符合全部</div>
            {props.require.and.map((r, i) => {
              return (
                <div key={i}>
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
            {props.require.or.map((r, i) => {
              return (
                <div key={i}>
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
        const requireTarget = props.require;
        return (
          <div style={{ border: "1px solid black" }}>
            {Object.entries(requireTarget.targets).map(([k, v], i) => {
              const responsePlayer = getRequireTargetOwner(
                appContext.viewModel.model,
                props.blockPayload,
                props.require,
                v
              );
              const isTargetOwner = responsePlayer == props.clientID;
              return (
                <div key={i} style={{ border: "1px solid black" }}>
                  {isTargetOwner ? (
                    <button
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
                    </button>
                  ) : null}
                  <TargetTypeView
                    blockPayload={props.blockPayload}
                    require={props.require}
                    targets={requireTarget.targets}
                    target={v}
                  ></TargetTypeView>
                </div>
              );
            })}
            {props.require.condition ? (
              <ConditionView
                blockPayload={props.blockPayload}
                require={props.require}
                targets={requireTarget.targets}
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
  }, [
    appContext.viewModel.model,
    props.require,
    props.blockPayload,
    props.clientID,
  ]);
  return (
    <div style={{ border: "1px solid black" }}>
      {props.require.key}
      {render}
    </div>
  );
};
