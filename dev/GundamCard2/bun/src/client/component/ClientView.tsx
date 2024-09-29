import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { FlowListView } from "./FlowListView";
import { TableView } from "./TableView";
import { EffectView } from "./EffectView";

export function ClientView(props: { clientId: string }) {
  const appContext = useContext(AppContext);
  const renderStackEffects = useMemo(()=>{
    return appContext.viewModel.model.gameState.stackEffect.map(effectId=>{
      return <EffectView key={effectId} enabled={false} clientId={props.clientId} effectID={effectId}></EffectView>
    })
  }, [appContext.viewModel.model.gameState])
  const render = useMemo(() => {
    return <div>
      <div>localMemory:{JSON.stringify(appContext.viewModel.localMemory)}</div>
      <div>version:{JSON.stringify(appContext.viewModel.model.versionID)}</div>
      <div>timing:{JSON.stringify(appContext.viewModel.model.gameState.phase)}</div>
      <div>flowMemory:{JSON.stringify(appContext.viewModel.model.gameState.flowMemory)}</div>
      <div>activePlayerID: {appContext.viewModel.model.gameState.activePlayerID}</div>
      <div>turn: {appContext.viewModel.model.gameState.turn}</div>
      <h1>{props.clientId}</h1>
      {renderStackEffects}
      <FlowListView clientId={props.clientId}></FlowListView>
      <TableView clientId={props.clientId}></TableView>
    </div>
  }, [appContext.viewModel.model, appContext.viewModel.localMemory, appContext.viewModel.model.gameState, props.clientId])
  return render
}
