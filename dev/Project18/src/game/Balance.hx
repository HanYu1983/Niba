package game;

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
}

