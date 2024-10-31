import { useContext, useMemo, useEffect } from "react";
import { getPlayerFlowAuto } from "../../game/gameStateWithFlowMemory/ai/getPlayerFlowAuto";
import { thinkVer1 } from "../../game/gameStateWithFlowMemory/ai/thinkVer1";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { Flow } from "../../game/gameStateWithFlowMemory/Flow";
import { thinkVer2 } from "../../game/gameStateWithFlowMemory/ai/thinkVer2";

export function PlayerController(props: { clientId: string, isPlayer?: boolean }) {
  const appContext = useContext(AppContext);
  const flows = useMemo(() => {
    return appContext.viewModel.playerCommands[props.clientId] || []
  }, [appContext.viewModel.playerCommands[props.clientId]]);
  useEffect(() => {
    if (flows.length) {
      let flow: Flow | null = null
      if (props.isPlayer) {
        flow = getPlayerFlowAuto(appContext.viewModel.model.gameState, props.clientId, flows)
      } else {
        flow = thinkVer2(appContext.viewModel.model.gameState, props.clientId, flows)
      }
      if (flow) {
        setTimeout(() => {
          OnEvent.next({
            id: "OnClickFlowConfirm",
            clientId: props.clientId,
            flow: flow,
            versionID: appContext.viewModel.model.versionID
          });
        }, 50)
      }
    }
  }, [appContext.viewModel.model.gameState, props, flows]);
  return <></>
}