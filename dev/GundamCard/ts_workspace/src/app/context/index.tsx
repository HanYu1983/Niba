import React, { useCallback } from "react";
import Resct, { useState, createContext, PropsWithChildren } from "react";
import { Context, defaultContext } from "../../tool/types";
import { createCard } from "../../tool/table";
import { askCardColor, cardPositionID } from "../../model/alg";
import { queryAction } from "../../model/alg/queryAction";
import { applyAction } from "../../model/alg/applyAction";
// @ts-ignore
import { Subject } from "rxjs";

export type AppContext = {
  model: Context;
  playerA: string;
  playerB: string;
  onDebug: () => void;
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
          ["179030_11E_G_RD021N_red"]
        ),
      },
    };
    return value;
  });
  const onDebug = useCallback(() => {
    let ctx = model;
    const actions = queryAction(ctx, playerA);
    if (actions.length == 0) {
      throw new Error("必須有出牌動作");
    }
    if (actions[0].id != "PlayCardAction") {
      throw new Error("動作必須是PlayCardAction");
    }
    console.log("出G");
    ctx = applyAction(ctx, playerA, actions[0]);
    console.log("放棄切入");
    ctx = applyAction(ctx, playerA, {
      id: "GiveUpCutAction",
      playerID: playerA,
    });
    if (
      (
        ctx.gameState.table.cardStack[
          cardPositionID({ playerID: playerA, where: "ground" })
        ] || []
      ).length != 1
    ) {
      throw new Error("G必須在場上");
    }
    if (
      (
        ctx.gameState.table.cardStack[
          cardPositionID({ playerID: playerA, where: "hand" })
        ] || []
      ).length != 0
    ) {
      throw new Error("手牌必須為0");
    }
    const card =
      ctx.gameState.table.cardStack[
        cardPositionID({ playerID: playerA, where: "ground" })
      ]?.[0];
    if (card == null) {
      throw new Error("XX");
    }
    ctx = applyAction(ctx, playerA, {
      id: "TapCardToGenG",
      playerID: playerA,
      cardID: card.id,
      color: askCardColor(ctx, card),
    });
    setModel(ctx);
  }, [model]);
  return (
    <AppContext.Provider value={{ model: model, playerA, playerB, onDebug }}>
      {props.children}
    </AppContext.Provider>
  );
};
