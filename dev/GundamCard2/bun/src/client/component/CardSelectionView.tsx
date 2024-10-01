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
          const proto = getItemPrototype(appContext.viewModel.model.gameState, cardID)
          const texts = [...(proto.commandText ? [proto.commandText] : []), ...(proto.texts || [])]
          return <div key={cardID}>
            <CardView
              enabled={true}
              clientId={props.clientId}
              cardID={cardID}
              size={300}
            ></CardView>
            <div>{proto.title}</div>
            {
              texts.map((text, i) => {
                return <div key={text.id}>
                  <div style={{ border: "1px solid black" }}>{text.description}</div>
                </div>
              })
            }
            <div>{proto.characteristic}</div>
            <div style={{ color: "grey" }}>{proto.description}</div>
          </div>
        })
      }
    </div>
  }, [appContext.viewModel.cardSelection])
  return selection
}