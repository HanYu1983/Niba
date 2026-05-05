package game;

import game.CityLevel;

/**
 * 數值算法（v0.1）之可重用純函數。
 * 目前先做成骨架：UI/規則層可引用，賽局核心可逐步導入。
 */
class Balance {
  public static inline var STAMINA_RECOVER_PER_TURN:Int = 15;
  public static inline var STAMINA_RECOVER_REST:Int = 30;
  public static inline var STAMINA_RECOVER_TERRITORY_REST:Int = 40;

  /** 體力區間能力修正（見 docs/數值算法.md 1.5）。 */
  public static function staminaModifier(stamina:Int):Float {
    if (stamina >= 80)
      return 1.0;
    if (stamina >= 50)
      return 0.8;
    if (stamina >= 20)
      return 0.6;
    return 0.4;
  }

  /** 城池防禦加成：\(1 + (level-1)*0.15\)（見 2.2/3.2）。 */
  public static function cityDefenseBonus(level:CityLevel):Float {
    var n = switch level {
      case Village: 1;
      case SmallCity: 2;
      case BigCity: 3;
      case Capital: 4;
    };
    return 1.0 + (n - 1) * 0.15;
  }

  /** 友好度修正：\(1 + (100-friendly)/100*0.3\)（見 3.2）。 */
  public static function friendlyModifier(friendly:Int):Float {
    return 1.0 + (100 - friendly) / 100.0 * 0.3;
  }

  public static inline function clampInt(x:Int, lo:Int, hi:Int):Int {
    if (x < lo)
      return lo;
    if (x > hi)
      return hi;
    return x;
  }

  /** docs/裝備系統.md：職位 → 裝備數量上限。 */
  public static function equipmentLimit(rank:PositionRank):Int {
    return switch rank {
      case Soldier: 1;
      case SquadLeader: 1;
      case SectionLeader: 2;
      case Captain: 2;
      case General: 3;
      case GreatGeneral: 4;
    };
  }

  /** docs/策略系統.md：策略體力消耗占位值（之後可改為區間抽樣）。 */
  public static function strategyStaminaCost(tier:StrategyCostTier):Int {
    return switch tier {
      case Low: 10;
      case Medium: 20;
      case High: 40;
    };
  }

  /** docs/數值算法.md 4.1：策略基礎成功率（依消耗級別）。 */
  public static function strategyBaseRate(tier:StrategyCostTier):Float {
    return switch tier {
      case Low: 0.80;
      case Medium: 0.60;
      case High: 0.40;
    };
  }

  /** docs/數值算法.md 4.1：策略成功率（stat 1~100）。 */
  public static function strategySuccessRate(statValue:Int, tier:StrategyCostTier, stamina:Int):Float {
    var s = clampInt(statValue, 0, 100) / 100.0;
    return s * strategyBaseRate(tier) * staminaModifier(stamina);
  }

  /** docs/數值算法.md 6.2：每回合糧食消耗係數（每 100 士兵消耗 1 糧食）。 */
  public static inline var GRAIN_UPKEEP_PER_TROOP:Float = 0.01;

  /** 回合末糧食消耗（向上取整）。 */
  public static function grainUpkeepForTroops(troops:Int):Int {
    var t = Math.max(0, troops);
    return Std.int(Math.ceil(t * GRAIN_UPKEEP_PER_TROOP));
  }

  /** 最小城池產出（骨架）：依城池等級給定每回合 gold/grain。 */
  public static function cityBaseIncome(level:CityLevel):{gold:Int, grain:Int} {
    return switch level {
      case Village: {gold: 10, grain: 10};
      case SmallCity: {gold: 20, grain: 20};
      case BigCity: {gold: 40, grain: 40};
      case Capital: {gold: 60, grain: 60};
    };
  }
}

