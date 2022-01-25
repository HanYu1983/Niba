import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { queryFlow, Flow } from "../../tool/alg/handleClient";
import { wrapTip } from "../../tool/alg/handleGameContext";
import { getCardState, getTargetType } from "../../tool/alg/helper";
import { CardText, getBaShou, getBaShouID } from "../../tool/tool/basic/basic";
import { BlockPayload, Require } from "../../tool/tool/basic/blockPayload";
import { Condition } from "../../tool/tool/basic/condition";
import { getBlockOwner, iterateEffect, mapEffect } from "../../tool/tool/basic/gameContext";
import { getAbsoluteBaSyou } from "../../tool/tool/basic/handleCard";
import { TargetType } from "../../tool/tool/basic/targetType";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { CardView } from "./CardView";
import { RequireView } from "./RequireView";

export const BlockPayloadView = (props: {
  enabled: boolean;
  clientID: string;
  blockID: string;
}) => {
  const appContext = useContext(AppContext);
  const block: BlockPayload | null = useMemo(() => {
    const find = iterateEffect(appContext.viewModel.model).filter(e=>{
      return e.id == props.blockID
    })
    if(find.length == 0){
      return null
    }
    return wrapTip(appContext.viewModel.model, false, find[0], "BlockPayloadView")
  }, [appContext.viewModel.model, props.blockID]);
  if (block == null) {
    return <div>xxx</div>;
  }
  const cardID: string | null = useMemo(() => {
    if (block.cause?.id != "BlockPayloadCauseUpdateCommand") {
      return null;
    }
    const { cardID, cardTextID } = block.cause;
    return cardID;
  }, [appContext.viewModel.model, block]);

  // const cardText: CardText | string = useMemo(() => {
  //   if (block.cause?.id != "BlockPayloadCauseUpdateCommand") {
  //     return "[]";
  //   }
  //   const { cardID, cardTextID } = block.cause;
  //   const [_, cardState] = getCardState(appContext.viewModel.model, cardID);
  //   const text = cardState.cardTextStates.find((v) => v.id == cardTextID);
  //   if (text == null) {
  //     return "must find text";
  //   }
  //   return text.cardText;
  // }, [appContext.viewModel.model, block]);
  // const renderCardText = useMemo(() => {
  //   switch (typeof cardText) {
  //     case "string":
  //       return <div>{cardText}</div>;
  //     default:
  //       return <div>{cardText.description}</div>;
  //   }
  // }, [cardText]);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>{block.isOption ? "可取消" : "不可取消"}</div>
      {cardID != null ? (
        <CardView
          enabled={false}
          clientID={props.clientID}
          cardID={cardID}
        ></CardView>
      ) : null}
      <div style={{ flex: 4 }}>
        <div>{block.id}</div>
        <div>
          {block.cause?.description}({cardID})
        </div>
        {props.enabled && block.require ? (
          <RequireView
            clientID={props.clientID}
            blockPayload={block}
            require={block.require}
          ></RequireView>
        ) : null}
      </div>
    </div>
  );
};
