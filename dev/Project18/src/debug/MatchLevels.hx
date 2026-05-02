package debug;

import game.GameIds;
import game.IBoard;
import game.IGeneral;
import game.IMonarch;
import game.ITile;
import game.TileKind;

typedef MatchBootstrap = {
  board:IBoard,
  monarchs:Array<IMonarch>,
  activeMonarchId:MonarchId,
  ?postInit:SimpleGameMatch->Void,
};

/**
 * SimpleGame／SimpleGameMatch 專用之 level_key→初始賽局（測試與煙霧場景）。
 */
class MatchLevels {
  public static inline var KEY_NESTED_MOVE_PLAIN_RING20 = "nested/move_plain_ring20";
  public static inline var KEY_MENU_LOOP_PLAIN_RING2 = "menu/loop_plain_ring2";
  public static inline var KEY_TILE_EVENT_RING10_EVT3 = "tile/event_ring10_evt3";
  public static inline var KEY_JICE_LUOSHI_BASIC = "jice/luoshi_basic";
  public static inline var KEY_JICE_LUOSHI_CEILING = "jice/luoshi_ceiling";
  public static inline var KEY_JICE_STAGING_THREE_GENERALS = "jice/staging_three_generals";
  public static inline var KEY_SLICE_MINIMAL_SOLO_RING2 = "slice/minimal_solo_ring2";
  public static inline var KEY_SLICE_JICE_TWO_MONARCHS_PLAIN = "slice/jice_two_monarchs_plain";

  public static function bootstrap(game:SimpleGame, key:String):MatchBootstrap {
    return switch key {
      case KEY_NESTED_MOVE_PLAIN_RING20:
        nestedMovePlainRing20(game);
      case KEY_MENU_LOOP_PLAIN_RING2:
        menuLoopPlainRing2(game);
      case KEY_TILE_EVENT_RING10_EVT3:
        tileEventRing10Evt3(game);
      case KEY_JICE_LUOSHI_BASIC:
        jiceLuoshiBasic(game);
      case KEY_JICE_LUOSHI_CEILING:
        jiceLuoshiCeiling(game);
      case KEY_JICE_STAGING_THREE_GENERALS:
        jiceStagingThreeGenerals(game);
      case KEY_SLICE_MINIMAL_SOLO_RING2:
        sliceMinimalSoloRing2(game);
      case KEY_SLICE_JICE_TWO_MONARCHS_PLAIN:
        sliceJiceTwoMonarchsPlain(game);
      default:
        throw 'MatchLevels: unknown level_key "$key"';
    };
  }

  static function nestedMovePlainRing20(game:SimpleGame):MatchBootstrap {
    var tiles = new Array<ITile>();
    for (i in 0...20)
      tiles.push(game.createTile(i, Plain));
    var board = game.createBoard(tiles);
    var monarch = game.createMonarch("m-test", 0, 0, []);
    return {board: board, monarchs: [monarch], activeMonarchId: monarch.id()};
  }

  static function menuLoopPlainRing2(game:SimpleGame):MatchBootstrap {
    var tiles = new Array<ITile>();
    for (i in 0...2)
      tiles.push(game.createTile(i, Plain));
    var board = game.createBoard(tiles);
    var monarch = game.createMonarch("m-loop", 0, 0, []);
    return {board: board, monarchs: [monarch], activeMonarchId: monarch.id()};
  }

  static function tileEventRing10Evt3(game:SimpleGame):MatchBootstrap {
    var ringLen = 10;
    var evtAt = 3;
    var tiles = new Array<ITile>();
    for (i in 0...ringLen)
      tiles.push(game.createTile(i, i == evtAt ? Event : Plain));
    var board = game.createBoard(tiles);
    var roster:Array<IGeneral> = [];
    var monarch:IMonarch = new SimpleMonarch("m-evt", 0, 0, roster, 100, 50);
    return {
      board: board,
      monarchs: [monarch],
      activeMonarchId: monarch.id(),
      postInit: function(m:SimpleGameMatch) {
        var fork = new SimpleLootForkTileEvent(m);
        m.debugForkLoot = fork;
        m.bindTileEvent(evtAt, fork);
      },
    };
  }

