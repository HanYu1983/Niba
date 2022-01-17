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

export const TargetTypeView = (props: { target: TargetType }) => {
  return (
    <>
      {(() => {
        if (typeof props.target.value == "string") {
          return <div>變數「{props.target.value}」</div>;
        }
        if (
          Array.isArray(props.target.value) &&
          props.target.value.length == 0
        ) {
          return <div>請選擇「{props.target.id}」</div>;
        }
        switch (props.target.id) {
          case "カード":
          case "プレーヤー":
          case "「カード」的角色":
          case "カードの色":
          case "參照":
          case "場所":
          case "字串":
          case "布林":
          case "數字": {
            if (Array.isArray(props.target.value)) {
              switch (props.target.id) {
                case "カード":
                  return props.target.value.map((v, i) => {
                    return (
                      <CardView enabled={false} key={i} cardID={v}></CardView>
                    );
                  });
                case "場所":
                  return props.target.value.map((v, i) => {
                    return <div key={i}>{JSON.stringify(v.value)}</div>;
                  });
                default:
                  return props.target.value.map((v, i) => {
                    return <div key={i}>{v}</div>;
                  });
              }
            }
            const path = props.target.value.path;
            switch (path[0].id) {
              case "このカード":
                return <div>這張卡</div>;
              case "プレーヤー":
              case "參照":
              case "カード": {
                return (
                  <>
                    <TargetTypeView target={path[0]}></TargetTypeView>
                    {path[1]}
                  </>
                );
              }
            }
          }
        }
      })()}
    </>
  );
};

export const ConditionView = (props: {
  require: Require;
  condition: Condition;
}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    switch (props.condition.id) {
      case "ConditionAnd":
        return (
          <div>
            <div>必須符合全部</div>
            {props.condition.and.map((r, i) => {
              return (
                <div key={i}>
                  <ConditionView
                    require={props.require}
                    condition={r}
                  ></ConditionView>
                  ;
                </div>
              );
            })}
          </div>
        );
      case "ConditionOr":
        return (
          <div>
            <div>必須符合其中一項</div>
            {props.condition.or.map((r, i) => {
              return (
                <div key={i}>
                  <ConditionView
                    require={props.require}
                    condition={r}
                  ></ConditionView>
                  ;
                </div>
              );
            })}
          </div>
        );
      case "ConditionNot":
        return (
          <div>
            <div>必須為否</div>
            <ConditionView
              require={props.require}
              condition={props.condition.not}
            ></ConditionView>
          </div>
        );
      case "ConditionCompareRole":
      case "ConditionComparePlayer":
      case "ConditionCompareNumber":
      case "ConditionCompareBoolean":
      case "ConditionCompareCard":
      case "ConditionComparePlayer":
      case "ConditionCompareString":
      case "ConditionCompareBaSyou":
        return (
          <div>
            <TargetTypeView target={props.condition.value[0]}></TargetTypeView>
            {props.condition.value[1]}
            <TargetTypeView target={props.condition.value[2]}></TargetTypeView>
          </div>
        );
      default:
        return (
          <div>
            <pre>{JSON.stringify(props.condition, null, 2)}</pre>
          </div>
        );
    }
  }, [props.condition]);
  return <>{render}</>;
};

export const RequireView = (props: { clientID: string; require: Require }) => {
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
                    require={r}
                  ></RequireView>
                  ;
                </div>
              );
            })}
          </div>
        );
      case "RequireTarget":
        return (
          <div style={{ border: "1px solid black" }}>
            {Object.entries(props.require.targets).map(([k, v]) => {
              return (
                <div key={k} style={{ border: "1px solid black" }}>
                  <button
                    onClick={() => {
                      OnEvent.next({
                        id: "OnClickRequireTargetConfirm",
                        clientID: props.clientID,
                        require: props.require,
                        varID: k,
                      });
                    }}
                  >
                    {k}
                    <TargetTypeView target={v}></TargetTypeView>
                  </button>
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
  }, [props.require, props.clientID]);
  return (
    <div style={{ border: "1px solid black" }}>
      {props.require.key}
      {render}
    </div>
  );
};

export const BlockPayloadView = (props: {
  enabled: boolean;
  clientID: string;
  blockID: string;
}) => {
  const appContext = useContext(AppContext);
  const block: BlockPayload | null = useMemo(() => {
    // 使用any, 不然類型推論無法推出下一行可能找到Block, 而當成ret永遠是null
    let ret: any = null;
    mapEffect(appContext.viewModel.model, (effect) => {
      if (effect.id == props.blockID) {
        ret = effect;
      }
      return effect;
    });
    return ret;
  }, [appContext.viewModel.model, props.blockID]);
  if (block == null) {
    return <div>xxx</div>;
  }
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>{block.isOption ? "可選擇" : ""}</div>
      <div style={{ flex: 4 }}>
        <div>{block.id}</div>
        <div>{block.cause?.description}</div>
        {props.enabled && block.require ? (
          <RequireView
            clientID={props.clientID}
            require={block.require}
          ></RequireView>
        ) : null}
      </div>
    </div>
  );
};

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
