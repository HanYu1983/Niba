import { useContext, useMemo } from "react";
import { CardText, Condition } from "../../game/define/CardText";
import { Effect } from "../../game/define/Effect";
import { AppContext } from "../tool/appContext";
import { TargetTypeView } from "./TargetTypeView";
import { createEffectTips } from "../../game/gameState/effect";

export const ConditionView = (props: {
  effect: Effect;
  targets: { [key: string]: Condition };
}) => {
  const appContext = useContext(AppContext);
  const render = useMemo(() => {
    const tips = createEffectTips(appContext.viewModel.model.gameState, props.effect, 0, 0)
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
              effect={props.effect}
              target={tipOrE.tip}
            ></TargetTypeView>
          })
        }

      </div>
    );
  }, [props.effect, props.targets, appContext.viewModel.model.gameState]);
  return render
};
