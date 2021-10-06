import { Context, CardPosition, Action, Payment, Effect } from "../model/types";
import { opponent, askPlayerG, cardPositionID } from "../model/alg";

function onEffectCompleted(ctx: Context, effect: Effect): Context {
  // 狂乱の女戦士【コレクタブルレア】
  //（自軍戦闘階段）：敵軍手札を全部見て、那個中に存在的卡１枚を選んで廃棄執行。
  //『恒常』：このカードの解決直後に、本来の記述に｢特徴：装弾｣を持つ自軍G１枚をロールできる。その場合、敵軍は、自分の手札１枚を選んで廃棄する。
  //（自軍戦闘フェイズ）：敵軍手札を全て見て、その中にあるカード１枚を選んで廃棄する。
  if (effect.action.id != "PlayCardAction") {
    return ctx;
  }
  return {
    ...ctx,
    paymentTable: {
      action: {
        id: "PlayCardAbilityAction",
        cardID: effect.action.cardID,
        playerID: effect.action.playerID,
        abilityID: "",
      },
      requires: [
        {
          id: "TapPayment",
          cardID: null,
          playerID: effect.action.playerID,
          condition: ["特徴：装弾"],
        },
        {
          id: "Target1Payment",
          cardID: null,
          playerID: opponent(ctx, effect.action.playerID),
          condition: ["手牌"],
        },
      ],
      currents: [],
      snapshot: null,
      isLock: true,
    },
  };
}

module.exports = {
  onEffectCompleted,
};
