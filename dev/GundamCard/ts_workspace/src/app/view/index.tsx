import React, { useContext, useMemo, useCallback } from "react";
import { AppContext } from "../context";
import { cardPositionID } from "../../model/alg";
import { CardPosition } from "../../tool/types";
import { askImgSrc } from "../../tool/data";

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

  // ============== control panel ============= //
  const renderControlPanel = useMemo(() => {
    return (
      <div>
        <button onClick={onClickTest}>test</button>
      </div>
    );
  }, [onClickTest]);
  // ============== game ============== //
  const renderCards = useCallback(
    (pos: CardPosition) => {
      const cards =
        ctx.model.gameState.table.cardStack[cardPositionID(pos)] || [];
      return (
        <div style={{ border: "1px solid", height: 70 }}>
          {cards.map((card) => {
            return (
              <div
                key={card.id}
                style={{ display: "inline", overflow: "scroll" }}
              >
                <img
                  src={askImgSrc(card.protoID)}
                  style={{
                    height: 70,
                    ...(card.tap ? { transform: "rotate(90deg)" } : null),
                  }}
                ></img>
              </div>
            );
          })}
        </div>
      );
    },
    [ctx.model]
  );
  const renderGame = useMemo(() => {
    return (
      <>
        {renderCards({ playerID: ctx.playerA, where: "hand" })}
        {renderCards({ playerID: ctx.playerA, where: "ground" })}
        {renderCards({ playerID: ctx.playerA, where: "G" })}
      </>
    );
  }, [ctx.model]);
  return (
    <div>
      {renderControlPanel}
      {renderGame}
    </div>
  );
}
