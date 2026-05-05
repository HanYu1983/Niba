package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PopupPayload;
import game.TileKind;
import game.LevelKeys;

/**
 * 驗證 popup outbox 生命週期：
 * - 狀態變更後會產生 popup
 * - 可讀取 title / payload
 * - ack 後會自隊列移除
 */
class PopupLifecycleTest {
  public static function testPopupLifecycle(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Resource),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));

    var popups = match.pendingPopups(idA);
    if (popups.length < 1)
      throw "PopupLifecycleTest: expected at least 1 popup";

    var p = null;
    for (x in popups)
      if (x.title() == "資源格收益") {
        p = x;
        break;
      }
    if (p == null)
      throw 'PopupLifecycleTest: expected popup title "資源格收益"';

    switch p.payload() {
      case Plain(text):
        if (text.indexOf("金錢 +30") < 0 || text.indexOf("糧食 +30") < 0)
          throw 'PopupLifecycleTest: unexpected popup payload "$text"';
      default:
        throw "PopupLifecycleTest: expected Plain payload";
    }

    var beforeAckCount = popups.length;
    match.ackPopup(idA, p.id());

    var afterAck = match.pendingPopups(idA);
    if (afterAck.length != beforeAckCount - 1)
      throw 'PopupLifecycleTest: popup count should decrease by 1, before=${beforeAckCount}, after=${afterAck.length}';
    for (x in afterAck)
      if (x.id() == p.id())
        throw "PopupLifecycleTest: acked popup should be removed";

    trace("[PopupLifecycleTest] OK — popup create/read/ack lifecycle");
  }
}
