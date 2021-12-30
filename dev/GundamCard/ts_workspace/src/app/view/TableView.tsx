import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { AppContext } from "../context";
import { PlayerA, PlayerB } from "../types";
import { CardStackView } from "./CardStackView";

export const TableView = () => {
  const appContext = useContext(AppContext);
  const renderGame = useMemo(() => {
    return (
      <>
        <div
          style={{
            ...(appContext.viewModel.clientID == PlayerA
              ? { background: "lightyellow" }
              : null),
          }}
        >
          <h1>PlayerA</h1>
          <CardStackView
            cardPosition={{ playerID: PlayerA, where: "hand" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerA, where: "ground" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerA, where: "G" }}
          ></CardStackView>
        </div>
        <div
          style={{
            ...(appContext.viewModel.clientID == PlayerB
              ? { background: "lightyellow" }
              : null),
          }}
        >
          <h1>playerB</h1>
          <CardStackView
            cardPosition={{ playerID: PlayerB, where: "hand" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerB, where: "ground" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerB, where: "G" }}
          ></CardStackView>
        </div>
      </>
    );
  }, [appContext.viewModel.clientID]);
  return renderGame;
};
