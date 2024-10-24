import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { BlockPayload, Require } from "../../tool/tool/basic/blockPayload";
import { Condition } from "../../tool/tool/basic/condition";
import { TargetType } from "../../tool/tool/basic/targetType";
import { AppContext } from "../tool/appContext";
import { TargetTypeView } from "./TargetTypeView";

export const ConditionView = (props: {
  blockPayload: BlockPayload;
  require: Require;
  targets: { [key: string]: TargetType };
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
                    blockPayload={props.blockPayload}
                    require={props.require}
                    targets={props.targets}
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
                    blockPayload={props.blockPayload}
                    require={props.require}
                    targets={props.targets}
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
              blockPayload={props.blockPayload}
              require={props.require}
              targets={props.targets}
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
      case "ConditionCompareCardColor":
        return (
          <div>
            <TargetTypeView
              blockPayload={props.blockPayload}
              require={props.require}
              targets={props.targets}
              target={props.condition.value[0]}
            ></TargetTypeView>
            {props.condition.value[1]}
            <TargetTypeView
              blockPayload={props.blockPayload}
              require={props.require}
              targets={props.targets}
              target={props.condition.value[2]}
            ></TargetTypeView>
          </div>
        );
      default:
        return (
          <div>
            <pre>{JSON.stringify(props.condition, null, 2)}</pre>
          </div>
        );
    }
  }, [props.blockPayload, props.require, props.targets, props.condition]);
  return <>{render}</>;
};
