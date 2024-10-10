import { useEffect } from "react";
import { PlayerA, PlayerB } from "../../game/define/PlayerID";
import { AppContextProvider } from "../tool/appContext";
import { OnError } from "../tool/appContext/eventCenter";
import { ClientView } from "./ClientView";
import { ControlView } from "./ControlView";
import { CardSelectionView } from "./CardSelectionView";
import { PlayerController } from "./PlayerController";

export function AppView() {
  // error handle
  useEffect(() => {
    const subscriber = OnError.subscribe((e) => {
      console.error(e)
      alert(e);
      throw e
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);
  return (
    <AppContextProvider>
      <ControlView></ControlView>
      <PlayerController clientId={PlayerA}></PlayerController>
      <PlayerController clientId={PlayerB}></PlayerController>
      <div style={{ border: "1px solid blue", display: "flex" }}>
        <div style={{ border: "1px solid red", flex: 1, width: 1200 }}>
          <ClientView clientId={PlayerA}></ClientView>
        </div>
        <div style={{ border: "1px solid red", flex: 1}}>
          <CardSelectionView clientId={PlayerA}></CardSelectionView>
        </div>
      </div>
    </AppContextProvider>
  );
}
