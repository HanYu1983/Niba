package debug_ver1;

import game.GameIds;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.StagingSubmit;
import game.PlayerMenuKind.VillagePlunder;
import game.TileKind;
import game.LevelKeys;

/**
 * 指令菜單流程：移動落在 Village → 出現搶奪 → 進 staging → 提交後退出 staging（村落 pending 清除）。
 * 重點：測菜單流程，不檢查搶奪結果。
 */
class VillagePlunderMenuFlowTest {
  public static function testVillagePlunderMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);

    var tiles:Array<ITile> = [];
    tiles.push(match.createTile(0, Plain));
    tiles.push(match.createTile(1, Plain));
    tiles.push(match.createTile(2, Plain));
    tiles.push(match.createTile(3, Village));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 300, 80);
    match.createGeneral("g-a-1", idA, 10, 40, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    var m0 = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));

    var m0b = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m0b, LandingContinue));

    var m1 = match.createPlayerMenu(actor);
    requireEnabledNode(m1, VillagePlunder);

    match.applyMenuLeaf(actor, requireEnabledNode(m1, VillagePlunder));
    if (!match.forceHasPendingStaging())
      throw "VillagePlunderMenuFlowTest: 應已進入 staging";

    var m2 = match.createPlayerMenu(actor);
    var stg = MenuNodeQuery.requireNodeWithKind(m2, StagingSubmit);
    var sub = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (sub == null)
      throw "VillagePlunderMenuFlowTest: 缺少提交鈕";
    stg.setActivationEntry(sub);
    match.applyMenuLeaf(actor, stg);

    if (match.forceHasPendingStaging())
      throw "VillagePlunderMenuFlowTest: 提交後 staging 應清除";
    if (match.forceGetPendingVillageTile() != null)
      throw "VillagePlunderMenuFlowTest: 提交後 pendingVillage 應清除";

    trace("[VillagePlunderMenuFlowTest] OK — village plunder menu flow");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "VillagePlunderMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

