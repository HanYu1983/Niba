import React, { useEffect, useMemo, HTMLAttributes } from "react";
import { PlayerA, PlayerB } from "../../tool/tool/basic/basic";
import { AppContextProvider } from "../tool/appContext";
import { OnError } from "../tool/appContext/eventCenter";
import { ClientView } from "./ClientView";
import { ControlView } from "./ControlView";

export function AppView() {
  // error handle
  useEffect(() => {
    const subscriber = OnError.subscribe((e) => {
      console.error(e)
      alert(e);
    });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);
  return (
    <AppContextProvider>
      <ControlView></ControlView>
      <ClientView clientID={PlayerA}></ClientView>
      <ClientView clientID={PlayerB}></ClientView>
    </AppContextProvider>
  );
}
