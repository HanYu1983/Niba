package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.LevelKeys;
import game.MenuNodeQuery;
import game.MenuFormWidget;
import game.MenuActivation;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.jice.FireJiCe;
import impl_ver1.jice.FarmJiCe;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;

/**
 * docs/策略系統.md：目標限制
 * - 屯田/商路/築城：己方領地
 * - 火計/破壞：敵方領地
 *
 * 此測試只驗證 core 的限制會生效（不驗證成功/失敗效果）。
 */
class StrategyTileTargetOwnershipRestrictionTest {
  public static function testStrategyTileTargetOwnershipRestriction(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.createBoard([
      match.createTile(0, City),
      match.createTile(1, City),
    ]);

    var idA:MonarchId = "m-a";
    var idB:MonarchId = "m-b";
    match.createMonarch(idA, 0, 0, 200, 50);
    match.createPlayer(idA, idA, false);
    match.createMonarch(idB, 1, 0, 200, 50);
    match.createPlayer(idB, idB, false);
    match.createGeneral("g-a", idA, 80, 80, 80, 80);
    match.createGeneral("g-b", idB, 80, 80, 80, 80);

    // 直接設置屬主：0 為 A，1 為 B
    match.forceSetCityOwner(0, idA);
    match.forceSetCityOwner(1, idB);

    // 給 A 基礎策略牌
    match.createJiCe(FarmJiCe.REGISTRY_KEY, idA);
    match.createJiCe(FireJiCe.REGISTRY_KEY, idA);

    var actor:IPlayer = match.playerForMonarch(idA);

    // 先把武將升到足夠職位（避免解鎖干擾測試）
    var rulerA = cast(match.activeMonarch(), Monarch);
    var gA = cast(rulerA.roster()[0], General);
    gA.grantMerit(800);

    // 1) 屯田指向敵方城池（tile=1）應被拒絕
    {
      var menu = match.createPlayerMenu(actor);
      var jiceNode = requireJiCeNodeByCaption(menu.rootNodes(), FarmJiCe.DESIGN_LABEL);
      match.applyMenuLeaf(actor, jiceNode);
      var stg = PlayerMenuFind.findStagingSubmitNode(match.createPlayerMenu(actor));
      var fw = stg.formWidgets();
      // [0] GeneralMultiPick, [1] TileSinglePick
      switch fw[0] {
        case GeneralMultiPick(lbl, ch, _):
          fw[0] = GeneralMultiPick(lbl, ch, ["g-a"]);
        default:
          throw "StrategyTileTargetOwnershipRestrictionTest: expected GeneralMultiPick at [0]";
      }
      switch fw[1] {
        case TileSinglePick(lbl, ch, _):
          fw[1] = TileSinglePick(lbl, ch, [1]);
        default:
          throw "StrategyTileTargetOwnershipRestrictionTest: expected TileSinglePick at [1]";
      }
      var sub = MenuNodeQuery.buttonEntryOnNode(stg, PlayerMenuKind.StagingSubmit);
      if (sub == null)
        throw "StrategyTileTargetOwnershipRestrictionTest: missing submit";
      stg.setActivationEntry(sub);
      var threw = false;
      try {
        match.applyMenuLeaf(actor, stg);
      } catch (e:Dynamic) {
        threw = true;
      }
      if (!threw)
        throw "StrategyTileTargetOwnershipRestrictionTest: expected Farm targeting enemy to throw";
    }

    // 2) 火計指向己方城池（tile=0）應被拒絕
    {
      var match2:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
      match2.createBoard([match2.createTile(0, City), match2.createTile(1, City)]);
      match2.createMonarch(idA, 0, 0, 200, 50);
      match2.createPlayer(idA, idA, false);
      match2.createMonarch(idB, 1, 0, 200, 50);
      match2.createPlayer(idB, idB, false);
      match2.createGeneral("g-a", idA, 80, 80, 80, 80);
      match2.createGeneral("g-b", idB, 80, 80, 80, 80);
      match2.forceSetCityOwner(0, idA);
      match2.forceSetCityOwner(1, idB);
      match2.createJiCe(FireJiCe.REGISTRY_KEY, idA);
      var actor2:IPlayer = match2.playerForMonarch(idA);
      var ruler2 = cast(match2.activeMonarch(), Monarch);
      var g2 = cast(ruler2.roster()[0], General);
      g2.grantMerit(800);

      var menu = match2.createPlayerMenu(actor2);
      var jiceNode = requireJiCeNodeByCaption(menu.rootNodes(), FireJiCe.DESIGN_LABEL);
      match2.applyMenuLeaf(actor2, jiceNode);
      var stg = PlayerMenuFind.findStagingSubmitNode(match2.createPlayerMenu(actor2));
      var fw = stg.formWidgets();
      switch fw[0] {
        case GeneralMultiPick(lbl, ch, _):
          fw[0] = GeneralMultiPick(lbl, ch, ["g-a"]);
        default:
          throw "StrategyTileTargetOwnershipRestrictionTest: expected GeneralMultiPick at [0]";
      }
      switch fw[1] {
        case TileSinglePick(lbl, ch, _):
          fw[1] = TileSinglePick(lbl, ch, [0]);
        default:
          throw "StrategyTileTargetOwnershipRestrictionTest: expected TileSinglePick at [1]";
      }
      var sub = MenuNodeQuery.buttonEntryOnNode(stg, PlayerMenuKind.StagingSubmit);
      if (sub == null)
        throw "StrategyTileTargetOwnershipRestrictionTest: missing submit";
      stg.setActivationEntry(sub);
      var threw = false;
      try {
        match2.applyMenuLeaf(actor2, stg);
      } catch (e:Dynamic) {
        threw = true;
      }
      if (!threw)
        throw "StrategyTileTargetOwnershipRestrictionTest: expected Fire targeting own to throw";
    }

    trace("[StrategyTileTargetOwnershipRestrictionTest] OK — tile target ownership restrictions enforced");
  }

  static function requireJiCeNodeByCaption(nodes:Array<game.IPlayerMenuNode>, caption:String):game.IPlayerMenuNode {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == PlayerMenuKind.JiCe && n.caption() == caption)
        return n;
      var inner = findJiCeNodeByCaption(n.children(), caption);
      if (inner != null)
        return inner;
    }
    throw "StrategyTileTargetOwnershipRestrictionTest: missing JiCe caption=" + caption;
  }

  static function findJiCeNodeByCaption(nodes:Array<game.IPlayerMenuNode>, caption:String):Null<game.IPlayerMenuNode> {
    for (n in nodes) {
      var L = n.leaf();
      if (L != null && L.kind() == PlayerMenuKind.JiCe && n.caption() == caption)
        return n;
      var inner = findJiCeNodeByCaption(n.children(), caption);
      if (inner != null)
        return inner;
    }
    return null;
  }
}

