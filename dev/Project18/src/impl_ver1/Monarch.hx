package impl_ver1;

import game.GameIds;
import game.IGeneral;
import game.IMonarch;

class Monarch implements IMonarch {
  var _id:MonarchId;
  var _seat:Int;
  var _pawn:TileIndex;
  var _roster:Array<IGeneral>;
  var _troops:Int;
  var _grain:Int;

  public function new(id:MonarchId, seat:Int, pawnIndex:TileIndex, troops:Int = 0, grain:Int = 0) {
    _id = id;
    _seat = seat;
    _pawn = pawnIndex;
    _roster = [];
    _troops = troops;
    _grain = grain;
  }

  /** 由 {@link GameMatch#createGeneral} 將武將加入麾下；不重複檢查 id（規剘層可自行約束）。 */
  public function addGeneral(g:General):Void {
    _roster.push(g);
  }

  public function grantTroops(n:Int):Void {
    if (n < 0)
      throw "Monarch.grantTroops: negative";
    _troops += n;
  }

  public function grantGrain(n:Int):Void {
    if (n < 0)
      throw "Monarch.grantGrain: negative";
    _grain += n;
  }

  public function reduceTroops(loss:Int):Void {
    if (loss < 0)
      throw "Monarch.reduceTroops: loss negative";
    _troops -= loss;
    if (_troops < 0)
      _troops = 0;
  }

  public function advanceOnBoard(delta:Int, ringLen:Int):Void {
    if (ringLen <= 0)
      throw "Monarch.advanceOnBoard: ringLen must be positive";
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
