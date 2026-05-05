package impl_ver1;

import game.GameIds;
import game.GeneralStat;
import game.IGeneral;

class General implements IGeneral {
  var _id:GeneralId;
  var _owner:MonarchId;
  var _command:Int;
  var _might:Int;
  var _wit:Int;
  var _stewardship:Int;
  var _stamina:Int;

  public function new(id:GeneralId, owner:MonarchId, command:Int, might:Int, wit:Int, stewardship:Int) {
    _id = id;
    _owner = owner;
    _command = command;
    _might = might;
    _wit = wit;
    _stewardship = stewardship;
    _stamina = 100;
  }

  public function id():GeneralId
    return _id;

  public function owner():MonarchId
    return _owner;

  public function stat(which:GeneralStat):Int {
    return switch which {
      case Command: _command;
      case Might: _might;
      case Wit: _wit;
      case Stewardship: _stewardship;
    };
  }

  public function stamina():Int
    return _stamina;

  public function setStamina(value:Int):Void
    _stamina = value;
}
