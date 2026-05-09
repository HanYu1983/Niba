package debug_ver1;

import game.GameIds;
import game.IGame;
import game.IGameMatch;
import game.IPlayer;
import game.LevelKeys;
import game.MenuNodeQuery;
import game.PlayerMenuKind;
import game.TileKind;
import impl_ver1.model.Monarch;

/**
 * 對齊測試：GDD 2.1.9 四種負面事件腳本皆可走「規避→倍率→事件結算」。
 */
class NegativeTileEventsAlignmentTest {
  public static function testNegativeTileEventsAlignment(game:IGame):Void {
    runOne(game, "evt_epidemic", function(m) return new EpidemicAvoidableTileEvent(m));
    runOne(game, "evt_assassination", function(m) return new AssassinationAvoidableTileEvent(m));
    runOne(game, "evt_granary_fire", function(m) return new GranaryFireAvoidableTileEvent(m, 100));
    runOne(game, "evt_defection", function(m) return new DefectionAvoidableTileEvent(m));
    trace("[NegativeTileEventsAlignmentTest] OK — 4 negative events runnable with avoidance");
  }

  static function runOne(game:IGame, key:String, mk:IGameMatch->game.ITileEvent):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.EMPTY);
    match.forceSetFixedMoveDelta(1);
    match.createBoard([
      match.createTile(0, Plain),
      match.createTile(1, Event),
      match.createTile(2, Plain),
    ]);
    var idA:MonarchId = "m-a";
    match.createMonarch(idA, 0, 0, 0, 0);
    match.createPlayer(idA, idA, false);
    match.createGeneral("g-a", idA, 10, 10, 10, 10);
    match.createGeneral("g-b", idA, 10, 10, 10, 10);
    var actor:IPlayer = match.playerForMonarch(idA);
    match.forceBindTileEvent(1, mk(match));

    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.Move));
    match.applyMenuLeaf(actor, MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.LandingContinue));

    // 規避嘗試（可能成功/失敗都可）
    var avoidNode = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.TileEventAvoidAttempt);
    var avoidEntry = MenuNodeQuery.buttonEntryOnNode(avoidNode, PlayerMenuKind.TileEventAvoidAttempt);
    if (avoidEntry == null)
      throw 'NegativeTileEventsAlignmentTest($key): missing avoid attempt entry';
    avoidNode.setActivationEntry(avoidEntry);
    match.applyMenuLeaf(actor, avoidNode);

    // 進入事件本體，選第一個 TileEventPick
    var pickNode = MenuNodeQuery.requireNodeWithKind(match.createPlayerMenu(actor), PlayerMenuKind.TileEventPick);
    // 若是表單內 Button，需 activationEntry
    var pickEntry = MenuNodeQuery.buttonEntryOnNode(pickNode, PlayerMenuKind.TileEventPick);
    if (pickEntry != null)
      pickNode.setActivationEntry(pickEntry);
    match.applyMenuLeaf(actor, pickNode);
  }
}

