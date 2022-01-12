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
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "手札"],
          }}
        ></CardStackView>
        <CardStackView
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "配備エリア"],
          }}
        ></CardStackView>
        <CardStackView
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [props.clientID, "Gゾーン"],
          }}
        ></CardStackView>
      </>
    );
  }, [props.clientID]);
  return renderGame;
};
