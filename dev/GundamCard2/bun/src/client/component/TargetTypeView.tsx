import { Effect } from "../../game/define/Effect";
import { CardView } from "./CardView";
import { StrBaSyouPair, Tip, TipFn } from "../../game/define/Tip";
import { useMemo } from "react";

export const TargetTypeView = (props: {
  clientID: string;
  effect: Effect;
  target: Tip;
}) => {
  const render = useMemo(() => {
    switch (props.target.title[0]) {
      case "カード": {
        const pairs = TipFn.getSelection(props.target) as StrBaSyouPair[]
        return pairs.map((pair, i) => {
          const [cardId, _] = pair
          return (
            <CardView enabled={false} key={i} cardID={cardId} clientID={props.clientID}></CardView>
          );
        });
      }
      case "テキスト":
      case "StringOptions": {
        const values = TipFn.getSelection(props.target)
        return values.map((v, i) => {
          return <div key={i}>{JSON.stringify(v)}</div>;
        });
      }
    }
  }, [props])
  return render
};
