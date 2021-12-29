import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { AppContext } from "../context";
import { OnEvent, OnError } from "../../tool/eventCenter";

export const ControlView = () => {
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
  return renderControlPanel;
};
