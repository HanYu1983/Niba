package debug_ver1;

import game.IGame;
import game.IGameMatch;
import game.LevelKeys;
import game.TileKind;

/**
 * 驗證 docs/數值算法.md §1.0：依概率生成 TileKind 的正式生成器。
 *
 * 規則：
 * - Start 固定 1 個
 * - 其餘格子依權重分配（排除 Start）：Village 60、Resource 10、Event 10、General 8、Shop 8（合計 96）
 * - ver1 以 len=32 示範
 */
class ProbTileKindGenerationTest {
  public static function testProbTileKindGeneration(game:IGame):Void {
    var match:IGameMatch = game.createGameMatch(LevelKeys.PROB_GEN_32);
    var board = match.board();
    var len = board.length();
    if (len != 32)
      throw "ProbTileKindGenerationTest: expected len=32, got " + len;

    var counts = new Map<String, Int>();
    function inc(k:String):Void {
      counts.set(k, (counts.exists(k) ? counts.get(k) : 0) + 1);
    }

    for (i in 0...len) {
      var k = board.tileAt(i).kind();
      switch k {
        case Start:
          inc("start");
        case Village:
          inc("village");
        case Resource:
          inc("resource");
        case Event:
          inc("event");
        case General:
          inc("general");
        case Shop:
          inc("shop");
        default:
          // 本關卡只產生上述種類；其他 TileKind 視為規則偏移
          throw "ProbTileKindGenerationTest: unexpected kind " + Std.string(k);
      }
    }

    var startN = counts.exists("start") ? counts.get("start") : 0;
    if (startN != 1)
      throw "ProbTileKindGenerationTest: expected Start=1, got " + startN;

    // 依 same rule 計算期望 counts（用 floor + 最大小數補齊）
    var remaining = len - 1;
    var total = 96.0;
    var rv = remaining * (60.0 / total);
    var rr = remaining * (10.0 / total);
    var re = remaining * (10.0 / total);
    var rg = remaining * (8.0 / total);
    var rs = remaining * (8.0 / total);

    var ev = Std.int(Math.floor(rv));
    var er = Std.int(Math.floor(rr));
    var ee = Std.int(Math.floor(re));
    var eg = Std.int(Math.floor(rg));
    var es = Std.int(Math.floor(rs));
    var used = ev + er + ee + eg + es;
    var left = remaining - used;

    var fracs = [
      {k: "village", frac: rv - ev},
      {k: "resource", frac: rr - er},
      {k: "event", frac: re - ee},
      {k: "general", frac: rg - eg},
      {k: "shop", frac: rs - es},
    ];
    // 這裡用「純最大 frac」推導期望（len=32 時不會出現平手造成不穩定）
    while (left > 0) {
      var bestI = 0;
      var best = -1.0;
      for (i in 0...fracs.length)
        if (fracs[i].frac > best) {
          best = fracs[i].frac;
          bestI = i;
        }
      switch fracs[bestI].k {
        case "village":
          ev++;
        case "resource":
          er++;
        case "event":
          ee++;
        case "general":
          eg++;
        case "shop":
          es++;
        default:
      }
      fracs[bestI].frac = -1.0;
      left--;
    }

    function get(k:String):Int
      return counts.exists(k) ? counts.get(k) : 0;

    if (get("village") != ev || get("resource") != er || get("event") != ee || get("general") != eg || get("shop") != es) {
      throw "ProbTileKindGenerationTest: counts mismatch. got v/r/e/g/s="
        + get("village")
        + "/"
        + get("resource")
        + "/"
        + get("event")
        + "/"
        + get("general")
        + "/"
        + get("shop")
        + ", expected "
        + ev
        + "/"
        + er
        + "/"
        + ee
        + "/"
        + eg
        + "/"
        + es;
    }

    trace("[ProbTileKindGenerationTest] OK — TileKind probability generator (len=32)");
  }
}

