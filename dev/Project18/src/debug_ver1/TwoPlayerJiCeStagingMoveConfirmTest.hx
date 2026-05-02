package debug_ver1;

import game.GameIds;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.Game;
import impl_ver1.LuoshiJiCe;

/**
 * 空白 level 組兩君主、一武將、一落石計策：驗證選單語意鏈
 * （移動+計策 → 暫存選將 → 移動 → 結束 → 換下家）。
 */
class TwoPlayerJiCeStagingMoveConfirmTest {
  public static function run():Void {
    var game:IGame = new Game();
    var match:IGameMatch = game.createGameMatch(Game.LEVEL_KEY_EMPTY);

    var tiles:Array<ITile> = [];
    for (i in 0...10)
      tiles.push(match.createTile(i, Plain));
    match.createBoard(tiles);

    match.createMonarch("m-atk", 0, 0, 500, 80);
    match.createMonarch("m-def", 1, 0, 100, 200);
    match.createGeneral("g-one", "m-atk", 1, 40, 1, 1);

    var atkId:MonarchId = "m-atk";
    var defId:MonarchId = "m-def";

    var luoshi:IJiCe = match.createJiCe(LuoshiJiCe.REGISTRY_KEY, atkId);

    var actorAtk = match.createPlayer(atkId, "攻");
    match.createPlayer(defId, "守");

    if (match.activeMonarch().id() != atkId)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 預期先手為 m-atk";

    var menu0 = match.createPlayerMenu(actorAtk);
    requireEnabledLeaf(menu0, Move);
    requireEnabledLeaf(menu0, JiCe);
    if (findLeaf(menu0, ConfirmDone) != null)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 開局不得出現結束葉";

    var jiLeaf = requireEnabledLeaf(menu0, JiCe);
    match.applyMenuLeaf(actorAtk, jiLeaf, luoshi, defId);

    if (match.forceGetPendingJiCe() == null)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 打出計策後應進入暫存";

    var menuPick = match.createPlayerMenu(actorAtk);
    var moveDisabled = findLeaf(menuPick, Move);
    if (moveDisabled != null && moveDisabled.isEnabled())
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 暫存期中「移動」應停用";

    var jiAgain = findLeaf(menuPick, JiCe);
    if (jiAgain != null && jiAgain.isEnabled())
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 暫存期中「計策」主項應停用";

    var pickLeaf = PlayerMenuFind.findJiCePickLeaf(menuPick, "g-one");
    match.applyMenuLeaf(actorAtk, pickLeaf);

    if (match.forceGetPendingJiCe() != null)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 選將後應清除 forceGetPendingJiCe";

    var menuAfterPick = match.createPlayerMenu(actorAtk);
    requireEnabledLeaf(menuAfterPick, Move);
    if (findLeaf(menuAfterPick, ConfirmDone) != null)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 計策結算後尚未移動前不應出現結束葉";

    match.applyMenuLeaf(actorAtk, requireEnabledLeaf(menuAfterPick, Move));

    if (!match.isActivePlayerSliceComplete())
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 平原移動後切片應可結束";

    var menuDone = match.createPlayerMenu(actorAtk);
    var doneLeaf = requireEnabledLeaf(menuDone, ConfirmDone);
    match.applyMenuLeaf(actorAtk, doneLeaf);

    if (match.activeMonarch().id() != defId)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 結束階段後應換至守方 " + defId;

    trace("[TwoPlayerJiCeStagingMoveConfirmTest] OK — 移動+計策→選將→移動→結束→換手");
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

  static function requireEnabledLeaf(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuEntry {
    var L = findLeaf(menu, kind);
    if (L == null)
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 選單缺少 " + Std.string(kind);
    if (!L.isEnabled())
      throw "TwoPlayerJiCeStagingMoveConfirmTest: 葉節點 " + Std.string(kind) + " 應為可用";
    return L;
  }
}
