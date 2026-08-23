package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.LevelKeys;
import impl_ver1.model.Monarch;

/**
 * 起點（TileKind.Start）測試：起點不再綁死 index=0；只要踩到 Start 就應給獎勵。
 */
class StartTileRewardTest {
  public static function testStartTileReward(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    // 把 Start 放在 index=1
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Start),
      match.createTile(2, Plain),
    ]);

    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.linkPlayerToMonarch(idA, match.createPlayer(idA, false));
    var actor:IPlayer = match.playerForMonarch(idA);
    var ruler = cast(match.activeMonarch(), Monarch);
    var g0 = ruler.gold();

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    // 不需要 LandingContinue；起點獎勵是移動過程即結算（onPassStartTile）
    if (ruler.pawnIndex() != 1)
      throw "StartTileRewardTest: expected land at 1";
    if (ruler.gold() <= g0)
      throw "StartTileRewardTest: expected gold increased on Start tile";

    trace("[StartTileRewardTest] OK — Start tile triggers pass reward");
  }
}

