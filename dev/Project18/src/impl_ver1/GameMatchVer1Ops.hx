package impl_ver1;

import game.IPlayer;

/**
 * Ver1 終局／移動規剘入口：由 {@link GameMatchCore} 傳入 {@code this} 委派至此。
 * {@link GameMatchCore} 設 {@literal @:allow(impl_ver1)}，本套件內可存取賽局私有欄位以利規剘擴充。
 */
class GameMatchVer1Ops {
  public static function evaluateTermination(m:GameMatchCore):Void {}

  public static function applyMenuLeafForMove(m:GameMatchCore, actor:IPlayer):Void {
    var ruler = cast(m.activeMonarch(), Monarch);
    ruler.advanceOnBoard(GameMatchCore.DEFAULT_MOVE_DELTA, m.board().length());
    m.settleAfterMoveLanding();
  }
}
