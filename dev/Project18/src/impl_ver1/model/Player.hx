package impl_ver1.model;

import game.GameIds;
import game.IPlayer;

/**
 * 可先無君主席位建立（monarchId 為空字串），再由 GameMatchCore.linkPlayerToMonarch 綁定；
 * 接手時可換綁另一 IPlayer，舊操作者會被解除綁定。
 */
@:allow(impl_ver1.core.GameMatchCore)
class Player implements IPlayer {
  var _monarchId:MonarchId;
  var _displayName:String;
  var _isAi:Bool;

  /** 尚未 bindSeat 時 monarchId() 為 ""。 */
  public function new(displayName:String, isAi:Bool = false) {
    _monarchId = "";
    _displayName = displayName;
    _isAi = isAi;
  }

  function bindSeat(mid:MonarchId):Void {
    _monarchId = mid;
  }

  function clearSeatBinding():Void {
    _monarchId = "";
  }

  public function monarchId():MonarchId
    return _monarchId;

  public function displayName():String
    return _displayName;

  public function isAi():Bool
    return _isAi;
}
