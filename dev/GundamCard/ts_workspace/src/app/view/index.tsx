import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { AppContext } from "../context";
import { cardPositionID } from "../../model/alg/tool";
import { CardPosition } from "../../tool/types";
import { askImgSrc } from "../../tool/data";
import { Card } from "../../tool/table";
import { PlayerA, PlayerB } from "../../tool/types";
import { getCard } from "../../tool/table";
import { OnEvent } from "../../tool/eventCenter";

const CARD_SIZE = 100;

export const CardView = (props: { cardID: string }) => {
  const appContext = useContext(AppContext);
  if (appContext == null) {
    return <div>AppContext not found</div>;
  }
  const card = useMemo(() => {
    return getCard(appContext.viewModel.model.gameState.table, props.cardID);
  }, [props.cardID, appContext.viewModel.model.gameState.table]);
  if (card == null) {
    return <div>card({props.cardID}) not found</div>;
  }
  const render = useMemo(() => {
    return (
      <div
        style={{
          ...(card.tap ? { transform: "rotate(90deg)" } : null),
          border: "2px solid black",
          ...(appContext.viewModel.cardSelection[card.id]
            ? { border: "2px solid red" }
            : null),
        }}
        onClick={() => {
          OnEvent.next({ id: "OnClickCardEvent", card: card });
        }}
      >
        <img src={askImgSrc(card.protoID)} style={{ height: CARD_SIZE }}></img>
      </div>
    );
  }, [card, appContext.viewModel.cardSelection]);
  return <>{render}</>;
};

export const CardStackView = (
  props: { cardPosition: CardPosition } & HTMLAttributes<unknown>
) => {
  const appContext = useContext(AppContext);
  if (appContext == null) {
    return <div>AppContext not found</div>;
  }
  const cards = useMemo(() => {
    return (
      appContext.viewModel.model.gameState.table.cardStack[
        cardPositionID(props.cardPosition)
      ] || []
    );
  }, [
    props.cardPosition,
    appContext.viewModel.model.gameState.table.cardStack,
  ]);
  return (
    <div style={{ border: "1px solid", height: CARD_SIZE, display: "flex" }}>
      <div style={{ width: 100 }}></div>
      {cards.map((card) => {
        return <CardView key={card.id} cardID={card.id}></CardView>;
      })}
    </div>
  );
};

export function View() {
  const appContext = useContext(AppContext);
  if (appContext == null) {
    return <div>AppContext not found</div>;
  }
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
  // ============== game ============== //
  const renderGame = useMemo(() => {
    return (
      <>
        <div
          style={{
            ...(appContext.viewModel.clientID == PlayerA
              ? { background: "lightyellow" }
              : null),
          }}
        >
          <h1>PlayerA</h1>
          <CardStackView
            cardPosition={{ playerID: PlayerA, where: "hand" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerA, where: "ground" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerA, where: "G" }}
          ></CardStackView>
        </div>
        <div
          style={{
            ...(appContext.viewModel.clientID == PlayerB
              ? { background: "lightyellow" }
              : null),
          }}
        >
          <h1>playerB</h1>
          <CardStackView
            cardPosition={{ playerID: PlayerB, where: "hand" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerB, where: "ground" }}
          ></CardStackView>
          <CardStackView
            cardPosition={{ playerID: PlayerB, where: "G" }}
          ></CardStackView>
        </div>
      </>
    );
  }, [appContext.viewModel.clientID]);
  return (
    <div>
      {renderControlPanel}
      {renderGame}
    </div>
  );
}
