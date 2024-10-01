import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { FlowListView } from "./FlowListView";
import { TableView } from "./TableView";
import { EffectView } from "./EffectView";

export function ClientView(props: { clientId: string }) {
  const appContext = useContext(AppContext);
  const renderStackEffects = useMemo(() => {
    return <div style={{ display: "flex" }}>
      {
        appContext.viewModel.model.gameState.stackEffect.map(effectId => {
          return <div key={effectId} style={{border: "1px solid black"}}>
            <EffectView enabled={true} clientId={props.clientId} effectID={effectId}></EffectView>
          </div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState])
  const renderDebug = useMemo(() => {
    return <div>flowMemory:{JSON.stringify(appContext.viewModel.model.gameState.flowMemory)}</div>
  }, [appContext.viewModel.model.gameState.flowMemory])
  const render = useMemo(() => {
    return <div>
      <h1>clientId: {props.clientId}</h1>
      <div>activePlayerID: {appContext.viewModel.model.gameState.activePlayerID}</div>
      <div>timing:{JSON.stringify(appContext.viewModel.model.gameState.phase)}</div>
      <div>turn: {appContext.viewModel.model.gameState.turn}</div>
      {renderStackEffects}
      <FlowListView clientId={props.clientId}></FlowListView>
      <TableView clientId={props.clientId}></TableView>
    </div>
  }, [appContext.viewModel.model, appContext.viewModel.localMemory, appContext.viewModel.model.gameState, props.clientId])
  return render
}
