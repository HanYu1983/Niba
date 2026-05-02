package debug;

import game.GameIds;
import game.IGeneral;
import game.IMonarch;

/**
 * 測試用君主：可於環狀棋盤上推進棋子索引。
 */
class SimpleMonarch implements IMonarch {
  var _id:MonarchId;
  var _seat:Int;
  var _pawn:TileIndex;
  var _roster:Array<IGeneral>;
  var _troops:Int;
  var _grain:Int;

  public function new(id:MonarchId, seat:Int, pawnIndex:TileIndex, roster:Array<IGeneral>, troops:Int = 0, grain:Int = 0) {
    _id = id;
    _seat = seat;
    _pawn = pawnIndex;
    _roster = roster;
    _troops = troops;
    _grain = grain;
  }

  /** 測試／事件獎勵：兵力增加。 */
  public function grantTroops(n:Int):Void {
    if (n < 0)
      throw 'SimpleMonarch.grantTroops: negative';
    _troops += n;
  }

  /** 測試／事件獎勵：糧食增加。 */
  public function grantGrain(n:Int):Void {
    if (n < 0)
      throw 'SimpleMonarch.grantGrain: negative';
    _grain += n;
  }

  /** 規剘結算：兵力扣除（不低於零）。 */
  public function reduceTroops(loss:Int):Void {
    if (loss < 0)
      throw 'SimpleMonarch.reduceTroops: loss negative';
    _troops -= loss;
    if (_troops < 0)
      _troops = 0;
  }

  /** 環狀前進 delta 格（delta 可為負；環長須為正）。 */
  public function advanceOnBoard(delta:Int, ringLen:Int):Void {
    if (ringLen <= 0)
      throw 'SimpleMonarch.advanceOnBoard: ringLen must be positive';
    var x = _pawn + delta;
    x %= ringLen;
    if (x < 0)
      x += ringLen;
    _pawn = x;
  }

  public function id():MonarchId
    return _id;

  public function seat():Int
    return _seat;

  public function pawnIndex():TileIndex
    return _pawn;

  public function roster():Array<IGeneral>
    return _roster;

  public function troops():Int
    return _troops;

  public function grain():Int
    return _grain;
}
