package impl_ver1.model;

import game.GameIds;
import game.IPlayer;

class Player implements IPlayer {
  var _monarchId:MonarchId;
  var _displayName:String;
  var _isAi:Bool;

  public function new(monarchId:MonarchId, displayName:String, isAi:Bool = false) {
    _monarchId = monarchId;
    _displayName = displayName;
    _isAi = isAi;
  }

  public function monarchId():MonarchId
    return _monarchId;

  public function displayName():String
    return _displayName;

  public function isAi():Bool
    return _isAi;
}
