import React, { useCallback, useContext, useMemo } from "react";
import { AppContext } from "../context";

export const PlayerStateView = (props: { playerID: string }) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const player =
      appContext.viewModel.model.gameState.playerState[props.playerID];
    if (player == null) {
      return <div>{`player(${props.playerID}) not found`}</div>;
    }
    const isActive =
      appContext.viewModel.model.gameState.activePlayerID == props.playerID;
    return (
      <table
        style={{
          border: "1px solid black",
          ...(isActive ? { background: "lightgray" } : null),
        }}
      >
        <thead>
          <tr>
            <td>playerID</td>
            <td>playGCount</td>
            <td>turn</td>
            <td>confirmPhase</td>
          </tr>
        </thead>
        <tbody>
          <tr key={props.playerID}>
            <td>{props.playerID}</td>
            <td>{player?.playGCount || 0}</td>
            <td>{player?.turn || 0}</td>
            <td>{player?.confirmPhase ? "true" : "false"}</td>
          </tr>
        </tbody>
      </table>
    );
  }, [props.playerID, appContext.viewModel.model.gameState.playerState]);
  return render;
};
