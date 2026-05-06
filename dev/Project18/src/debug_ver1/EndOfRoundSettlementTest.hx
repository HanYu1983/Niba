package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind.ConfirmDone;
import game.PlayerMenuKind.Move;
import game.PlayerMenuKind.LandingContinue;
import game.TileKind;
import game.LevelKeys;
import impl_ver1.model.General;
import impl_ver1.model.Monarch;

/**
 * 骨架測試：回合結算點
 * - 起點獎勵：移動經過 Start 時 gold 增加
 * - 回合末體力回復：每回合（輪回 seat=0）全體 +15
 */
class EndOfRoundSettlementTest {
  public static function testEndOfRoundSettlement(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(2);

    // 4 格環：把 pawn 放在 3，走 2 步會經過 Start（此測試放在 index=0）
    match.createBoard([
      match.createTile(0, Start),
      match.createTile(1, Plain),
      match.createTile(2, Plain),
      match.createTile(3, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 3, 0, 0);
    match.createGeneral("g-a", idA, 1, 1, 1, 1);
    var actor:IPlayer = match.createPlayer(idA, "A");

    var mon = cast(match.activeMonarch(), Monarch);
    // 壓低聲望到 0，確保走「低聲望」分支（固定 +50 gold）
    mon.reducePrestige(100);
    var gen = cast(mon.roster()[0], General);
    gen.setStamina(10);

    // Move：經過起點，應拿到 gold
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), Move));
    if (mon.gold() != 50)
      throw "EndOfRoundSettlementTest: 預期經過起點 gold +50，got " + mon.gold();

    // 落地讓切片完成
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), LandingContinue));
    // ConfirmDone：單人局輪回 seat=0，觸發回合末體力回復 +15
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), ConfirmDone));
    if (gen.stamina() != 25)
      throw "EndOfRoundSettlementTest: 預期回合末體力 +15 => 25，got " + gen.stamina();

    trace("[EndOfRoundSettlementTest] OK — 起點獎勵 + 回合末體力回復");
  }
}

