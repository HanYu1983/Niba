package impl_ver1.jice;

import game.Balance;
import game.GameIds;
import game.MenuGeneralChoice;
import game.MenuMonarchChoice;
import game.MenuTileChoice;
import game.StrategyCostTier;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;

/**
 * JiCe 表單 choices 的「合法目標」集中處理：
 * - 避免各計策 buildPlayerMenu 把全棋盤/全 roster 都塞進 choices
 * - 若沒有任何合法目標，可回傳空陣列，由呼叫端把提交 entry 設成 disabled
 */
class JiCeMenuLegalChoices {
  public static function eligibleCasters(ruler:Monarch, jiceKey:String, tier:StrategyCostTier):Array<MenuGeneralChoice> {
    // 依策略解鎖職位 + 體力（用 cost range.hi 做保守過濾）
    var req = Balance.requiredRankForStrategy(jiceKey);
    var costHi = Balance.strategyStaminaCostRange(tier).hi;
    var out:Array<MenuGeneralChoice> = [];
    for (g in ruler.roster()) {
      if (g == null)
        continue;
      if (!Balance.positionRankGte(g.positionRank(), req))
        continue;
      if (g.stamina() < costHi)
        continue;
      var gid = g.id();
      out.push({ generalId: gid, caption: gid });
    }
    return out;
  }

  public static function rosterChoices(ruler:Monarch):Array<MenuGeneralChoice> {
    var out:Array<MenuGeneralChoice> = [];
    for (g in ruler.roster())
      if (g != null) {
        var gid = g.id();
        out.push({ generalId: gid, caption: gid });
      }
    return out;
  }

  public static function otherMonarchChoices(match:GameMatchCore, selfId:MonarchId):Array<MenuMonarchChoice> {
    var out:Array<MenuMonarchChoice> = [];
    for (m in match.monarchs())
      if (m != null && m.id() != selfId) {
        var mid = m.id();
        out.push({ monarchId: mid, caption: mid });
      }
    return out;
  }

  public static function enemyTerritoryTileChoices(match:GameMatchCore, rulerId:MonarchId, ?onlyTile:Null<TileIndex>):Array<MenuTileChoice> {
    var out:Array<MenuTileChoice> = [];
    if (onlyTile != null) {
      if (match.tileOwnedByOtherMonarch(onlyTile, rulerId)) {
        var kind = match.tileAt(onlyTile).kind();
        out.push({ tileIndex: onlyTile, caption: '[${onlyTile}] ' + Std.string(kind) });
      }
      return out;
    }
    var n = match.board().length();
    for (i in 0...n) {
      if (!match.tileOwnedByOtherMonarch(i, rulerId))
        continue;
      var kind = match.tileAt(i).kind();
      out.push({ tileIndex: i, caption: '[${i}] ' + Std.string(kind) });
    }
    return out;
  }

  public static function ownedTerritoryTileChoices(match:GameMatchCore, rulerId:MonarchId, ?onlyTile:Null<TileIndex>):Array<MenuTileChoice> {
    var out:Array<MenuTileChoice> = [];
    if (onlyTile != null) {
      if (match.tileOwnedByMonarch(onlyTile, rulerId)) {
        var kind = match.tileAt(onlyTile).kind();
        out.push({ tileIndex: onlyTile, caption: '[${onlyTile}] ' + Std.string(kind) });
      }
      return out;
    }
    var n = match.board().length();
    for (i in 0...n) {
      if (!match.tileOwnedByMonarch(i, rulerId))
        continue;
      var kind = match.tileAt(i).kind();
      out.push({ tileIndex: i, caption: '[${i}] ' + Std.string(kind) });
    }
    return out;
  }
}

