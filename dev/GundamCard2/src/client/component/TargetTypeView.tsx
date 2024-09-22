import { Effect } from "../../game/define/Effect";
import { CardView } from "./CardView";
import { StrBaSyouPair, Tip, TipFn } from "../../game/define/Tip";

export const TargetTypeView = (props: {
  blockPayload: Effect;
  target: Tip;
}) => {
  return (
    <>
      {(() => {
        switch (props.target.title[0]) {
          case "カード": {
            const pairs = TipFn.getSelection(props.target) as StrBaSyouPair[]
            return pairs.map((pair, i) => {
              const [cardId, _] = pair
              return (
                <CardView enabled={false} key={i} cardID={cardId}></CardView>
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
      })()}
    </>
  );
};
