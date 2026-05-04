package impl_ver1;

import game.IPlayerMenuEntry;
import game.PlayerMenuKind;

class PlayerMenuEntry implements IPlayerMenuEntry {
  var _kind:PlayerMenuKind;
  var _caption:String;
  var _enabled:Bool;
  var _decisionToken:Null<String>;

  public function new(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String) {
    _kind = kind;
    _caption = caption;
    _enabled = enabled;
    _decisionToken = decisionToken;
  }

  public function kind():PlayerMenuKind
    return _kind;

  public function caption():String
    return _caption;

  public function isEnabled():Bool
    return _enabled;

  public function decisionToken():Null<String>
    return _decisionToken;
}
