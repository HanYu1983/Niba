package impl_ver1.rules;

/**
 * Ver1：集中管理「指派武將」的 key，避免散落在各 staging action 內。
 * game 層只認 GeneralAssignmentKey（String），keys 的擴充在 impl_ver1 進行。
 */
class GeneralAssignmentKeys {
  public static inline var ResourceTileBoost = "resource_tile_boost";
  public static inline var EventAvoidance = "event_avoidance";
  public static inline var VillageTrade = "village_trade";
  public static inline var VillagePlunder = "village_plunder";
  public static inline var VillageConquer = "village_conquer";
  public static inline var FriendlyCityDevelop = "friendly_city_develop";
  public static inline var FriendlyCityRest = "friendly_city_rest";
}

