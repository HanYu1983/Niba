import { useEffect } from "react"
import { AppContextProvider } from "../tool/appContext"
import { CocosIframe } from "./CocosIframe"
import { CocosUIView } from "./CocosUIView"
import { getItemBaSyou, getItemController } from "../../game/gameState/ItemTableComponent"
import { getItemState } from "../../game/gameState/ItemStateComponent"
import { getPlayerFlowAuto } from "../../game/gameStateWithFlowMemory/ai/getPlayerFlowAuto"
import { thinkVer2 } from "../../game/gameStateWithFlowMemory/ai/thinkVer2"

export const CocosAppVer = () => {

  useEffect(() => {
    (window as any)['getItemController'] = getItemController;
    (window as any)['getItemBaSyou'] = getItemBaSyou;
    (window as any)['getItemState'] = getItemState;
    (window as any)['getPlayerFlowAuto'] = getPlayerFlowAuto;
    (window as any)['thinkVer2'] = thinkVer2;
  }, [])

  return (
    <>
      <AppContextProvider>
        <CocosIframe></CocosIframe>
        <CocosUIView></CocosUIView>
      </AppContextProvider>
    </>
  )
}