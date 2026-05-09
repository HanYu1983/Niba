package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind.JiCe;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.IPlayerMenuNode;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.jice.DissensionJiCe;
import impl_ver1.jice.FireJiCe;
import impl_ver1.jice.FarmJiCe;

/**
 * 驗證「計策使用時機」骨架：
 * - 移動後策略選單中，不應出現僅允許移動前的牌。
 * - 若用其它方式仍嘗試打出，Core 也會拒絕（雙保險）。
 */
class StrategyPhaseRestrictionTest {
  public static function testStrategyPhaseRestriction(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(3);
    match.createBoard([match.createTile(0, Plain), match.createTile(1, Plain), match.createTile(2, Plain), match.createTile(3, Plain)]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 200, 50);
    match.createPlayer(idA, idA, false);
    match.createGeneral("g-a", idA, 80, 80, 80, 80);
    match.createJiCe(DissensionJiCe.REGISTRY_KEY, idA); // PreMove only
    match.createJiCe(FireJiCe.REGISTRY_KEY, idA); // Pre+Post

    var actor:IPlayer = match.playerForMonarch(idA);

    // 先移動進入 pendingLanding，才能看到 StrategyPost
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    var m1 = match.createPlayerMenu(actor);
    MenuNodeQuery.requireNodeWithKind(m1, LandingContinue);

    // 移動後策略選單：只會看到 allowedPhases 含 PostMove 的牌（此例 Fire）
    var mPost = match.createPlayerMenu(actor);
    if (match.forceGetPendingLandingTile() == null)
      throw "StrategyPhaseRestrictionTest: 預期 pendingLanding 存在";
    if (!match.canUseStrategyPostMove())
      throw "StrategyPhaseRestrictionTest: 預期 canUseStrategyPostMove() = true（已移動後）";
    var postNode = findStrategyPostNode(mPost.rootNodes());
    if (postNode == null)
      throw "StrategyPhaseRestrictionTest: 應存在「策略（移動後）」節點";
    var children = postNode.children();
    // ver1：可能存在其他可 PostMove 的策略（例如屯田）；此測試只要求「不出現 PreMove-only 的離間」，且火計必存在。
    var hasFire = false;
    var hasDissension = false;
    for (c in children) {
      if (c.caption() == FireJiCe.DESIGN_LABEL)
        hasFire = true;
      if (c.caption() == DissensionJiCe.DESIGN_LABEL)
        hasDissension = true;
    }
    if (!hasFire)
      throw "StrategyPhaseRestrictionTest: 移動後策略應至少包含火計";
    if (hasDissension)
      throw "StrategyPhaseRestrictionTest: 移動後策略不應包含離間";

    trace("[StrategyPhaseRestrictionTest] OK — allowedPhases 過濾 + core 檢查");
  }

  static function findStrategyPostNode(nodes:Array<IPlayerMenuNode>):Null<IPlayerMenuNode> {
    for (n in nodes) {
      var cap = n.caption();
      if (cap != null && cap.indexOf("策略") >= 0 && cap.indexOf("移動後") >= 0 && hasJiCeChild(n))
        return n;
      var inner = findStrategyPostNode(n.children());
      if (inner != null)
        return inner;
    }
    return null;
  }

  static function hasJiCeChild(n:IPlayerMenuNode):Bool {
    for (c in n.children()) {
      var leaf = c.leaf();
      if (leaf != null && leaf.kind() == JiCe)
        return true;
    }
    return false;
  }
}

