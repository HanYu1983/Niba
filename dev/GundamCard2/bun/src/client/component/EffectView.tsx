import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";
import { RequireView } from "./RequireView";
import { Effect, EffectFn } from "../../game/define/Effect";
import { getEffectIncludePlayerCommand } from "../../game/gameStateWithFlowMemory/effect";

export const EffectView = (props: {
  enabled: boolean;
  clientId: string;
  effectID: string;
}) => {
  const appContext = useContext(AppContext);
  const block: Effect | string = useMemo(() => {
    try {
      return getEffectIncludePlayerCommand(appContext.viewModel.model.gameState, props.effectID)
    } catch (e: any) {
      console.error(e)
      return e.message
    }
  }, [appContext.viewModel.model.gameState, props.effectID]);
  if (typeof block == "string") {
    return <div>{block}</div>;
  }
  const cardID: string | null = useMemo(() => {
    switch (block.reason[0]) {
      case "Destroy":
      case "Event":
      case "PlayCard":
      case "PlayText":
      case "Situation":
      case "場に出る":
        return EffectFn.getCardID(block)
      case "GameRule":
        return null;
    }
  }, [block]);

  const render = useMemo(() => {
    return <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>{block.isOption ? "可取消" : "不可取消"}</div>
      {cardID != null ? (
        <CardView
          enabled={false}
          clientId={props.clientId}
          cardID={cardID}
          isShowCmd={false}
        ></CardView>
      ) : (
        <div>{JSON.stringify(block.reason)}</div>
      )}
      <div style={{ flex: 4 }}>
        <div>{block.id}</div>
        <div>
          {block.description}({cardID})
        </div>
        {/*props.enabled && block.text.conditions ? (
          <RequireView
            clientId={props.clientId}
            effect={block}
            conditions={block.text.conditions}
          ></RequireView>
        ) : null*/}
      </div>
    </div>
  }, [props, cardID, block])

  return render
};
