import { useEffect } from "react"
import { AppContextProvider } from "../tool/appContext"
import { CocosIframe } from "./CocosIframe"
import { CocosUIView } from "./CocosUIView"
import { getItemBaSyou, getItemController } from "../../game/gameState/ItemTableComponent"
import { getItemState } from "../../game/gameState/ItemStateComponent"

export const CocosAppVer = () => {

  useEffect(() => {
    (window as any)['getItemController'] = getItemController;
    (window as any)['getItemBaSyou'] = getItemBaSyou;
    (window as any)['getItemState'] = getItemState;
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