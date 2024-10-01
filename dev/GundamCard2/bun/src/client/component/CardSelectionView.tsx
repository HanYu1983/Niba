import { CSSProperties, useContext, useMemo } from "react"
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";
import { getItemPrototype } from "../../game/gameState/ItemTableComponent";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { EffectFn } from "../../game/define/Effect";

export const CardSelectionView = (props: {
  clientId: string
  style?: CSSProperties
}) => {
  const appContext = useContext(AppContext);
  const selection = useMemo(() => {
    return <div style={props.style}>
      {
        appContext.viewModel.cardSelection.map(cardID => {
          return <div key={cardID}>
            <CardView
              enabled={true}
              clientId={props.clientId}
              cardID={cardID}
              size={300}
              isShowInfo={true}
              isShowCmd={true}
            ></CardView>
          </div>
        })
      }
    </div>
  }, [props, appContext.viewModel.cardSelection])
  return selection
}