  static function jiceLuoshiBasic(game:SimpleGame):MatchBootstrap {
    var gHigh = game.createGeneral("g-might-high", "m-atk", 1, 50, 1, 1);
    var gLow = game.createGeneral("g-might-low", "m-atk", 1, 20, 1, 1);
    var rosterA:Array<IGeneral> = [gHigh, gLow];
    var rosterB:Array<IGeneral> = [];
    var attacker:IMonarch = new SimpleMonarch("m-atk", 0, 0, rosterA, 500, 80);
    var defender:IMonarch = new SimpleMonarch("m-def", 1, 0, rosterB, 100, 200);
    var tiles:Array<ITile> = [game.createTile(0, Plain)];
    var board = game.createBoard(tiles);
    return {board: board, monarchs: [attacker, defender], activeMonarchId: attacker.id()};
  }

  static function jiceLuoshiCeiling(game:SimpleGame):MatchBootstrap {
    var gen = game.createGeneral("g-ceil", "atk-ceiling", 1, 5, 1, 1);
    var rosterAtk:Array<IGeneral> = [gen];
    var rosterDef:Array<IGeneral> = [];
    var atk:IMonarch = new SimpleMonarch("atk-ceiling", 0, 0, rosterAtk, 1, 0);
    var d:IMonarch = new SimpleMonarch("m-33", 1, 0, rosterDef, 33, 0);
    var tiles:Array<ITile> = [game.createTile(0, Plain)];
    var board = game.createBoard(tiles);
    return {board: board, monarchs: [atk, d], activeMonarchId: atk.id()};
  }

  static function jiceStagingThreeGenerals(game:SimpleGame):MatchBootstrap {
    var ga = game.createGeneral("wa", "atk", 1, 40, 1, 1);
    var gb = game.createGeneral("wb", "atk", 1, 10, 1, 1);
    var gc = game.createGeneral("wc", "atk", 1, 25, 1, 1);
    var rosterAtk:Array<IGeneral> = [ga, gb, gc];
    var rosterDef:Array<IGeneral> = [];
    var atk:IMonarch = new SimpleMonarch("atk", 0, 0, rosterAtk, 200, 0);
    var def:IMonarch = new SimpleMonarch("def", 1, 0, rosterDef, 80, 10);
    var tiles:Array<ITile> = [game.createTile(0, Plain)];
    var board = game.createBoard(tiles);
    return {board: board, monarchs: [atk, def], activeMonarchId: atk.id()};
  }

  static function sliceMinimalSoloRing2(game:SimpleGame):MatchBootstrap {
    var roster:Array<IGeneral> = [];
    var monarch = game.createMonarch("m-a", 0, 0, roster);
    var tiles:Array<ITile> = [game.createTile(0, Plain), game.createTile(1, Plain)];
    var board = game.createBoard(tiles);
    return {board: board, monarchs: [monarch], activeMonarchId: monarch.id()};
  }

  static function sliceJiceTwoMonarchsPlain(game:SimpleGame):MatchBootstrap {
    var rosterA:Array<IGeneral> = [game.createGeneral("g-ts", "m-a", 1, 15, 1, 1)];
    var atk:IMonarch = new SimpleMonarch("m-a", 0, 0, rosterA, 10, 0);
    var def:IMonarch = new SimpleMonarch("m-b", 1, 0, ([] : Array<IGeneral>), 50, 0);
    var tiles:Array<ITile> = [game.createTile(0, Plain)];
    var board = game.createBoard(tiles);
    return {board: board, monarchs: [atk, def], activeMonarchId: atk.id()};
  }
}
