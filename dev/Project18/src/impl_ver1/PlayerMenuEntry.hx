package impl_ver1;

import game.IPlayerMenuEntry;
import game.PlayerMenuKind;

class PlayerMenuEntry implements IPlayerMenuEntry {
  var _kind:PlayerMenuKind;
  var _caption:String;
  var _enabled:Bool;
  var _decisionToken:Null<String>;
  var _formNumericFields:Null<Map<String, Int>>;
  var _formStringListFields:Null<Map<String, Array<String>>>;

  public function new(kind:PlayerMenuKind, caption:String, enabled:Bool, ?decisionToken:String) {
    _kind = kind;
    _caption = caption;
    _enabled = enabled;
    _decisionToken = decisionToken;
    _formNumericFields = null;
    _formStringListFields = null;
  }

  public function kind():PlayerMenuKind
    return _kind;

  public function caption():String
    return _caption;

  public function isEnabled():Bool
    return _enabled;

  public function decisionToken():Null<String>
    return _decisionToken;

  public function formNumericFields():Null<Map<String, Int>>
    return _formNumericFields;

  public function formStringListFields():Null<Map<String, Array<String>>>
    return _formStringListFields;

  public function setFormNumericFields(value:Null<Map<String, Int>>):Void {
    _formNumericFields = value;
  }

  public function setFormStringListFields(value:Null<Map<String, Array<String>>>):Void {
    _formStringListFields = value;
  }
}
