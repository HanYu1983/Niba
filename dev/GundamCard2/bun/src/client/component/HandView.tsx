import { useContext, useMemo } from "react";
import { AbsoluteBaSyou, AbsoluteBaSyouFn } from "../../game/define/BaSyou";
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";
import { queryFlow } from "../../game/gameStateWithFlowMemory/queryFlow";
import { EffectFn } from "../../game/define/Effect";
import { getItemPrototype } from "../../game/gameState/ItemTableComponent";
// no use
export const HandView = (props: {
  clientId: string;
  cardPosition: AbsoluteBaSyou;
}) => {
  const appContext = useContext(AppContext);
  const cards = useMemo(() => {
    return (
      appContext.viewModel.model.gameState.table.cardStack[
      AbsoluteBaSyouFn.toString(props.cardPosition)
      ] || []
    );
  }, [
    props.cardPosition,
    appContext.viewModel.model.gameState.table.cardStack,
  ]);
  const renderCards = useMemo(() => {
    return <div
      style={{
        display: "flex",
        border: "2px solid black",
        overflow: "scroll",
      }}
    >
      {
        cards.map(cardID => {
          
          return <>
            <CardView
              key={cardID}
              enabled={true}
              clientId={props.clientId}
              cardID={cardID}
              size={200}
            ></CardView>
            
          </>
        })
      }
    </div>
  }, [cards])
  return renderCards
};

