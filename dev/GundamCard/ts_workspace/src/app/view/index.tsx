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
import { ControlView } from "./ControlView";
import { TableView } from "./TableView";
import { PlayerStateView } from "./PlayerStateView";

export function View() {
  // error handle
  useEffect(() => {
    const subscriber = OnError.subscribe((e) => {
      alert(e);
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);
  const renderPlayerView = useMemo(() => {
    return [PlayerA, PlayerB].map((playerID) => {
      return (
        <PlayerStateView key={playerID} playerID={playerID}></PlayerStateView>
      );
    });
  }, []);
  return (
    <div>
      <ActionListView></ActionListView>
      <PaymentTableView></PaymentTableView>
      {renderPlayerView}
      <EffectStackView></EffectStackView>
      <ControlView></ControlView>
      <TableView></TableView>
      <DebugView></DebugView>
    </div>
  );
}
