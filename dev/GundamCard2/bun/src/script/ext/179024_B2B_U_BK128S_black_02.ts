// 179024_B2B_U_BK128S_black_02
// ガンダムTR-1［ヘイズル・アウスラ］［†］【コレクタブルレア】
// ヘイズル系　MS　T3部隊
// 戦闘配備　強襲　〔０〕：改装［ヘイズル系］　〔黒１毎〕：クロスウェポン［T3部隊］
// 『常駐』：このカードが戦闘エリアにいる場合、戦闘エリアにいる全ての敵軍ユニットは、－１／－１／－１を得る。
// （クロスウェポンのルール＞（戦闘フェイズ）：［ ］内の特徴を持つ自軍ユニット１枚は、ターン終了時まで、このカードの本来のテキスト１つと同じテキストを得る。ただし同じテキストは得られない）

import { title } from "process";
import { CardPrototype } from "../../game/define/CardPrototype";
import { Effect } from "../../game/define/Effect";
import { GameState } from "../../game/gameState/GameState";
import { Bridge } from "../bridge";
import { GlobalEffect } from "../../game/define/GlobalEffect";
import { StrBaSyouPair } from "../../game/define/Tip";

export const prototype: CardPrototype = {
  texts: [
    {
      id: "",
      description: "『常駐』：このカードが戦闘エリアにいる場合、戦闘エリアにいる全ての敵軍ユニットは、－１／－１／－１を得る。",
      title: ["自動型", "常駐"],
      onSituation: function _(ctx: GameState, effect: Effect, { DefineFn, GameStateFn, Options }: Bridge): GlobalEffect[] {
        const cardId = DefineFn.EffectFn.getCardID(effect)
        const situation = DefineFn.EffectFn.getSituation(effect)
        if (situation != null) {
          return []
        }
        const basyou = GameStateFn.getItemBaSyou(ctx, cardId)
        if (DefineFn.BaSyouKeywordFn.getBattleArea().includes(DefineFn.AbsoluteBaSyouFn.getBaSyouKeyword(basyou))) {
          const tip = GameStateFn.createTipByEntitySearch(ctx, effect, {
            side: "敵軍",
            at: ["戦闘エリア1", "戦闘エリア2"],
            is: ["ユニット"],
            max: 50,
            asMuchAsPossible: true
          }, {ges: Options.ges})
          const pairs = DefineFn.TipFn.getWant(tip) as StrBaSyouPair[]
          return [
            {
              title: ["＋x／＋x／＋xを得る", [-1, -1, -1]],
              cardIds: pairs.map(p => p[0]),
            }
          ]
        }
        return []
      }.toString()
    }
  ]
};
