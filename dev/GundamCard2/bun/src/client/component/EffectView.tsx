import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { CardView } from "./CardView";
import { Effect, EffectFn } from "../../game/define/Effect";
import { getEffect } from "../../game/gameState/EffectStackComponent";

export const EffectView = (props: {
  enabled: boolean;
  clientId: string;
  effectID: string;
}) => {
  const appContext = useContext(AppContext);
  const effect: Effect | string = useMemo(() => {
    try {
      return getEffect(appContext.viewModel.model.gameState, props.effectID)
    } catch (e: any) {
      console.error(e)
      return e.message
    }
  }, [appContext.viewModel.model.gameState, props.effectID]);
  if (typeof effect == "string") {
    return <div>{props.effectID}:{effect}</div>;
  }
  const cardID: string | null = useMemo(() => {
    switch (effect.reason[0]) {
      case "Destroy":
      case "Event":
      case "PlayCard":
      case "PlayText":
      case "Situation":
      case "場に出る":
        return EffectFn.getCardID(effect)
      case "GameRule":
        return null;
    }
  }, [effect]);

  const render = useMemo(() => {
    return <div>
      <div>{effect.id}</div>
      <div>{JSON.stringify(effect.reason)}</div>
      <div>{effect.isOption ? "可取消" : "不可取消"}</div>
      <CardView
        enabled={true}
        clientId={props.clientId}
        cardID={cardID || undefined}
        isShowCmd={false}
      ></CardView>
      <div>
        {effect.text.description || effect.description}
      </div>
    </div>
  }, [props, cardID, effect])
  return render
};
