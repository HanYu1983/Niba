package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.LevelKeys;
import game.TileKind;
import impl_ver1.model.Monarch;

/**
 * 對齊 GDD 2.1.3：糧食不足 → 士兵依不足比例逃亡。
 * - troops=1000 → upkeep=ceil(1000*0.01)=10
 * - grain=7（僅夠 70%）→ 30% troops 逃亡 → loss=300
 */
class GrainShortageTroopDesertionTest {
  public static function testGrainShortageTroopDesertion(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);

    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Plain),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    // troops=1000, grain=7（不足）
    match.createMonarch(idA, 0, 0, 1000, 7);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.createPlayer(idA, "A");
    var mon = cast(match.activeMonarch(), Monarch);

    // 讓切片可結束 → ConfirmDone 觸發回合結算（單人局）
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.ConfirmDone));

    if (mon.grain() != 0)
      throw "GrainShortageTroopDesertionTest: expected grain reduced to 0";
    if (mon.troops() != 700)
      throw "GrainShortageTroopDesertionTest: expected troops 1000 -> 700 (30% flee)";

    trace("[GrainShortageTroopDesertionTest] OK — grain shortage causes proportional troop desertion");
  }
}

