package impl_ver1.model;

import game.IPlayerMenuEntry;
import game.GameIds;
import game.MenuClientConfirm;
import game.PlayerMenuKind;

class PlayerMenuEntry implements IPlayerMenuEntry {
  var _kind:PlayerMenuKind;
  var _caption:String;
  var _enabled:Bool;
  var _responsible:Null<MonarchId>;
  var _decisionToken:Null<String>;
  var _clientConfirm:Null<MenuClientConfirm>;

  public function new(
    kind:PlayerMenuKind,
    caption:String,
    enabled:Bool,
    ?responsibleMonarchId:MonarchId,
    ?decisionToken:String,
    ?clientConfirm:MenuClientConfirm
  ) {
    _kind = kind;
    _caption = caption;
    _enabled = enabled;
    _responsible = responsibleMonarchId;
    _decisionToken = decisionToken;
    _clientConfirm = clientConfirm;
  }

  public function kind():PlayerMenuKind
    return _kind;

  public function caption():String
    return _caption;

  public function isEnabled():Bool
    return _enabled;

  public function responsibleMonarchId():Null<MonarchId>
    return _responsible;

  public function decisionToken():Null<String>
    return _decisionToken;

  public function clientConfirm():Null<MenuClientConfirm>
    return _clientConfirm;
}
