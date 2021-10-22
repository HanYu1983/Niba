import React, { useContext, useMemo, useCallback, useState } from "react";
import { AppContext } from "../context";
import { cardPositionID } from "../../model/alg/tool";
import { CardPosition } from "../../tool/types";
import { askImgSrc } from "../../tool/data";
import { Card } from "../../tool/table";
import { PlayerA, PlayerB } from "../../tool/types";

export function View() {
  const ctx = useContext(AppContext);
  if (ctx == null) {
    return <div>ctx not found</div>;
  }
  // ============== bind ================ //
  const onClickTest = useCallback(() => {
    try {
      ctx.onDebug();
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }, [ctx.onDebug]);
  const onClickCard = useCallback((card: Card) => {
    setSelected((origin) => {
      return {
        ...origin,
        [card.id]: !!!origin[card.id],
      };
    });
  }, []);
  const onClickNewGame = useCallback(() => {
    ctx.onClickNewGame();
  }, [ctx.onClickNewGame]);
  const onClickChangePlayer = useCallback(() => {
    ctx.onClickChangePlayer(ctx.playerID == PlayerA ? PlayerB : PlayerA);
  }, [ctx.onClickChangePlayer, ctx.playerID]);
  // ============= selection =============== //
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
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
  const CARD_SIZE = 100;
  const renderCards = useCallback(
    (pos: CardPosition) => {
      const cards =
        ctx.model.gameState.table.cardStack[cardPositionID(pos)] || [];
      return (
        <div style={{ border: "1px solid", height: CARD_SIZE }}>
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                style={{ display: "inline", overflow: "scroll" }}
              >
                <img
                  src={askImgSrc(card.protoID)}
                  style={{
                    height: CARD_SIZE,
                    ...(card.tap ? { transform: "rotate(90deg)" } : null),
                    ...(selected[card.id] ? { border: "2px solid red" } : null),
                  }}
                  onClick={() => {
                    onClickCard(card);
                  }}
                ></img>
              </div>
            );
          })}
        </div>
      );
    },
    [ctx.model.gameState.table.cardStack, selected]
  );
  const renderGame = useMemo(() => {
    return (
      <>
        <div
          style={{
            ...(ctx.playerID == PlayerA ? { background: "lightyellow" } : null),
          }}
        >
          <h1>PlayerA</h1>
          {renderCards({ playerID: PlayerA, where: "hand" })}
          {renderCards({ playerID: PlayerA, where: "ground" })}
          {renderCards({ playerID: PlayerA, where: "G" })}
        </div>
        <div
          style={{
            ...(ctx.playerID == PlayerB ? { background: "lightyellow" } : null),
          }}
        >
          <h1>playerB</h1>
          {renderCards({ playerID: PlayerB, where: "G" })}
          {renderCards({ playerID: PlayerB, where: "ground" })}
          {renderCards({ playerID: PlayerB, where: "hand" })}
        </div>
      </>
    );
  }, [renderCards, ctx.playerID]);
  return (
    <div>
      {renderControlPanel}
      {renderGame}
    </div>
  );
}
