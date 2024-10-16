import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { getTargetType } from "../../tool/alg/getTargetType";
import { queryFlow, Flow } from "../../tool/alg/handleClient";
import { getBaSyou, getBaSyouID } from "../../tool/tool/basic/basic";
import { BlockPayload, Require } from "../../tool/tool/basic/blockPayload";
import { Condition } from "../../tool/tool/basic/condition";
import { getBlockOwner, mapEffect } from "../../tool/tool/basic/gameContext";
import { getAbsoluteBaSyou } from "../../tool/tool/basic/handleCard";
import { TargetType } from "../../tool/tool/basic/targetType";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { CardView } from "./CardView";

export const TargetTypeView = (props: {
  blockPayload: BlockPayload;
  require: Require;
  targets: { [key: string]: TargetType };
  target: TargetType;
}) => {
  const appContext = useContext(AppContext);
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
          switch (props.target.id) {
            case "カード":
              const tipID: string[] = (() => {
                if (props.target.tip == null) {
                  return [];
                }
                const tip = getTargetType(
                  appContext.viewModel.model,
                  props.blockPayload,
                  props.targets,
                  props.target.tip
                );
                if (tip.id != "カード") {
                  throw new Error("must be カード");
                }
                if (!Array.isArray(tip.value)) {
                  throw new Error("must be real value");
                }
                return tip.value;
              })();
              return (
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    請選擇{props.target.valueLengthInclude?.join("或") || "1"}
                    單位「{props.target.id}」
                  </div>
                  <div style={{ flex: 1 }}>
                    {tipID.map((v, i) => {
                      return (
                        <CardView enabled={true} key={i} cardID={v}></CardView>
                      );
                    })}
                  </div>
                  <div style={{ flex: 3 }}>
                    {Object.entries(props.target.tipMessage || {}).map(
                      ([k, v]) => {
                        return (
                          <div key={k}>
                            {k}:{v}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
          }
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
                    <TargetTypeView
                      blockPayload={props.blockPayload}
                      require={props.require}
                      targets={props.targets}
                      target={path[0]}
                    ></TargetTypeView>
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
