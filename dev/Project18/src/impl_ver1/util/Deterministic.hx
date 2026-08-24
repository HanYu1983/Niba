package impl_ver1.util;

/**
 * 可重現的「seed → 0..1」工具。
 * 目的：避免直接依賴 Random，讓測試/重播可穩定重現。
 */
class Deterministic {
  /** FNV-1a 32-bit（以位移實作乘法，降低 target 差異）。 */
  public static function fnv1a32(s:String):Int {
    var h:Int = 0x811C9DC5;
    for (i in 0...s.length) {
      h ^= s.charCodeAt(i);
      // h *= 16777619（用位移避免某些 target 的乘法差異）
      h = (h + (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24));
    }
    return h;
  }

  /**
   * seed → 0..1（含端點）。
   * 取低 24 bit 做比例，避免 Int 溢位帶來的平台差異。
   */
  public static inline function hash01(seed:String):Float {
    var h = fnv1a32(seed);
    var x = h & 0xFFFFFF;
    return x / 16777215.0;
  }

  /** seed → [-amp, +amp] */
  public static inline function jitter(seed:String, amp:Float):Float {
    return (hash01(seed) * (amp * 2.0)) - amp;
  }

  /** 在 [0, len-1] 取一個 index（len<=0 則回傳 0）。 */
  public static inline function pickIndex(seed:String, len:Int):Int {
    if (len <= 0)
      return 0;
    var i = Std.int(Math.floor(hash01(seed) * len));
    if (i < 0)
      i = 0;
    if (i >= len)
      i = len - 1;
    return i;
  }
}

