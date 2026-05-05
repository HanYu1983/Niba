package debug_ver1;

import game.GameIds;
import game.MenuActivation;
import game.MenuNodeQuery;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.ITile;
import game.PlayerMenuKind;
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.StagingSubmit;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.VillageConquer;
import game.PlayerMenuKind.VillageTrade;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.core.GameMatchCore;

/**
 * 指令菜單流程：移動落在 Village → 出現村落指令（交易/攻占）→ 進 staging → 提交 → 村落 pending 清除 → 可結束。
 * 重點：只測菜單流程，不檢查交易/攻占的資源或兵力結算。
 */
class VillageMenuFlowTest {
  public static function testVillageMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    cast(match, GameMatchCore).forceSetFixedMoveDelta(3);

    // 讓 Move(預設 3 格) 落在 Village
    var tiles:Array<ITile> = [];
    tiles.push(match.createTile(0, Plain));
    tiles.push(match.createTile(1, Plain));
    tiles.push(match.createTile(2, Plain));
    tiles.push(match.createTile(3, Village));
    tiles.push(match.createTile(4, Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 500, 100);
    match.createGeneral("g-a-1", idA, 40, 40, 40, 40);
    match.createGeneral("g-a-2", idA, 20, 20, 20, 20);
    match.createGeneral("g-a-3", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // Move 前：不應出現村落指令
    var m0 = match.createPlayerMenu(actor);
    if (MenuNodeQuery.findNodeWithKind(m0.rootNodes(), VillageTrade) != null)
      throw "VillageMenuFlowTest: move 前不應出現 VillageTrade";
    if (MenuNodeQuery.findNodeWithKind(m0.rootNodes(), VillageConquer) != null)
      throw "VillageMenuFlowTest: move 前不應出現 VillageConquer";

    // 點 Move → 先進入 pendingLanding（移動後策略窗口）
    match.applyMenuLeaf(actor, requireEnabledNode(m0, Move));
    if (match.forceGetPendingLandingTile() == null)
      throw "VillageMenuFlowTest: 移動後應有 pendingLanding";

    // 按落地 → 觸發 village pending
    var m1a = match.createPlayerMenu(actor);
    match.applyMenuLeaf(actor, requireEnabledNode(m1a, LandingContinue));
    if (match.forceGetPendingVillageTile() == null)
      throw "VillageMenuFlowTest: 落地後應有 pendingVillage";

    var m1 = match.createPlayerMenu(actor);
    requireEnabledNode(m1, VillageTrade);
    requireEnabledNode(m1, VillageConquer);

    // 走 VillageTrade → staging → submit → 清 pendingVillage → 出現 ConfirmDone
    match.applyMenuLeaf(actor, requireEnabledNode(m1, VillageTrade));
    if (!match.forceHasPendingStaging())
      throw "VillageMenuFlowTest: 進入交易 staging 後應有 pendingStaging";

    var m2 = match.createPlayerMenu(actor);
    var stg = MenuNodeQuery.requireNodeWithKind(m2, StagingSubmit);
    var sub = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (sub == null)
      throw "VillageMenuFlowTest: staging 節點應含提交按鈕";
    stg.setActivationEntry(sub);
    match.applyMenuLeaf(actor, stg);

    if (match.forceHasPendingStaging())
      throw "VillageMenuFlowTest: 提交後 staging 應清除";
    if (match.forceGetPendingVillageTile() != null)
      throw "VillageMenuFlowTest: 村落指令提交後應清 pendingVillage";

    var m3 = match.createPlayerMenu(actor);
    requireEnabledNode(m3, ConfirmDone);

    trace("[VillageMenuFlowTest] OK — village menu flow");
  }

  static function requireEnabledNode(menu:IPlayerMenu, kind:PlayerMenuKind):IPlayerMenuNode {
    var n = MenuNodeQuery.requireNodeWithKind(menu, kind);
    if (!MenuActivation.activatingEntry(n).isEnabled())
      throw "VillageMenuFlowTest: 節點 " + Std.string(kind) + " 應為可用";
    return n;
  }
}

