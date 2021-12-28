import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { AppContext } from "../context";
import { PlayerA, PlayerB } from "../../tool/types";
import { OnEvent } from "../../tool/eventCenter";
import { CardStackView } from "./CardStackView";

export function View() {
  const appContext = useContext(AppContext);
  if (appContext == null) {
    return <div>AppContext not found</div>;
  }
  const onClickTest = useCallback(() => {}, []);
  const onClickNewGame = useCallback(() => {
    OnEvent.next({ id: "OnClickNewGame" });
  }, []);
  const onClickChangePlayer = useCallback(() => {
    OnEvent.next({ id: "OnClickChangeClient" });
  }, []);
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        <button onClick={onClickNewGame}>onClickNewGame</button>
        <button onClick={onClickChangePlayer}>onClickChangePlayer</button>
        <button onClick={onClickTest}>onClickTest</button>
      </div>
    );
  }, [onClickTest, onClickNewGame]);
  // ============== game ============== //
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
  return (
    <div>
      {renderControlPanel}
      {renderGame}
    </div>
  );
}
