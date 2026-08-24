package impl_ver1.model;

import game.GameIds;
import game.ITile;
import game.TileKind;

class Tile implements ITile {
  var _index:TileIndex;
  var _kind:TileKind;

  public function new(index:TileIndex, kind:TileKind) {
    _index = index;
    _kind = kind;
  }

  public function index():TileIndex
    return _index;

  public function kind():TileKind
    return _kind;
}
