package debug;

import game.GameIds;
import game.ITile;
import game.TileKind;

/**
 * 測試／偵錯用：無行為之 ITile 實作。
 */
class SimpleTile implements ITile {
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
