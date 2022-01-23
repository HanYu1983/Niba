import React, { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { FlowListView } from "./FlowListView";
import { TableView } from "./TableView";

export function ClientView(props: { clientID: string }) {
  const appContext = useContext(AppContext);
  return (
    <div>
      <div>version:{JSON.stringify(appContext.viewModel.model.versionID)}</div>
      <h1>{props.clientID}</h1>
      <FlowListView clientID={props.clientID}></FlowListView>
      <TableView clientID={props.clientID}></TableView>
    </div>
  );
}
