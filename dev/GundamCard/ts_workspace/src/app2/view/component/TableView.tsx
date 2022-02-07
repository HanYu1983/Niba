import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
  HTMLAttributes,
  useEffect,
} from "react";
import { PlayerA, PlayerB } from "../../tool/tool/basic/basic";
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
          isCardVisible={false}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "手札"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ハンガー"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "プレイされているカード"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "配備エリア"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア（左）"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "戦闘エリア（右）"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "Gゾーン"],
          }}
          isCardVisible={false}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "捨て山"],
          }}
          isCardVisible={false}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerA, "ジャンクヤード"],
          }}
          isCardVisible={true}
        ></CardStackView>

        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "本国"],
          }}
          isCardVisible={false}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "手札"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ハンガー"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "プレイされているカード"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "配備エリア"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（左）"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "戦闘エリア（右）"],
          }}
          isCardVisible={true}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "Gゾーン"],
          }}
          isCardVisible={false}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "捨て山"],
          }}
          isCardVisible={false}
        ></CardStackView>
        <CardStackView
          clinetID={props.clientID}
          cardPosition={{
            id: "AbsoluteBaSyou",
            value: [PlayerB, "ジャンクヤード"],
          }}
          isCardVisible={true}
        ></CardStackView>
      </>
    );
  }, [props.clientID]);
  return renderGame;
};
