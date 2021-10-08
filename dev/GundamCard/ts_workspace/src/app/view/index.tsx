import React, { useContext, useMemo, useCallback, useState } from "react";
import { AppContext } from "../context";
import { cardPositionID } from "../../model/alg";
import { CardPosition } from "../../tool/types";
import { askImgSrc } from "../../tool/data";
import { Card } from "../../tool/table";

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
  // ============= selection =============== //
  const [selected, setSelected] = useState<{ [key: string]: boolean }>({});
  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        <button onClick={onClickTest}>onClickTest</button>
        <button onClick={onClickNewGame}>onClickNewGame</button>
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
        {renderCards({ playerID: ctx.playerA, where: "G" })}
        {renderCards({ playerID: ctx.playerA, where: "ground" })}
        {renderCards({ playerID: ctx.playerA, where: "hand" })}
      </>
    );
  }, [renderCards]);
  return (
    <div>
      {renderControlPanel}
      {renderGame}
    </div>
  );
}
