import React, { useContext, useMemo, HTMLAttributes } from "react";
import { AppContext } from "../context";
import { CardPosition, PlayerA, PlayerB, PlayerState } from "../../tool/types";
import { PlayerStateView } from "./PlayerStateView";

export const EffectStackView = (props: {}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const effects = appContext.viewModel.model.gameState.effectStack.effects;
    if (effects.length == 0) {
      return <div></div>;
    }
    const players: [string, PlayerState | null][] = [PlayerA, PlayerB].map(
      (clientID) => [
        clientID,
        appContext.viewModel.model.gameState.playerState[clientID] || null,
      ]
    );
    const isAllPlayerConfirm =
      players
        .map(([id, plyr]) => plyr)
        .filter((plyr) => {
          return (plyr?.confirmPhase || false) == false;
        }).length == 0;
    return (
      <div>
        {isAllPlayerConfirm ? "先攻玩家準備呼叫SystemHandleEffectAction" : null}
        {isAllPlayerConfirm == false
          ? "效果存在中，雙方呼叫ConfirmPhaseAction確定沒有要切入"
          : null}
        {[PlayerA, PlayerB].map((playerID) => {
          return (
            <PlayerStateView
              key={playerID}
              playerID={playerID}
            ></PlayerStateView>
          );
        })}
        {effects.map((effect, i) => {
          const elem = (() => {
            switch (effect.id) {
              case "ActionEffect":
                switch (effect.action.id) {
                  case "PlayCardAction":
                    return (
                      <div>
                        {effect.action.id}:{effect.action.cardID}
                      </div>
                    );
                  default:
                    return <div>{JSON.stringify(effect.action)}</div>;
                }

              case "DestroyEffect":
                return <div>破壞效果</div>;
            }
          })();
          return <div key={i}>{elem}</div>;
        })}
      </div>
    );
  }, [
    appContext.viewModel.model.gameState.playerState,
    appContext.viewModel.model.gameState.effectStack.effects,
  ]);
  return <>{render}</>;
};
