import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { CardStackView } from "./CardStackView";

export const TableView = (props: { clientID: string }) => {
  const renderGame = useMemo(() => {
    return (
      <>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "本国"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "手札"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "ハンガー"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "プレイされているカード"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "配備エリア"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "戦闘エリア"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "Gゾーン"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "ジャンクヤード"],
          }}
        ></CardStackView>
      </>
    );
  }, [props.clientID]);
  return renderGame;
};
