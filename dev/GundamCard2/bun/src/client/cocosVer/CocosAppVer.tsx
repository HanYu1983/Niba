import { ControlView } from "../component/ControlView"
import { AppContextProvider } from "../tool/appContext"
import { CocosIframe } from "./CocosIframe"
import { CocosUIView } from "./CocosUIView"
import { DeckSelectionView } from "./DeckSelectionView"

export const CocosAppVer = () => {
  return (
    <>
      <AppContextProvider>
        <CocosIframe></CocosIframe>
        <CocosUIView></CocosUIView>
      </AppContextProvider>
    </>
  )
}