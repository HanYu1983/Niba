package game;

/**
 * 資源格結算用的「一次性資源包」。
 *
 * 注意：此為值物件（不含規則），規則由 impl_ver1（或其他版本）決定。
 */
typedef ResourceReward = {
  var gold:Int;
  var grain:Int;
  var troops:Int;
}

