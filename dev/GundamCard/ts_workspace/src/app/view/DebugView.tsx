import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";

export const DebugView = (props: {}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    console.log("[DebugView]", appContext.viewModel.model);
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td>phase</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {JSON.stringify(appContext.viewModel.model.gameState.phase)}
              </td>
            </tr>
          </tbody>
        </table>
        {JSON.stringify(appContext.viewModel.model, null, 2)}
      </div>
    );
  }, [appContext.viewModel]);
  return <>{render}</>;
};
