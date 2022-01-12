import React, { useContext, useMemo } from "react";
import { TableView } from "./TableView";

export function ClientView(props: { clientID: string }) {
  return (
    <div>
      <h1>{props.clientID}</h1>
      <TableView clientID={props.clientID}></TableView>
    </div>
  );
}
