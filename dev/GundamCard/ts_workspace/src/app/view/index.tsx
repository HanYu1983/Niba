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
import { OnEvent, OnError } from "../../tool/eventCenter";
import { CardStackView } from "./CardStackView";
import { ActionListView } from "./ActionListView";
import { DebugView } from "./DebugView";
import { PaymentTableView } from "./PaymentTableView";
import { EffectStackView } from "./EffectStackView";
export function View() {
  useEffect(() => {
    const subscriber = OnError.subscribe((e) => {
      alert(e);
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  const appContext = useContext(AppContext);
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
      <ActionListView></ActionListView>
      <PaymentTableView></PaymentTableView>
      <EffectStackView></EffectStackView>
      {renderControlPanel}
      {renderGame}
      <DebugView></DebugView>
    </div>
  );
}
