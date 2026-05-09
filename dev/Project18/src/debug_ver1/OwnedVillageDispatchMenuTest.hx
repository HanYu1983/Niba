package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.ITile;
import game.MenuFormWidget;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.LandingContinue;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.model.Monarch;

/**
 * 踩中我方村落（已歸順/領地化）：應出現「調度」表單（3 Slider + Button）與「結束拜訪」，可持續直到 VisitEnd。
 */
class OwnedVillageDispatchMenuTest {
  static inline var RING_LEN = 6;
  static inline var START_PAWN = 1;
  static inline var V_IDX = 4;

  public static function testOwnedVillagePersistentMenuUntilVisitEnd(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(3); // 1 -> 4

    var tiles:Array<ITile> = [];
    for (i in 0...RING_LEN)
      tiles.push(match.createTile(i, i == V_IDX ? Village : Plain));
    match.createBoard(tiles);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, START_PAWN, 80, 40);
    match.createPlayer(idA, idA, false);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);
    var ruler = cast(match.monarchs()[0], Monarch);
    ruler.grantGold(100);

    match.forceSetVillageOwner(V_IDX, idA);
    match.forcePutVillageStores(V_IDX, 25, 15, 12);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));

    if (match.forceGetPendingVillageTile() != V_IDX)
      throw "OwnedVillageDispatchMenuTest: expected pendingVillage=4";

    var menu1 = match.createPlayerMenu(actor);
    assertVisitMenuShape(menu1, 80, 40, ruler.gold(), 25, 15, 12);

    var dNode = MenuNodeQuery.requireNodeWithKind(menu1, VillageDispatchApply);
    var fw = dNode.formWidgets();
    // set targets: troops=50, grain=15, gold=20
    switch fw[0] {
      case Slider(l0, mn0, mx0, st0, _):
        fw[0] = Slider(l0, mn0, mx0, st0, 50);
      default:
        throw "OwnedVillageDispatchMenuTest: [0] Slider";
    }
    switch fw[1] {
      case Slider(l1, mn1, mx1, st1, _):
        fw[1] = Slider(l1, mn1, mx1, st1, 15);
      default:
        throw "OwnedVillageDispatchMenuTest: [1] Slider";
    }
    switch fw[2] {
      case Slider(l2, mn2, mx2, st2, _):
        fw[2] = Slider(l2, mn2, mx2, st2, 20);
      default:
        throw "OwnedVillageDispatchMenuTest: [2] Slider";
    }
    var btn = MenuNodeQuery.buttonEntryOnNode(dNode, VillageDispatchApply);
    if (btn == null)
      throw "OwnedVillageDispatchMenuTest: missing apply button";
    dNode.setActivationEntry(btn);
    match.applyMenuLeaf(actor, dNode);

    if (match.forceGetPendingVillageTile() != V_IDX)
      throw "OwnedVillageDispatchMenuTest: after dispatch apply should still be pending";
    if (ruler.troops() != 55)
      throw "OwnedVillageDispatchMenuTest: troops should be 80-(50-25)=55";
    if (ruler.gold() != 92)
      throw "OwnedVillageDispatchMenuTest: gold should be 100-(20-12)=92";
    if (match.forceGetVillageStoredTroops(V_IDX) != 50 || match.forceGetVillageStoredGrain(V_IDX) != 15 || match.forceGetVillageStoredGold(V_IDX) != 20)
      throw "OwnedVillageDispatchMenuTest: village stores mismatch";

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), VillageVisitEnd));
    if (match.forceGetPendingVillageTile() != null)
      throw "OwnedVillageDispatchMenuTest: visit end should clear pendingVillage";
    MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), ConfirmDone);
  }

  static function assertVisitMenuShape(menu:IPlayerMenu, expMaxTroop:Int, expMaxGrain:Int, expMaxGold:Int, expDefTroop:Int, expDefGrain:Int, expDefGold:Int):Void {
    var roots = menu.rootNodes();
    if (roots.length < 2)
      throw "OwnedVillageDispatchMenuTest: expected at least dispatch + visit end";
    var dispatchNode = roots[0];
    if (dispatchNode.caption() != "調度")
      throw "OwnedVillageDispatchMenuTest: first root should be dispatch";
    var fw = dispatchNode.formWidgets();
    if (fw.length != 4)
      throw "OwnedVillageDispatchMenuTest: expected 3 sliders + button";
    switch fw[0] {
      case Slider(_, min, max, step, def):
        if (min != 0 || max != expMaxTroop || step != 1 || def != expDefTroop)
          throw "OwnedVillageDispatchMenuTest: troop slider mismatch";
      default:
        throw "OwnedVillageDispatchMenuTest: [0] slider";
    }
    switch fw[1] {
      case Slider(_, min, max, step, def):
        if (min != 0 || max != expMaxGrain || step != 1 || def != expDefGrain)
          throw "OwnedVillageDispatchMenuTest: grain slider mismatch";
      default:
        throw "OwnedVillageDispatchMenuTest: [1] slider";
    }
    switch fw[2] {
      case Slider(_, min, max, step, def):
        if (min != 0 || max != expMaxGold || step != 1 || def != expDefGold)
          throw "OwnedVillageDispatchMenuTest: gold slider mismatch";
      default:
        throw "OwnedVillageDispatchMenuTest: [2] slider";
    }
    switch fw[3] {
      case Button(e):
        if (e.kind() != VillageDispatchApply)
          throw "OwnedVillageDispatchMenuTest: expected apply leaf";
      default:
        throw "OwnedVillageDispatchMenuTest: [3] button";
    }
  }
}

