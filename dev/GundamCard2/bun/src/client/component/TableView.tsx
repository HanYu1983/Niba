import { useMemo } from "react";
import { PlayerA, PlayerB } from "../../game/define/PlayerID";
import { CardStackView } from "./CardStackView";
import { HandView } from "./HandView";

export const TableView = (props: { clientId: string }) => {
  const renderGame = useMemo(() => {
    return (
      <>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "手札"],
          }}
          cardSize={250}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ハンガー"],
          }}
          cardSize={250}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "プレイされているカード"],
          }}
        ></CardStackView>
        
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア1"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア2"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "本国"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "捨て山"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ジャンクヤード"],
          }}
        ></CardStackView>

        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "本国"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "手札"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ハンガー"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "プレイされているカード"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア1"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア2"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "Gゾーン"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "捨て山"],
          }}
        ></CardStackView>
        <CardStackView
          clientId={props.clientId}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ジャンクヤード"],
          }}
        ></CardStackView>
      </>
    );
  }, [props.clientId]);
  return renderGame;
};
