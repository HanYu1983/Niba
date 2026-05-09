package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IOutboxMessage;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import game.LevelKeys;

/**
 * 驗證 outbox 中阻塞型 Popup 訊息生命週期：
 * - 狀態變更後會產生對應 outbox 項目
 * - 可讀取 title／payload（{@link IOutboxMessage#payload}）
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
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));
    // 資源格改為 pending；需先按「領取」才會產生收益訊息
    var claimNode = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.ResourceClaim);
    var claimEntry = MenuNodeQuery.buttonEntryOnNode(claimNode, PlayerMenuKind.ResourceClaim);
    if (claimEntry == null)
      throw "PopupLifecycleTest: missing claim entry";
    claimNode.setActivationEntry(claimEntry);
    match.applyMenuLeaf(actor, claimNode);

    var xs = match.pendingOutbox(idA);
    if (xs.length < 1)
      throw "PopupLifecycleTest: expected at least 1 outbox item";

    var found:Null<IOutboxMessage> = null;
    for (m in xs) {
      switch m.presentation() {
        case Popup(title, _):
          if (title == "資源格收益") {
            found = m;
          }
        default:
      }
      if (found != null)
        break;
    }
    if (found == null)
      throw 'PopupLifecycleTest: expected outbox title "資源格收益"';

    switch found.payload() {
      case ResourceClaimed(idx, _):
        if (idx != 1)
          throw 'PopupLifecycleTest: expected resource tile index 1, got ${idx}';
      default:
        throw "PopupLifecycleTest: expected ResourceClaimed payload";
    }

    var beforeAckCount = xs.length;
    match.ackOutbox(idA, found.id());

    var afterAck = match.pendingOutbox(idA);
    if (afterAck.length != beforeAckCount - 1)
      throw 'PopupLifecycleTest: outbox count should decrease by 1, before=${beforeAckCount}, after=${afterAck.length}';
    for (x in afterAck)
      if (x.id() == found.id())
        throw "PopupLifecycleTest: acked item should be removed";

    trace("[PopupLifecycleTest] OK — outbox create/read/ack lifecycle");
  }
}
