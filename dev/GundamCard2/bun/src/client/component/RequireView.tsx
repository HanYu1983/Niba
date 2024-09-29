
import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { ConditionView } from "./ConditionView";
import { TargetTypeView } from "./TargetTypeView";
import { Effect, EffectFn } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { CardText, Condition } from "../../game/define/CardText";
import { createEffectTips } from "../../game/gameState/doEffect";
import { prop } from "ramda";

export const RequireView = (props: {
  clientId: string;
  effect: Effect;
  conditions: {[key:string]:Condition}
}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const tipOrEs = createEffectTips(appContext.viewModel.model.gameState, props.effect, 0, 0)
    return (
      <div style={{ border: "1px solid black" }}>
        {tipOrEs.map((tipOrE, i) => {
          const responsePlayer = EffectFn.getPlayerID(props.effect)
          const isTargetOwner = responsePlayer == props.clientId;
          return (
            <div key={i} style={{ border: "1px solid black" }}>
              {isTargetOwner ? (
                <button
                  onClick={() => {
                    OnEvent.next({
                      id: "OnClickRequireTargetConfirm",
                      clientId: props.clientId,
                      effect: props.effect,
                      condition: props.conditions[tipOrE.conditionKey],
                      conditionKey: tipOrE.conditionKey,
                    });
                  }}
                >
                  設定{tipOrE.conditionKey}
                </button>
              ) : null}
              {
                tipOrE.tip == null ?
                  <div>tip not found</div> :
                  <TargetTypeView
                    clientId={props.clientId}
                    effect={props.effect}
                    target={tipOrE.tip}
                  ></TargetTypeView>
              }
            </div>
          );
        })}
      </div>
    );
  }, [
    appContext.viewModel.model.gameState,
    props,
  ]);
  return (
    <div style={{ border: "1px solid black" }}>
      {props.effect.id}
      {render}
    </div>
  );
};
