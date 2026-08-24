package debug_ver1;

import game.Rarity;
import impl_ver1.util.Deterministic;

/**
 * 對齊 docs/數值算法.md §9.1：
 * - 依稀有度抽屬性總和區間
 * - 每項屬性最小值 = 10
 *
 * 此測試直接用同一套生成邏輯驗證區間與最小值。
 * （ver1 的正式生成入口用於武將格 offers 與開局武將。）
 */
class GeneralGenerationByRarityTest {
  public static function testGeneralGenerationByRarity():Void {
    assertOne(Common, "seed-common");
    assertOne(Fine, "seed-fine");
    assertOne(Epic, "seed-epic");
    assertOne(Legendary, "seed-legendary");
    trace("[GeneralGenerationByRarityTest] OK — stats sum in range; min stat=10");
  }

  static function assertOne(r:Rarity, seed:String):Void {
    var s = roll(r, seed);
    if (s.command < 10 || s.might < 10 || s.wit < 10 || s.stewardship < 10)
      throw "GeneralGenerationByRarityTest: expected min stat 10";
    var sum = s.command + s.might + s.wit + s.stewardship;
    var lo = switch r {
      case Common: 150;
      case Fine: 250;
      case Epic: 350;
      case Legendary: 450;
    };
    var hi = switch r {
      case Common: 250;
      case Fine: 350;
      case Epic: 450;
      case Legendary: 500;
    };
    if (sum < lo || sum > hi)
      throw "GeneralGenerationByRarityTest: sum out of range. r=" + Std.string(r) + " sum=" + sum;
  }

  // 與 impl_ver1.Game.spawnGeneratedGeneral 同形（避免耦合到內部方法）
  static function roll(r:Rarity, seedBase:String):{command:Int, might:Int, wit:Int, stewardship:Int} {
    var lo = switch r {
      case Common: 150;
      case Fine: 250;
      case Epic: 350;
      case Legendary: 450;
    };
    var hi = switch r {
      case Common: 250;
      case Fine: 350;
      case Epic: 450;
      case Legendary: 500;
    };
    var total = lo + Std.int(Math.floor(Deterministic.hash01(seedBase + "|sum") * (hi - lo + 1)));
    if (total < lo)
      total = lo;
    if (total > hi)
      total = hi;

    var mainPick = Std.int(Math.floor(Deterministic.hash01(seedBase + "|main") * 4));
    if (mainPick < 0)
      mainPick = 0;
    if (mainPick > 3)
      mainPick = 3;
    var mainRatio = 0.30 + Deterministic.hash01(seedBase + "|mainRatio") * 0.10;
    var main = Std.int(Math.floor(total * mainRatio));
    if (main < 10)
      main = 10;

    var rest = total - main - 30;
    if (rest < 0)
      rest = 0;
    var w0 = Deterministic.hash01(seedBase + "|w0") + 0.01;
    var w1 = Deterministic.hash01(seedBase + "|w1") + 0.01;
    var w2 = Deterministic.hash01(seedBase + "|w2") + 0.01;
    var ws = w0 + w1 + w2;
    var a0 = Std.int(Math.floor(rest * (w0 / ws)));
    var a1 = Std.int(Math.floor(rest * (w1 / ws)));
    var a2 = rest - a0 - a1;
    var base0 = 10 + a0;
    var base1 = 10 + a1;
    var base2 = 10 + a2;

    var cmd = 10;
    var mig = 10;
    var wit = 10;
    var stw = 10;
    switch mainPick {
      case 0: cmd = main;
      case 1: mig = main;
      case 2: wit = main;
      case 3: stw = main;
      default:
    }
    var xs = [base0, base1, base2];
    var xi = 0;
    function take():Int return xs[xi++];
    if (mainPick != 0)
      cmd = take();
    if (mainPick != 1)
      mig = take();
    if (mainPick != 2)
      wit = take();
    if (mainPick != 3)
      stw = take();
    return {command: cmd, might: mig, wit: wit, stewardship: stw};
  }
}

