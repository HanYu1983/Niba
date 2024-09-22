
import { useContext, useMemo } from "react";
import { AppContext } from "../tool/appContext";
import { OnEvent } from "../tool/appContext/eventCenter";
import { ConditionView } from "./ConditionView";
import { TargetTypeView } from "./TargetTypeView";
import { Effect, EffectFn } from "../../game/define/Effect";
import { Tip } from "../../game/define/Tip";
import { CardText } from "../../game/define/CardText";
import { getEffectTips } from "../../game/gameState/effect";
import { prop } from "ramda";

export const RequireView = (props: {
  clientID: string;
  blockPayload: Effect;
}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const tipOrEs = getEffectTips(appContext.viewModel.model.gameState, props.blockPayload, 0, 0)
    return (
      <div style={{ border: "1px solid black" }}>
        {tipOrEs.map((tipOrE, i) => {
          const responsePlayer = EffectFn.getPlayerID(props.blockPayload)
          const isTargetOwner = responsePlayer == props.clientID;
          return (
            <div key={i} style={{ border: "1px solid black" }}>
              {isTargetOwner ? (
                <button
                  onClick={() => {
                    OnEvent.next({
                      id: "OnClickRequireTargetConfirm",
                      clientID: props.clientID,
                      blockPayload: props.blockPayload,
                      require: props.blockPayload.text.conditions?.[tipOrE.conditionKey],
                      varID: tipOrE.conditionKey,
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
                    blockPayload={props.blockPayload}
                    target={tipOrE.tip}
                  ></TargetTypeView>
              }
            </div>
          );
        })}
      </div>
    );
  }, [
    appContext.viewModel.model,
    props.blockPayload,
    props.clientID,
  ]);
  return (
    <div style={{ border: "1px solid black" }}>
      {props.blockPayload.id}
      {render}
    </div>
  );
};
