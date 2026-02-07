import { useEffect } from "react"
import { ControlView } from "../component/ControlView"
import { AppContextProvider } from "../tool/appContext"
import { CocosIframe } from "./CocosIframe"
import { CocosUIView } from "./CocosUIView"
import { DeckSelectionView } from "./DeckSelectionView"
import { getItemController } from "../../game/gameState/ItemTableComponent"

export const CocosAppVer = () => {

  useEffect(() => {
    (window as any)['getItemController'] = getItemController
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