package impl_ver1.model;

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
  var _gold:Int;
  var _prestige:Int;

  public function new(id:MonarchId, seat:Int, pawnIndex:TileIndex, troops:Int = 0, grain:Int = 0) {
    _id = id;
    _seat = seat;
    _pawn = pawnIndex;
    _roster = [];
    _troops = troops;
    _grain = grain;
    _gold = 0;
    _prestige = 100;
  }

  /** 由 {@link GameMatchCore#createGeneral} 將武將加入麾下；不重複檢查 id（規剘層可自行約束）。 */
  public function addGeneral(g:General):Void {
    _roster.push(g);
  }

  /** 規剘：移除麾下一名武將（用於叛逃等事件）。回傳是否成功移除。 */
  public function removeGeneralById(gid:GeneralId):Bool {
    for (i in 0..._roster.length) {
      var g = _roster[i];
      if (g != null && g.id() == gid) {
        _roster.splice(i, 1);
        return true;
      }
    }
    return false;
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

  public function grantGold(n:Int):Void {
    if (n < 0)
      throw "Monarch.grantGold: negative";
    _gold += n;
  }

  public function grantPrestige(n:Int):Void {
    if (n < 0)
      throw "Monarch.grantPrestige: negative";
    _prestige += n;
    if (_prestige > 100)
      _prestige = 100;
  }

  public function reducePrestige(loss:Int):Void {
    if (loss < 0)
      throw "Monarch.reducePrestige: loss negative";
    _prestige -= loss;
    if (_prestige < 0)
      _prestige = 0;
  }

  public function reduceTroops(loss:Int):Void {
    if (loss < 0)
      throw "Monarch.reduceTroops: loss negative";
    _troops -= loss;
    if (_troops < 0)
      _troops = 0;
  }

  public function reduceGrain(loss:Int):Void {
    if (loss < 0)
      throw "Monarch.reduceGrain: loss negative";
    _grain -= loss;
    if (_grain < 0)
      _grain = 0;
  }

  public function reduceGold(loss:Int):Void {
    if (loss < 0)
      throw "Monarch.reduceGold: loss negative";
    _gold -= loss;
    if (_gold < 0)
      _gold = 0;
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

  public function gold():Int
    return _gold;

  public function prestige():Int
    return _prestige;
}

