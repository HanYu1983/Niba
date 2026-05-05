package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuFormWidget;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.JiCe;
import game.PlayerMenuKind.StagingSubmit;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.jice.DissensionJiCe;
import impl_ver1.jice.RumorJiCe;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

/**
 * 【指定玩家】計策：只驗證選單→staging→提交的骨架能跑通，且提交必定消耗施計者體力（不驗證成功/失敗效果，避免隨機性）。
 */
class PlayerTargetJiCeMenuFlowTest {
  public static function testPlayerTargetJiCeMenuFlow(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    var tiles = [match.createTile(0, Plain)];
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0, 200, 50);
    match.createMonarch(idB, 1, 0, 200, 50);
    match.createGeneral("g-a", idA, 80, 80, 80, 80);
    match.createGeneral("g-b", idB, 80, 80, 80, 80);

    // A 持有兩張【指定玩家】牌
    match.createJiCe(DissensionJiCe.REGISTRY_KEY, idA);
    match.createJiCe(RumorJiCe.REGISTRY_KEY, idA);

    var actorA:IPlayer = match.createPlayer(idA, "A");

    // 點第一張牌（decisionToken=0）進 staging
    var m0 = match.createPlayerMenu(actorA);
    var firstJiCe = MenuNodeQuery.requireNodeWithKind(m0, JiCe);
    if (!firstJiCe.leaf().isEnabled())
      throw "PlayerTargetJiCeMenuFlowTest: 第一張 JiCe 應可用";
    match.applyMenuLeaf(actorA, firstJiCe);
    if (!match.forceHasPendingStaging())
      throw "PlayerTargetJiCeMenuFlowTest: 打出 JiCe 後應進 staging";

    // staging 內：確認表單形狀（MonarchSinglePick + GeneralMultiPick + Button）
    var menuPick = match.createPlayerMenu(actorA);
    var stgNode = PlayerMenuFind.findStagingSubmitNode(menuPick);
    var fw = stgNode.formWidgets();
    if (fw.length < 3)
      throw "PlayerTargetJiCeMenuFlowTest: staging widgets 長度不足";
    switch fw[0] {
      case MonarchSinglePick(_, _, _):
      default:
        throw "PlayerTargetJiCeMenuFlowTest: [0] 應為 MonarchSinglePick";
    }
    switch fw[1] {
      case GeneralMultiPick(_, _, _):
      default:
        throw "PlayerTargetJiCeMenuFlowTest: [1] 應為 GeneralMultiPick";
    }
    var sub = MenuNodeQuery.buttonEntryOnNode(stgNode, StagingSubmit);
    if (sub == null)
      throw "PlayerTargetJiCeMenuFlowTest: staging 缺少提交鈕";

    // 提交前記錄施計者體力（必定消耗）
    var rulerA = cast(match.activeMonarch(), Monarch);
    var caster = cast(rulerA.roster()[0], General);
    var before = caster.stamina();

    stgNode.setActivationEntry(sub);
    match.applyMenuLeaf(actorA, stgNode);

    if (match.forceHasPendingStaging())
      throw "PlayerTargetJiCeMenuFlowTest: 提交後 staging 應清除";
    if (caster.stamina() >= before)
      throw "PlayerTargetJiCeMenuFlowTest: 提交後施計者體力應下降";

    trace("[PlayerTargetJiCeMenuFlowTest] OK — 指定玩家：選單→staging→提交骨架");
  }
}

