package debug;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 事件「軍資」兩段式：TileEventPick take_supplies → 暫存預覽列 → JiCePick 選 g-evt → +15 兵力。
 */
class TileEventSupplyStagingTest {
  public static function run():Void {
    var g = new SimpleGame();
    var match:SimpleGameMatch = cast g.createGameMatch(MatchLevels.KEY_TILE_EVENT_RING10_EVT3);
    var monarch = cast(match.monarchs()[0], SimpleMonarch);
    var fork = match.debugForkLoot;
    if (fork == null)
      throw "TileEventSupplyStagingTest: debugForkLoot 未設定";

    var player:IPlayer = match.createPlayer(monarch.id(), "evt-supply-player");

    match.applyMenuLeaf(player, TileEventLandingTest.requireLeafKind(match.createPlayerMenu(player), Move));

    if (match.pendingTileEvent() == null)
      throw "TileEventSupplyStagingTest: 落地後應有 pending 事件";

    var menuBranch = match.createPlayerMenu(player);
    var supplyLeaf = findTileEventPick(menuBranch, "take_supplies");
    if (supplyLeaf == null)
      throw "TileEventSupplyStagingTest: 缺少 take_supplies 選項";
    match.applyMenuLeaf(player, supplyLeaf);

    if (match.pendingTileEvent() == null)
      throw "TileEventSupplyStagingTest: 進入選將暫存時仍應有 pendingTileEvent";
    if (match.tileEventStagingPreviewRows().length != 1)
      throw "TileEventSupplyStagingTest: 預期一列武將預覽";

    var menuPick = match.createPlayerMenu(player);
    var jiLeaves = collectLeavesKind(menuPick, JiCePick);
    if (jiLeaves.length != 1)
      throw "TileEventSupplyStagingTest: 預期單一 JiCePick（選將），got " + jiLeaves.length;
    if (jiLeaves[0].decisionToken() != "g-evt")
      throw "TileEventSupplyStagingTest: 機械鍵應為 g-evt";

    match.applyMenuLeaf(player, jiLeaves[0]);

    if (match.pendingTileEvent() != null)
      throw "TileEventSupplyStagingTest: 結算後應清除 pending";
    if (monarch.troops() != 115)
      throw "TileEventSupplyStagingTest: 預期兵力 100+15=115，got " + monarch.troops();
    if (fork.lastResolvedChoice != "take_supplies:g-evt")
      throw "TileEventSupplyStagingTest: lastResolvedChoice 不符，got " + fork.lastResolvedChoice;

    trace("[TileEventSupplyStagingTest] OK — 軍資→選將預覽→JiCePick→結算兵力");
  }

  static function findTileEventPick(menu:IPlayerMenu, decisionToken:String):Null<IPlayerMenuEntry> {
    return findPickInNodes(menu.rootNodes(), TileEventPick, decisionToken);
  }

  static function findPickInNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind, decisionToken:String):Null<IPlayerMenuEntry> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind && L.decisionToken() == decisionToken)
        return L;
      var inner = findPickInNodes(n.children(), kind, decisionToken);
      if (inner != null)
        return inner;
    }
    return null;
  }

  static function collectLeavesKind(menu:IPlayerMenu, kind:PlayerMenuKind):Array<IPlayerMenuEntry> {
    var acc:Array<IPlayerMenuEntry> = [];
    collectLeavesKindNodes(menu.rootNodes(), kind, acc);
    return acc;
  }

  static function collectLeavesKindNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind, acc:Array<IPlayerMenuEntry>):Void {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind)
        acc.push(L);
      collectLeavesKindNodes(n.children(), kind, acc);
    }
  }
}
