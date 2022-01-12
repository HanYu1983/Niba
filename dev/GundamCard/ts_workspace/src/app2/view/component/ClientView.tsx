import React, { useContext, useMemo } from "react";
import { FlowListView } from "./FlowListView";
import { TableView } from "./TableView";

export function ClientView(props: { clientID: string }) {
  return (
    <div>
      <h1>{props.clientID}</h1>
      <FlowListView clientID={props.clientID}></FlowListView>
      <TableView clientID={props.clientID}></TableView>
    </div>
  );
}
