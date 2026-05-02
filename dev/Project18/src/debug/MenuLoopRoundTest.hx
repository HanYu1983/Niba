package debug;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.PlayerMenuKind;

/**
 * 單輪選單迴圈：取得目前玩家 → createPlayerMenu → applyMenuLeaf → 再取選單…
 */
class MenuLoopRoundTest {
  public static function run():Void {
    var g = new SimpleGame();
    var match:SimpleGameMatch = cast g.createGameMatch(MatchLevels.KEY_MENU_LOOP_PLAIN_RING2);

    var monarch = cast(match.monarchs()[0], SimpleMonarch);
    var player:IPlayer = match.createPlayer(monarch.id(), "loop-player");

    if (match.activeMonarch().id() != player.monarchId())
      throw "MenuLoopRoundTest: player must be active monarch";

    var menu0 = match.createPlayerMenu(player);
    if (findLeaf(menu0, ConfirmDone) != null)
      throw "MenuLoopRoundTest: 結束項尚未允許出現（slice 未完成）";

    match.applyMenuLeaf(player, requireLeaf(menu0, Move));
    if (!match.isActivePlayerSliceComplete())
      throw "MenuLoopRoundTest: 移動後應標記切片可結束";

    var menu1 = match.createPlayerMenu(player);
    var endLeaf = requireLeaf(menu1, ConfirmDone);

    var menuStatus = match.createPlayerMenu(player);
    match.applyMenuLeaf(player, requireLeaf(menuStatus, Status));

    if (!match.isActivePlayerSliceComplete())
      throw "MenuLoopRoundTest: Status 不得清除結束旗標";

    var menu2 = match.createPlayerMenu(player);
    requireLeaf(menu2, ConfirmDone);

    match.applyMenuLeaf(player, endLeaf);

    if (match.isActivePlayerSliceComplete())
      throw "MenuLoopRoundTest: ConfirmDone 後應清掉結束旗標";

    var menu3 = match.createPlayerMenu(player);
    if (findLeaf(menu3, ConfirmDone) != null)
      throw "MenuLoopRoundTest: 結束項應已隱藏直至下一次切片完成";

    trace("[MenuLoopRoundTest] OK — 選單迴圈：移動→結束項出現→狀態無副作用→結束→結束項隱藏");
  }

  static function findLeaf(menu:IPlayerMenu, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    return findLeafInNodes(menu.rootNodes(), kind);
  }

  static function findLeafInNodes(nodes:Array<IPlayerMenuNode>, kind:PlayerMenuKind):Null<IPlayerMenuEntry> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == kind)
        return L;
      var inner = findLeafInNodes(n.children(), kind);
      if (inner != null)
        return inner;
    }
    return null;
  }

  static function requireLeaf(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuEntry {
    var L = findLeaf(menu, kind);
    if (L == null)
      throw "MenuLoopRoundTest: missing menu leaf " + Std.string(kind);
    return L;
  }
}
