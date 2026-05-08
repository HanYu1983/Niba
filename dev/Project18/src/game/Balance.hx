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

  /**
   * docs/數值算法.md §1.4：策略體力消耗區間。
   * - 低消耗：10~15
   * - 中消耗：20~30
   * - 高消耗：40~50
   */
  public static function strategyStaminaCostRange(tier:StrategyCostTier):{lo:Int, hi:Int} {
    return switch tier {
      case Low: {lo: 10, hi: 15};
      case Medium: {lo: 20, hi: 30};
      case High: {lo: 40, hi: 50};
    };
  }

  /** 依 \(u\in[0,1)\) 在區間內抽取體力消耗（deterministic 由呼叫端提供 u）。 */
  public static function rollStrategyStaminaCost(tier:StrategyCostTier, u:Float):Int {
    var r = strategyStaminaCostRange(tier);
    var lo = r.lo;
    var hi = r.hi;
    if (hi < lo)
      throw "Balance.rollStrategyStaminaCost: invalid range";
    // 包含上下界的整數抽樣：lo..hi
    var span = hi - lo + 1;
    var k = Std.int(Math.floor(Math.max(0, u) * span));
    if (k < 0)
      k = 0;
    if (k >= span)
      k = span - 1;
    return lo + k;
  }

  /** 兼容：回傳該 tier 的最小消耗值。 */
  public static function strategyStaminaCost(tier:StrategyCostTier):Int {
    return strategyStaminaCostRange(tier).lo;
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

  /**
   * docs/裝備系統.md「裝備程序化生成」：
   * - 考慮遊戲進度（越後期越容易出現高稀有度）
   * - 考慮聲望（高聲望略提高高稀有度機率）
   *
   * 規則（ver1 明確化）：
   * - 以 round 作為進度 proxy（0..）
   * - 用分段權重做抽樣（deterministic：呼叫端提供 u）
   */
  public static function shopRarityWeights(round:Int, prestige:Int):{c:Float, f:Float, e:Float, l:Float} {
    var r = Math.max(0, round);
    var base = if (r < 5) {
      {c: 0.75, f: 0.22, e: 0.03, l: 0.00};
    } else if (r < 10) {
      {c: 0.60, f: 0.28, e: 0.10, l: 0.02};
    } else if (r < 20) {
      {c: 0.40, f: 0.33, e: 0.20, l: 0.07};
    } else {
      {c: 0.22, f: 0.33, e: 0.28, l: 0.17};
    };

    // 聲望修正：高聲望把一小段權重從 Common 移到 Epic/Legendary；低聲望反向（幅度保守）
    var p = prestige;
    var d = 0.0;
    if (p >= 70)
      d = 0.06;
    else if (p >= 40)
      d = 0.0;
    else
      d = -0.04;

    var c = base.c - d;
    var e = base.e + d * 0.6;
    var l = base.l + d * 0.4;
    var f = base.f;
    // clamp 並重新歸一化
    if (c < 0) c = 0;
    if (f < 0) f = 0;
    if (e < 0) e = 0;
    if (l < 0) l = 0;
    var sum = c + f + e + l;
    if (sum <= 0)
      return {c: 1.0, f: 0.0, e: 0.0, l: 0.0};
    return {c: c / sum, f: f / sum, e: e / sum, l: l / sum};
  }

  public static function rollShopRarity(round:Int, prestige:Int, u:Float):Rarity {
    var w = shopRarityWeights(round, prestige);
    var x = Math.max(0, Math.min(0.999999, u));
    if (x < w.c)
      return Common;
    x -= w.c;
    if (x < w.f)
      return Fine;
    x -= w.f;
    if (x < w.e)
      return Epic;
    return Legendary;
  }
}

