package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.PlayerMenuKind.VillageTrade;
import game.PlayerMenuKind.StagingSubmit;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.model.Monarch;

/**
 * 骨架測試：村落友好度（每村落×每玩家）+ 交易真結算線。
 * - Move 固定落在 Village
 * - 交易提交後：gold 減少、grain 增加、友好度 +10
 */
class VillageFriendlyTradeSettlementTest {
  public static function testVillageFriendlyTradeSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(3);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Plain),
      match.createTile(2, Plain),
      match.createTile(3, Village),
      match.createTile(4, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    // 政治拉滿，確保交易成功率=100%（避免 deterministic roll 造成測試不穩）
    match.createGeneral("g-a", idA, 10, 10, 10, 100);
    var actor:IPlayer = match.createPlayer(idA, "A");

    // 給足金錢
    var ruler = cast(match.activeMonarch(), Monarch);
    ruler.grantGold(100);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
    var vIdx = match.forceGetPendingVillageTile();
    if (vIdx != 3)
      throw "VillageFriendlyTradeSettlementTest: expected pendingVillage=3";

    var beforeGold = ruler.gold();
    var beforeGrain = ruler.grain();
    var beforeF = match.forceGetVillageFriendly(3, idA);

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), VillageTrade));
    var stg = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), StagingSubmit);
    var btn = MenuNodeQuery.buttonEntryOnNode(stg, StagingSubmit);
    if (btn == null)
      throw "VillageFriendlyTradeSettlementTest: missing submit button";
    stg.setActivationEntry(btn);
    match.applyMenuLeaf(actor, stg);

    if (ruler.gold() != beforeGold - 20)
      throw "VillageFriendlyTradeSettlementTest: gold should -20";
    if (ruler.grain() != beforeGrain + 50)
      throw "VillageFriendlyTradeSettlementTest: grain should +50";
    var afterF = match.forceGetVillageFriendly(3, idA);
    if (afterF <= beforeF)
      throw "VillageFriendlyTradeSettlementTest: friendly should increase";

    trace("[VillageFriendlyTradeSettlementTest] OK — village friendly + trade settlement");
  }
}

