package impl_ver1;

import game.GameIds;
import game.GeneralStat;
import game.IGeneral;
import game.IEquipment;
import game.PositionRank;
import game.Rarity;

class General implements IGeneral {
  var _id:GeneralId;
  var _owner:MonarchId;
  var _command:Int;
  var _might:Int;
  var _wit:Int;
  var _stewardship:Int;
  var _stamina:Int;
  var _loyalty:Int;
  var _merit:Int;
  var _rarity:Rarity;
  var _rank:PositionRank;
  var _equipments:Array<IEquipment>;

  public function new(id:GeneralId, owner:MonarchId, command:Int, might:Int, wit:Int, stewardship:Int) {
    _id = id;
    _owner = owner;
    _command = command;
    _might = might;
    _wit = wit;
    _stewardship = stewardship;
    _stamina = 100;
    _loyalty = 100;
    _merit = 0;
    _rarity = Common;
    _rank = Soldier;
    _equipments = [];
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

  /** 規剘／測試用：直接寫入體力（不暴露於 IGeneral 介面，以免介面過重）。 */
  public function forceSetStamina(value:Int):Void
    _stamina = value;

  public function loyalty():Int
    return _loyalty;

  public function merit():Int
    return _merit;

  public function rarity():Rarity
    return _rarity;

  public function positionRank():PositionRank
    return _rank;

  public function equipments():Array<IEquipment>
    return _equipments;
}
