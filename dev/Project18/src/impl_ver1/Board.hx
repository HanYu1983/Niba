package impl_ver1;

import game.GameIds;
import game.IBoard;
import game.ITile;

class Board implements IBoard {
  var _tiles:Array<ITile>;

  public function new(tiles:Array<ITile>) {
    _tiles = tiles;
  }

  public function length():Int
    return _tiles.length;

  public function tileAt(index:TileIndex):ITile {
    if (index < 0 || index >= _tiles.length)
      throw 'Board.tileAt: index out of bounds ($index / ${_tiles.length})';
    return _tiles[index];
  }
}
