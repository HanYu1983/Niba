import React, { useCallback, useEffect } from "react";
import Resct, { useState, createContext, PropsWithChildren } from "react";
import { Context, defaultContext } from "../../tool/types";
import { createCard } from "../../tool/table";
import { askCardColor, cardPositionID } from "../../model/alg";
import { queryAction } from "../../model/alg/queryAction";
import { applyAction } from "../../model/alg/applyAction";
import * as firebase from "../../tool/firebase";
// @ts-ignore
import { Subject } from "rxjs";

export type AppContext = {
  model: Context;
  onDebug: () => void;
  onClickNewGame: () => void;
  playerID: string;
  onClickChangePlayer: (playerID: string) => void;
};

export const AppContext = createContext<AppContext | null>(null);
export const PlayerA = "PlayerA";
export const PlayerB = "PlayerB";

export const AppContextProvider = (props: PropsWithChildren<any>) => {
  const [playerID, setPlayerID] = useState(PlayerA);
  const [model, setModel] = useState<Context>(() => {
    let table = defaultContext.gameState.table;
    table = createCard(
      table,
      PlayerA,
      cardPositionID({ playerID: PlayerA, where: "hand" }),
      ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
    );
    table = createCard(
      table,
      PlayerB,
      cardPositionID({ playerID: PlayerB, where: "hand" }),
      ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
    );
    let value: Context = {
      ...defaultContext,
      gameState: {
        ...defaultContext.gameState,
        table: table,
      },
    };
    return value;
  });

  const onClickNewGame = useCallback(() => {
    firebase.sync(model);
  }, []);

  useEffect(() => {
    return firebase.addListener((err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      if (data == null) {
        return;
      }
      setModel(data);
    });
  }, []);

  const onClickChangePlayer = useCallback((id: string) => {
    setPlayerID(id);
  }, []);

  const onDebug = useCallback(() => {
    let ctx = model;
    const actions = queryAction(ctx, playerID);
    console.log(actions);
    const unit1 =
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerID, where: "hand" })
      ]?.[0] || null;
    if (unit1 == null) {
      throw new Error("unit1必須存在");
    }
    const unit2 =
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerID, where: "hand" })
      ]?.[1] || null;
    if (unit2 == null) {
      throw new Error("unit2必須存在");
    }
    ctx = applyAction(ctx, playerID, {
      id: "PlayCardAction",
      playerID: playerID,
      cardID: unit1.id,
      from: { playerID: playerID, where: "hand" },
      to: { playerID: playerID, where: "G" },
    });
    console.log("放棄切入");
    ctx = applyAction(ctx, playerID, {
      id: "ConfirmPhaseAction",
      playerID: playerID,
    });
    ctx = applyAction(ctx, playerID, {
      id: "PlayCardAction",
      playerID: playerID,
      cardID: unit2.id,
      from: { playerID: playerID, where: "hand" },
      to: { playerID: playerID, where: "ground" },
    });
    ctx = applyAction(ctx, playerID, {
      id: "TapCardToGenG",
      playerID: playerID,
      cardID: unit1.id,
      color: askCardColor(ctx, unit1),
    });
    console.log(ctx);
    ctx = applyAction(ctx, playerID, {
      id: "ApplyPaymentAction",
      playerID: playerID,
    });
    console.log("放棄切入");
    ctx = applyAction(ctx, playerID, {
      id: "ConfirmPhaseAction",
      playerID: playerID,
    });
    firebase.sync(ctx);
  }, [model, playerID]);
  return (
    <AppContext.Provider
      value={{
        model: model,
        onDebug,
        onClickNewGame,
        onClickChangePlayer,
        playerID,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
