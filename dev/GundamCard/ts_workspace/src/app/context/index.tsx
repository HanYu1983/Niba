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
  playerA: string;
  playerB: string;
  onDebug: () => void;
  onClickNewGame: () => void;
};

export const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = (props: PropsWithChildren<any>) => {
  const playerA = "playerA";
  const playerB = "playerB";
  const [model, setModel] = useState<Context>(() => {
    let value: Context = {
      ...defaultContext,
      gameState: {
        ...defaultContext.gameState,
        table: createCard(
          defaultContext.gameState.table,
          playerA,
          cardPositionID({ playerID: playerA, where: "hand" }),
          ["179030_11E_U_BK187N_black", "179030_11E_U_BK187N_black"]
        ),
      },
    };
    return value;
  });

  const onClickNewGame = useCallback(() => {
    firebase.sendData(model);
  }, []);

  useEffect(() => {
    return firebase.addListener((err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      setModel(data);
    });
  }, []);

  const onDebug = useCallback(() => {
    let ctx = model;
    const actions = queryAction(ctx, playerA);
    console.log(actions);
    const unit1 =
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerA, where: "hand" })
      ]?.[0] || null;
    if (unit1 == null) {
      throw new Error("unit1必須存在");
    }
    const unit2 =
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerA, where: "hand" })
      ]?.[1] || null;
    if (unit2 == null) {
      throw new Error("unit2必須存在");
    }
    ctx = applyAction(ctx, playerA, {
      id: "PlayCardAction",
      playerID: playerA,
      cardID: unit1.id,
      position: { playerID: playerA, where: "G" },
    });
    console.log("放棄切入");
    ctx = applyAction(ctx, playerA, {
      id: "GiveUpCutAction",
      playerID: playerA,
    });
    ctx = applyAction(ctx, playerA, {
      id: "PlayCardAction",
      playerID: playerA,
      cardID: unit2.id,
      position: { playerID: playerA, where: "ground" },
    });
    ctx = applyAction(ctx, playerA, {
      id: "TapCardToGenG",
      playerID: playerA,
      cardID: unit1.id,
      color: askCardColor(ctx, unit1),
    });
    console.log(ctx);
    ctx = applyAction(ctx, playerA, {
      id: "ApplyPaymentAction",
      playerID: playerA,
    });
    console.log("放棄切入");
    ctx = applyAction(ctx, playerA, {
      id: "GiveUpCutAction",
      playerID: playerA,
    });
    firebase.sendData(ctx);
  }, [model]);
  return (
    <AppContext.Provider
      value={{ model: model, playerA, playerB, onDebug, onClickNewGame }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
