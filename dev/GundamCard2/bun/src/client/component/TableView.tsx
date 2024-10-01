import { useMemo } from "react";
import { PlayerA, PlayerB } from "../../game/define/PlayerID";
import { CardStackView } from "./CardStackView";
import { HandView } from "./HandView";
import { AbsoluteBaSyouFn, BaSyouKeywordFn } from "../../game/define/BaSyou";

export const TableView = (props: { clientId: string }) => {
  const renderGame = useMemo(() => {
    return (
      <>
        <div style={{ display: "flex", width: "100%" }}>
          {
            [PlayerA, PlayerB].map(clientId => {
              return <div key={clientId} style={{ flex: 1, overflow: "scroll" }}>
                <div key={clientId + "手札"}>
                  <CardStackView
                    clientId={props.clientId}
                    cardPosition={AbsoluteBaSyouFn.of(clientId, "手札")}
                  ></CardStackView>
                </div>
                <div key={clientId + "ハンガー"}>
                  <CardStackView
                    clientId={props.clientId}
                    cardPosition={AbsoluteBaSyouFn.of(clientId, "ハンガー")}
                  ></CardStackView>
                </div>
                {
                  BaSyouKeywordFn.getAll().filter(basyouKw => basyouKw != "手札" && basyouKw != "ハンガー").map(basyouKw => {
                    return <div key={clientId + basyouKw}>
                      <CardStackView
                        clientId={props.clientId}
                        cardPosition={AbsoluteBaSyouFn.of(clientId, basyouKw)}
                      ></CardStackView>
                    </div>
                  })
                }
              </div>
            })
          }
        </div>
      </>
    );
  }, [props.clientId]);
  return renderGame;
};
