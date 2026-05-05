package impl_ver1;

import game.EquipmentType;
import game.GameIds;
import game.GeneralStat;
import game.IEquipment;
import game.Rarity;

class Equipment implements IEquipment {
  var _id:EquipmentId;
  var _name:String;
  var _type:EquipmentType;
  var _rarity:Rarity;
  var _bonusStat:GeneralStat;
  var _bonusValue:Int;
  var _loyaltyBonus:Int;
  var _price:Int;

  public function new(
    id:EquipmentId,
    name:String,
    type:EquipmentType,
    rarity:Rarity,
    bonusStat:GeneralStat,
    bonusValue:Int,
    loyaltyBonus:Int,
    price:Int
  ) {
    _id = id;
    _name = name;
    _type = type;
    _rarity = rarity;
    _bonusStat = bonusStat;
    _bonusValue = bonusValue;
    _loyaltyBonus = loyaltyBonus;
    _price = price;
  }

  public function id():EquipmentId
    return _id;

  public function name():String
    return _name;

  public function type():EquipmentType
    return _type;

  public function rarity():Rarity
    return _rarity;

  public function bonusStat():GeneralStat
    return _bonusStat;

  public function bonusValue():Int
    return _bonusValue;

  public function loyaltyBonus():Int
    return _loyaltyBonus;

  public function price():Int
    return _price;
}

