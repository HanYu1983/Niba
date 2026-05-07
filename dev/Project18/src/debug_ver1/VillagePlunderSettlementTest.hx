package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.VillagePlunder;
import game.PlayerMenuKind.StagingSubmit;
import game.LevelKeys;
import game.TileKind;
import game.MenuFormWidget;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;

/**
 * 對齊 GDD 2.1.3：搶奪 → 友好度顯著下降；成功時獲得大量資源；失敗至少也會惡化關係。
 * 注意：搶奪有成功率（非 100%），因此此測試接受成功/失敗兩種分支，但都要符合「友好度下降、體力消耗」。
 */
class VillagePlunderSettlementTest {
  public static function testVillagePlunderSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Village),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    // 高武力提高成功率，但不保證
    match.createGeneral("g-a", idA, 10, 100, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");
    var ruler = cast(match.activeMonarch(), Monarch);
    var gen = cast(ruler.roster()[0], General);
    gen.setStamina(100);

    var g0 = ruler.gold();
    var gr0 = ruler.grain();
    var t0 = ruler.troops();

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
    if (match.forceGetPendingVillageTile() != 1)
      throw "VillagePlunderSettlementTest: expected pendingVillage=1";

    var f0 = match.forceGetVillageFriendly(1, idA);
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), VillagePlunder));
    var stg = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), StagingSubmit);

    // 選 g-a（保險）
    var ws = stg.formWidgets();
    for (i in 0...ws.length)
      switch ws[i] {
        case GeneralMultiPick(lbl, choices, _):
          ws[i] = GeneralMultiPick(lbl, choices, ["g-a"]);
        default:
      }
    var btn = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (btn == null)
      throw "VillagePlunderSettlementTest: missing submit button";
    stg.setActivationEntry(btn);
    match.applyMenuLeaf(actor, stg);

    var f1 = match.forceGetVillageFriendly(1, idA);
    if (f1 > f0 - 10)
      throw 'VillagePlunderSettlementTest: expected friendly drop >=10, f0=${f0} f1=${f1}';
    if (gen.stamina() >= 100)
      throw "VillagePlunderSettlementTest: expected stamina decreased";

    var gained = (ruler.gold() != g0) || (ruler.grain() != gr0) || (ruler.troops() != t0);
    // 成功才會有資源，但失敗也允許不變
    trace('[VillagePlunderSettlementTest] OK — friendly down; gainedAny=${gained}');
  }
}

