import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";

export const DebugView = (props: {}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    console.log("[DebugView]", appContext.viewModel.model);
    return <div>{JSON.stringify(appContext.viewModel.model, null, 2)}</div>;
  }, [appContext.viewModel]);
  return <>{render}</>;
};
