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
          switch (props.target.id) {
            case "カード":
              return (
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1 }}>
                    請選擇{props.target.valueLengthInclude?.join("或") || "1"}
                    單位「{props.target.id}」
                  </div>
                  <div style={{ flex: 1 }}>
                    {(props.target.tipID || []).map((v, i) => {
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
