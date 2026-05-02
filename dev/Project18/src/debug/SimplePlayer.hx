package debug;

import game.GameIds;
import game.IPlayer;

class SimplePlayer implements IPlayer {
  var _monarchId:MonarchId;
  var _displayName:String;

  public function new(monarchId:MonarchId, displayName:String) {
    _monarchId = monarchId;
    _displayName = displayName;
  }

  public function monarchId():MonarchId
    return _monarchId;

  public function displayName():String
    return _displayName;
}
