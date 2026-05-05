package impl_ver1.model;

import game.GameIds;
import game.GeneralEffect;
import game.GeneralStat;
import game.GeneralStatus;
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
  var _effects:Array<GeneralEffect>;
  var _statuses:Array<GeneralStatus>;

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
    _effects = [];
    _statuses = [];
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

  /** 規剘：直接寫入體力（具象類方法；介面不暴露 setter）。 */
  public function setStamina(value:Int):Void
    _stamina = value;

  public function effects():Array<GeneralEffect>
    return _effects;

  public function addEffect(e:GeneralEffect):Void
    _effects.push(e);

  public function statuses():Array<GeneralStatus>
    return _statuses;

  public function addStatus(s:GeneralStatus):Void
    _statuses.push(s);

  /** 回傳是否成功移除一個 debuff。 */
  public function removeOneDebuff():Bool {
    for (i in 0..._statuses.length)
      switch _statuses[i] {
        case Debuff(_):
          _statuses.splice(i, 1);
          return true;
      }
    return false;
  }

  public function loyalty():Int
    return _loyalty;

  /** 規剘：直接寫入忠誠度（具象類方法；介面不暴露 setter）。 */
  public function setLoyalty(value:Int):Void {
    _loyalty = value;
    if (_loyalty < 1)
      _loyalty = 1;
    if (_loyalty > 100)
      _loyalty = 100;
  }

  public function merit():Int
    return _merit;

  public function rarity():Rarity
    return _rarity;

  public function positionRank():PositionRank
    return _rank;

  public function equipments():Array<IEquipment>
    return _equipments;
}
