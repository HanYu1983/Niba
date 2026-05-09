package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.VillageConquer;
import game.PlayerMenuKind.StagingSubmit;
import game.LevelKeys;
import game.TileKind;
import game.MenuFormWidget;
import impl_ver1.model.Monarch;

/**
 * 對齊 GDD 2.1.3：攻占成功 → 村落成為領地（owner 設定）+ 友好度重置 50。
 */
class VillageConquerSettlementTest {
  public static function testVillageConquerSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Village),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 2000, 0);
    match.createPlayer(idA, idA, false);
    // 高武力/統率確保勝利
    match.createGeneral("g-a", idA, 100, 100, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);
    var ruler = cast(match.activeMonarch(), Monarch);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
    if (match.forceGetPendingVillageTile() != 1)
      throw "VillageConquerSettlementTest: expected pendingVillage=1";

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), VillageConquer));
    var stg = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), StagingSubmit);

    // 把 slider 設成 1000 兵；並確保選到 g-a（預設已選第一名，這裡僅保險）
    var ws = stg.formWidgets();
    for (i in 0...ws.length) {
      switch ws[i] {
        case Slider(lbl, min, max, step, _):
          ws[i] = Slider(lbl, min, max, step, 1000);
        case GeneralMultiPick(lbl, choices, _):
          ws[i] = GeneralMultiPick(lbl, choices, ["g-a"]);
        default:
      }
    }
    var btn = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (btn == null)
      throw "VillageConquerSettlementTest: missing submit button";
    stg.setActivationEntry(btn);
    match.applyMenuLeaf(actor, stg);

    if (match.forceGetVillageOwner(1) != idA)
      throw "VillageConquerSettlementTest: expected village owner set";
    if (match.forceGetVillageFriendly(1, idA) != 50)
      throw "VillageConquerSettlementTest: expected friendly reset to 50";
    trace("[VillageConquerSettlementTest] OK — conquer sets owner and resets friendly");
  }
}

