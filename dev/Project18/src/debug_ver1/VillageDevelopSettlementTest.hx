package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.VillageDevelop;
import game.PlayerMenuKind.StagingSubmit;
import game.TileKind;
import game.LevelKeys;
import game.CityLevel;
import game.MenuFormWidget;

/**
 * 對齊 2.1.3：村落被占領後可開發升級（最小版）。
 */
class VillageDevelopSettlementTest {
  public static function testVillageDevelopSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Village),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createPlayer(idA, idA, false);
    match.createGeneral("g-a", idA, 10, 10, 10, 100);
    var actor:IPlayer = match.playerForMonarch(idA);

    match.forceSetVillageOwner(1, idA);
    match.forceSetVillageLevel(1, CityLevel.Village);
    match.forcePutVillageStores(1, 0, 80, 80);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
    if (match.forceGetPendingVillageTile() != 1)
      throw "VillageDevelopSettlementTest: expected pendingVillage=1";

    var gold0 = match.forceGetVillageStoredGold(1);
    var grain0 = match.forceGetVillageStoredGrain(1);
    var lvl0 = match.forceGetVillageLevel(1);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), VillageDevelop));
    var stg = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), StagingSubmit);

    // 保險選 g-a
    var ws = stg.formWidgets();
    for (i in 0...ws.length)
      switch ws[i] {
        case GeneralMultiPick(lbl, choices, _):
          ws[i] = GeneralMultiPick(lbl, choices, ["g-a"]);
        default:
      }
    var btn = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (btn == null)
      throw "VillageDevelopSettlementTest: missing submit button";
    stg.setActivationEntry(btn);
    match.applyMenuLeaf(actor, stg);

    if (match.forceGetVillageStoredGold(1) != gold0 - 25)
      throw "VillageDevelopSettlementTest: expected village gold -25";
    if (match.forceGetVillageStoredGrain(1) != grain0 - 25)
      throw "VillageDevelopSettlementTest: expected village grain -25";

    var lvl1 = match.forceGetVillageLevel(1);
    trace('[VillageDevelopSettlementTest] OK — cost consumed; level ${Std.string(lvl0)} -> ${Std.string(lvl1)}');
  }
}

