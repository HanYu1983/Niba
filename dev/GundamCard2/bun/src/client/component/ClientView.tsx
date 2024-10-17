import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { FlowListView } from "./FlowListView";
import { TableView } from "./TableView";
import { EffectView } from "./EffectView";

export function ClientView(props: { clientId: string }) {
  const appContext = useContext(AppContext);
  const renderStackEffects = useMemo(() => {
    return <div style={{ display: "flex", overflow:"scroll" }}>
      {
        appContext.viewModel.model.gameState.stackEffect.map((effectId, i) => {
          return <div key={i} style={{ border: "1px solid black" }}>
            {i}
            <EffectView enabled={true} clientId={props.clientId} effectID={effectId}></EffectView>
          </div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState.stackEffect])
  const renderImmediateEffects = useMemo(() => {
    return <div style={{ display: "flex", overflow:"scroll" }}>
      {
        appContext.viewModel.model.gameState.immediateEffect.map((effectId, i) => {
          return <div key={i} style={{ border: "1px solid black" }}>
            {i}
            <EffectView enabled={true} clientId={props.clientId} effectID={effectId}></EffectView>
          </div>
        })
      }
    </div>
  }, [appContext.viewModel.model.gameState.immediateEffect])
  const renderDebug = useMemo(() => {
    return <div>flowMemory:{JSON.stringify(appContext.viewModel.model.gameState.flowMemory)}</div>
  }, [appContext.viewModel.model.gameState.flowMemory])
  const render = useMemo(() => {
    return <div>
      <h1>clientId: {props.clientId}</h1>
      <div>state: {appContext.viewModel.model.gameState.flowMemory.state}</div>
      <div>activePlayerID: {appContext.viewModel.model.gameState.activePlayerID}</div>
      <div>timing:{JSON.stringify(appContext.viewModel.model.gameState.phase)}</div>
      <div>turn: {appContext.viewModel.model.gameState.turn}</div>
      <div>立即效果</div>
      {renderImmediateEffects}
      <div>堆疊效果</div>
      {renderStackEffects}
      <div>指令</div>
      <FlowListView clientId={props.clientId}></FlowListView>
      <TableView clientId={props.clientId}></TableView>
    </div>
  }, [
    appContext.viewModel.model.gameState,
    props.clientId, 
    renderStackEffects
  ])
  return render
}
