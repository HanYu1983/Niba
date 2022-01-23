import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";

export const ControlView = () => {
  const appContext = useContext(AppContext);
  const onClickTest = useCallback(() => {}, []);
  const onClickNewGame = useCallback(() => {
    OnEvent.next({ id: "OnClickNewGame" });
  }, []);
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        <div>version:{JSON.stringify(appContext.viewModel.model.versionID)}</div>
        <button onClick={onClickNewGame}>onClickNewGame</button>
        <button onClick={onClickTest}>onClickTest</button>
      </div>
    );
  }, [appContext.viewModel.model.versionID, onClickTest, onClickNewGame]);
  return renderControlPanel;
};
