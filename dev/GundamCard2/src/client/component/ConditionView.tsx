import { useContext, useMemo } from "react";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { AppContext } from "../tool/appContext";
import { TargetTypeView } from "./TargetTypeView";
import { getEffectTips } from "../../game/gameState/effect";

export const ConditionView = (props: {
  blockPayload: Effect;
  targets: { [key: string]: Condition };
}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const tips = getEffectTips(appContext.viewModel.model.gameState, props.blockPayload, 0, 0)
    return (
      <div>
        {
          tips.map((tipOrE, i) => {
            if (tipOrE.errors) {
              return <div>{tipOrE.errors.map(e => e.message).join("|")}</div>
            }
            if (tipOrE.tip == null) {
              return <div>tip not found</div>
            }
            return <TargetTypeView
              key={i}
              blockPayload={props.blockPayload}
              target={tipOrE.tip}
            ></TargetTypeView>
          })
        }

      </div>
    );
  }, [props.blockPayload, props.targets]);
  return <>{render}</>;
};
