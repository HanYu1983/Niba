package impl_ver1;

import game.IPlayer;
import game.IPlayerMenuNode;

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

  /**
   * 敵城對峙：攻方選項已通過校驗並寫入 {@link GameMatchCore} 暫存（將進入守方階段）。
   * 兵力／糧食／城池歸屬等規剘於此擴充。
   */
  public static function handleHostileCityAttackerPick(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /**
   * 敵城對峙：守方於非單挑路線確認結束；{@link GameMatchCore} 已備好結算預覽文案並進入攻方結算階段。
   */
  public static function handleHostileCityDefenderAck(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /**
   * 敵城對峙：守方單挑應戰武將已確定；{@link GameMatchCore} 已備好結算預覽並進入攻方結算階段。
   */
  public static function handleHostileCityDefenderPickSubmit(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /**
   * 敵城對峙：攻方確認結算（呼叫時 pending／摘要仍在，清除前行為於此擴充）。
   */
  public static function handleHostileCitySettlementAck(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}
}
