package debug_ver1;

import game.TerrainKind;
import impl_ver1.util.Deterministic;

class TerrainGenerationWeightsTest {
  public static function testTerrainGenerationWeights():Void {
    // 直接複製 ver1 權重（此測試的目的：分佈與 deterministic 期望不意外漂移）
    var wPlain = 0.25;
    var wGrass = 0.20;
    var wForest = 0.18;
    var wRiver = 0.15;
    var wMountain = 0.12;
    var wCoast = 0.10;
    var sum = wPlain + wGrass + wForest + wRiver + wMountain + wCoast;

    function roll(u:Float):TerrainKind {
      var x = u * sum;
      if (x < wPlain) return Plain;
      x -= wPlain;
      if (x < wGrass) return Grassland;
      x -= wGrass;
      if (x < wForest) return Forest;
      x -= wForest;
      if (x < wRiver) return River;
      x -= wRiver;
      if (x < wMountain) return Mountain;
      return Coast;
    }

    // deterministic：同 seed 必定同結果
    var u1 = Deterministic.hash01("terrain|t=7");
    var a = roll(u1);
    var b = roll(Deterministic.hash01("terrain|t=7"));
    if (Std.string(a) != Std.string(b))
      throw "TerrainGenerationWeightsTest: deterministic failed";

    // 分佈粗驗：取樣 2000 個格子，實際比例需落在 ±6% 內（保守區間）
    var n = 2000;
    var cnt = new Map<String, Int>();
    for (i in 0...n) {
      var u = Deterministic.hash01("terrain|t=" + i);
      var t = roll(u);
      var k = Std.string(t);
      cnt.set(k, (cnt.exists(k) ? cnt.get(k) : 0) + 1);
    }

    assertApprox(cnt, "Plain", wPlain / sum, n, 0.06);
    assertApprox(cnt, "Grassland", wGrass / sum, n, 0.06);
    assertApprox(cnt, "Forest", wForest / sum, n, 0.06);
    assertApprox(cnt, "River", wRiver / sum, n, 0.06);
    assertApprox(cnt, "Mountain", wMountain / sum, n, 0.06);
    assertApprox(cnt, "Coast", wCoast / sum, n, 0.06);
  }

  static function assertApprox(cnt:Map<String, Int>, key:String, p:Float, n:Int, tol:Float):Void {
    var c = cnt.exists(key) ? cnt.get(key) : 0;
    var got = c / (n * 1.0);
    if (Math.abs(got - p) > tol)
      throw "TerrainGenerationWeightsTest: " + key + " ratio out of range. got=" + got + " expected=" + p;
  }
}

