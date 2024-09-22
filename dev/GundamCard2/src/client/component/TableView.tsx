import { useMemo } from "react";
import { PlayerA, PlayerB } from "../../game/define/PlayerID";
import { CardStackView } from "./CardStackView";

export const TableView = (props: { clientID: string }) => {
  const renderGame = useMemo(() => {
    return (
      <>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "本国"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "手札"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ハンガー"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "プレイされているカード"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア1"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア2"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "捨て山"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ジャンクヤード"],
          }}
        ></CardStackView>

        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "本国"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "手札"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ハンガー"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "プレイされているカード"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア1"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア2"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "Gゾーン"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "捨て山"],
          }}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ジャンクヤード"],
          }}
        ></CardStackView>
      </>
    );
  }, [props.clientID]);
  return renderGame;
};
