package debug;

import game.ITile;
import game.TileKind;

/**
 * IBoard 煙霧測試：建立 20 格並驗證 length / tileAt / index 一致。
 */
class BoardUnitTest {
  public static function run():Void {
    var tiles = new Array<ITile>();
    for (i in 0...20) {
      var kind:TileKind = switch (i % 4) {
        case 0: Plain;
        case 1: City;
        case 2: Battle;
        default: Scheme;
      };
      tiles.push(new SimpleTile(i, kind));
    }

    var board = new SimpleBoard(tiles);

    if (board.length() != 20)
      throw 'BoardUnitTest: expected board.length()==20, got ${board.length()}';

    for (i in 0...20) {
      var t = board.tileAt(i);
      if (t.index() != i)
        throw 'BoardUnitTest: tile.index() mismatch at slot $i (got ${t.index()})';
    }

    trace("[BoardUnitTest] OK — 20 tiles, indices 0..19");
  }
}
