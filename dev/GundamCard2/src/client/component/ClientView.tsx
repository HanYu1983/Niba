import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { FlowListView } from "./FlowListView";
import { TableView } from "./TableView";

export function ClientView(props: { clientID: string }) {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    return <div>
      <div>version:{JSON.stringify(appContext.viewModel.model.versionID)}</div>
      <div>state:{JSON.stringify(appContext.viewModel.model.gameState.flowMemory.state)}</div>
      <div>timing:{JSON.stringify(appContext.viewModel.model.gameState.phase)}</div>
      <div>localMemory:{JSON.stringify(appContext.viewModel.localMemory)}</div>
      <h1>{props.clientID}</h1>
      <FlowListView clientID={props.clientID}></FlowListView>
      <TableView clientID={props.clientID}></TableView>
    </div>
  }, [appContext.viewModel.model, appContext.viewModel.localMemory, appContext.viewModel.model.gameState, props.clientID])
  return render
}
