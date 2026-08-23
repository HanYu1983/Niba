package impl_ver1.model;

import game.GameIds;
import game.GeneralEffect;
import game.GeneralStat;
import game.GeneralStatus;
import game.IGeneral;
import game.IEquipment;
import game.PositionRank;
import game.Rarity;
import game.Balance;

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
    var base = switch which {
      case Command: _command;
      case Might: _might;
      case Wit: _wit;
      case Stewardship: _stewardship;
    };
    // docs/數值算法.md §10.3：職位提供全屬性加成
    var rankBonus = switch _rank {
      case Soldier: 0;
      case SquadLeader: 2;
      case SectionLeader: 5;
      case Captain: 8;
      case General: 12;
      case GreatGeneral: 15;
    };
    var bonus = 0;
    if (_equipments != null) {
      for (eq in _equipments)
        if (eq != null && eq.bonusStat() == which)
          bonus += eq.bonusValue();
    }
    var eff = 0;
    if (_effects != null) {
      for (e in _effects)
        switch e {
          case TempStatBoost(stat, amount, turns):
            if (turns != 0 && stat == which)
              eff += amount;
          case PermanentStatDelta(stat, amount):
            if (stat == which)
              eff += amount;
          case NextCommandMultiplier(_):
          case CleanseOneDebuff:
        }
    }
    return base + rankBonus + bonus + eff;
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

  /** docs/數值算法.md §10：功績累積並自動升職。 */
  public function grantMerit(n:Int):Void {
    if (n < 0)
      throw "General.grantMerit: negative";
    _merit += n;
    if (_merit < 0)
      _merit = 0;
    refreshRankByMerit();
  }

  function refreshRankByMerit():Void {
    // §10.2：職位晉升條件
    var next = if (_merit >= 800) GreatGeneral
    else if (_merit >= 500) General
    else if (_merit >= 300) Captain
    else if (_merit >= 150) SectionLeader
    else if (_merit >= 50) SquadLeader
    else Soldier;
    _rank = next;
  }

  public function rarity():Rarity
    return _rarity;

  /** ver1：由生成/招募流程寫入稀有度（不暴露在介面層）。 */
  public function setRarity(r:Rarity):Void
    _rarity = r;

  public function positionRank():PositionRank
    return _rank;

  public function equipments():Array<IEquipment>
    return _equipments;

  /**
   * docs/裝備系統.md：裝備一旦裝上不可拆下。
   * 規剘：裝備時立即增加忠誠度；超過職位上限則拒絕。
   */
  public function addEquipment(eq:IEquipment):Void {
    if (eq == null)
      throw "General.addEquipment: eq is null";
    var limit = Balance.equipmentLimit(_rank);
    if (_equipments.length >= limit)
      throw 'General.addEquipment: over limit (rank=${Std.string(_rank)} limit=$limit)';
    _equipments.push(eq);
    setLoyalty(_loyalty + eq.loyaltyBonus());
  }
}
