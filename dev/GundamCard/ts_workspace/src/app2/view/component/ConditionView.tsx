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
import { TargetTypeView } from "./TargetTypeView";

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
