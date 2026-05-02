package debug;

import game.GameIds;
import game.IBoard;
import game.ITile;

/**
 * 測試／偵錯用：以固定陣列承載環狀棋盤；索引越界直接丟錯。
 */
class SimpleBoard implements IBoard {
  var _tiles:Array<ITile>;

  public function new(tiles:Array<ITile>) {
    _tiles = tiles;
  }

  public function length():Int
    return _tiles.length;

  public function tileAt(index:TileIndex):ITile {
    if (index < 0 || index >= _tiles.length)
      throw 'SimpleBoard.tileAt: index out of bounds ($index / ${_tiles.length})';
    return _tiles[index];
  }
}
