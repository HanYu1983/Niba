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

  /** docs/數值算法.md 4.3：策略成功時效果倍率。 */
  public static function strategyEffectMultiplier(statValue:Int, stamina:Int):Float {
    var s = clampInt(statValue, 0, 100) / 100.0;
    return s * staminaModifier(stamina);
  }

  /** docs/數值算法.md 4.3：策略成功時的整數型效果（向下取整）。 */
  public static function strategyEffectAmountInt(base:Int, statValue:Int, stamina:Int):Int {
    var mul = strategyEffectMultiplier(statValue, stamina);
    // 避免浮點誤差導致 56 變 55（例如 0.56 實際為 0.559999999...）
    var amt = Std.int(Math.floor(base * mul + 0.000001));
    if (amt < 0)
      amt = 0;
    return amt;
  }

  /** docs/數值算法.md 4.3：策略成功時的浮點型效果（不取整）。 */
  public static function strategyEffectAmountFloat(base:Float, statValue:Int, stamina:Int):Float {
    var mul = strategyEffectMultiplier(statValue, stamina);
    var amt = base * mul;
    if (amt < 0)
      amt = 0;
    return amt;
  }

  /** docs/數值算法.md 4.3：部分策略失敗仍有 25% 基礎效果。 */
  public static function strategyFailBaseRate(jiceKey:String):Float {
    return switch jiceKey {
      // 負面干擾類：失敗仍可能造成少量影響（ver1 先採 25%）
      case "jice_fire", "jice_sabotage", "jice_dissension", "jice_raid", "jice_conscription", "jice_rumor":
        0.25;
      default:
        0.0;
    };
  }

  public static function strategyFailEffectAmountInt(base:Int, jiceKey:String):Int {
    var r = strategyFailBaseRate(jiceKey);
    var amt = Std.int(Math.floor(base * r + 0.000001));
    if (amt < 0)
      amt = 0;
    return amt;
  }

  public static function strategyFailEffectAmountFloat(base:Float, jiceKey:String):Float {
    var r = strategyFailBaseRate(jiceKey);
    var amt = base * r;
    if (amt < 0)
      amt = 0;
    return amt;
  }

  // ===== 指定玩家類策略（ver1 基礎效果 + §4.3 倍率）=====

  /**
   * 離間：降低忠誠度（ver1 基礎效果 = 10）。
   * docs/數值算法.md 僅定義成功率與一般效果倍率；未定義基礎效果，先採 ver1 常數並套用倍率。
   */
  public static function dissensionLoyaltyLoss(wit:Int, stamina:Int):Int {
    return strategyEffectAmountInt(10, wit, stamina);
  }

  /**
   * 急襲：造成士兵損失（ver1 基礎效果：目標兵力 10% + might/10）。
   * 套用 §4.3 倍率後向下取整。
   */
  public static function raidTroopLoss(defTroops:Int, might:Int, stamina:Int):Int {
    var t = Math.max(0, defTroops);
    var base = Std.int(Math.ceil(t * 0.1)) + Std.int(clampInt(might, 0, 100) / 10);
    if (base < 0)
      base = 0;
    return strategyEffectAmountInt(base, might, stamina);
  }

  /**
   * 徵兵：從目標奪取士兵（ver1 基礎效果：min(目標 5% + command/10, 20)）。
   * 套用 §4.3 倍率後向下取整。
   */
  public static function conscriptionTroopTake(defTroops:Int, command:Int, stamina:Int):Int {
    var t = Math.max(0, defTroops);
    var base = Std.int(Math.ceil(t * 0.05)) + Std.int(clampInt(command, 0, 100) / 10);
    if (base > 20)
      base = 20;
    if (base < 0)
      base = 0;
    return strategyEffectAmountInt(base, command, stamina);
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

  // ===== 策略解鎖（docs/策略系統.md：武將職位→可解鎖策略）=====

  public static function positionRankValue(r:PositionRank):Int {
    return switch r {
      case Soldier: 0;
      case SquadLeader: 1;
      case SectionLeader: 2;
      case Captain: 3;
      case General: 4;
      case GreatGeneral: 5;
    };
  }

  public static inline function positionRankGte(a:PositionRank, b:PositionRank):Bool
    return positionRankValue(a) >= positionRankValue(b);

  /**
   * docs/策略系統.md「策略與武將職位的關係」：回傳策略所需最低職位。
   * 未列於文件者：ver1 預設為 GreatGeneral（避免過早解鎖）。
   */
  public static function requiredRankForStrategy(jiceKey:String):PositionRank {
    return switch jiceKey {
      // 士兵：基礎策略（火計、鼓舞、屯田）
      case "jice_fire", "jice_inspire", "jice_farm",
        // ver1 既有骨架策略（文件未列，但需可用於 smoke/test）
        "jice_luoshi", "jice_roadblock":
        Soldier;
      // 伍長：+ 激勵、商路
      case "jice_encourage", "jice_trade_route": SquadLeader;
      // 什長：+ 療傷、築城、流言
      case "jice_heal", "jice_fortify", "jice_rumor": SectionLeader;
      // 校尉：+ 覺醒、破壞、離間
      case "jice_awaken", "jice_sabotage", "jice_dissension": Captain;
      // 將軍：+ 急襲、徵兵
      case "jice_raid", "jice_conscription": General;
      // 大將軍：所有策略（含未列者）
      default: GreatGeneral;
    };
  }

  /** ver1：部分策略不需要選將（例如路障）。 */
  public static function strategyRequiresCaster(jiceKey:String):Bool {
    return switch jiceKey {
      case "jice_roadblock": false;
      default: true;
    };
  }

  /**
   * docs/策略系統.md：依職位解鎖的策略清單（ver1 顯式列出，避免掃描註冊表）。
   * 用途：讓 match 在不持牌的情況下，也能自動補齊「已解鎖」的策略卡。
   */
  public static function rankUnlockableStrategyKeys():Array<String> {
    return [
      // Soldier
      "jice_fire", "jice_inspire", "jice_farm", "jice_luoshi", "jice_roadblock",
      // SquadLeader
      "jice_encourage", "jice_trade_route",
      // SectionLeader
      "jice_heal", "jice_fortify", "jice_rumor",
      // Captain
      "jice_awaken", "jice_sabotage", "jice_dissension",
      // General
      "jice_raid", "jice_conscription",
    ];
  }
}

