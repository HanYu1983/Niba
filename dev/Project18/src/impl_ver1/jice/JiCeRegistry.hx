package impl_ver1.jice;

import game.GameIds;
import game.IJiCe;

/**
 * 計策 {@link JiCeKey}→建構閉包註冊表。
 * {@link #spawn} 每次建立新實例（無狀態牌等同 clone；若牌帶開局狀態請在閉包內自行複製）。
 */
typedef JiCeSpawn = impl_ver1.core.GameMatchCore -> IJiCe;

class JiCeRegistry {
  static var _byKey:Null<Map<JiCeKey, JiCeSpawn>>;

  static function map():Map<JiCeKey, JiCeSpawn> {
    if (_byKey == null)
      _byKey = new Map();
    return _byKey;
  }

  public static function register(key:JiCeKey, spawn:JiCeSpawn):Void {
    var m = map();
    if (m.exists(key))
      throw 'JiCeRegistry.register: duplicate key "$key"';
    m.set(key, spawn);
  }

  public static function spawn(match:impl_ver1.core.GameMatchCore, key:JiCeKey):IJiCe {
    var sp = map().get(key);
    if (sp == null)
      throw 'JiCeRegistry.spawn: unknown JiCeKey "$key"';
    return sp(match);
  }
}
