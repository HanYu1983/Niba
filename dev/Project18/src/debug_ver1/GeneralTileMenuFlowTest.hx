package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.GeneralRecruit;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.Move;
import game.TileKind;
import game.LevelKeys;

/**
 * 武將格（骨架）：落地後應出現 pendingGeneral，點「招募」或「離開」皆可結束落地切片。
 */
class GeneralTileMenuFlowTest {
  public static function testGeneralTileMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, General),
    ]);
    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 500, 80);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // Move：0 -> 1（General）
    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));
    var m1 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m1, LandingContinue));

    if (match.forceGetPendingGeneralTile() != 1)
      throw "GeneralTileMenuFlowTest: 預期 pendingGeneral=1";

    // 招募（骨架）→ 應清 pending + slice complete
    var m2 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m2, GeneralRecruit));
    if (match.forceGetPendingGeneralTile() != null)
      throw "GeneralTileMenuFlowTest: 招募後應清 pendingGeneral";
    if (!match.isActivePlayerSliceComplete())
      throw "GeneralTileMenuFlowTest: 招募後 slice 應可收束";
    trace("[GeneralTileMenuFlowTest] OK — 武將格骨架可收束");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "GeneralTileMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

