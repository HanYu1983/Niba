package impl_ver1;

import game.GameIds;
import game.LevelKeys;
import game.IGame;
import game.IGameMatch;
import game.ITile;
import game.TileKind;
import impl_ver1.core.GameMatchCore;
import impl_ver1.util.Deterministic;
import impl_ver1.model.Monarch;

/**
 * Ver1：依 level_key 建立 {@link GameMatchCore} 並組立關卡局面。
 */
class Game implements IGame {
  public function new() {}

  public function createGameMatch(level_key:LevelKey):IGameMatch {
    var match = new GameMatchCore();
    configureFromLevel(match, level_key);
    return match;
  }

  function configureFromLevel(match:GameMatchCore, key:LevelKey):Void {
    switch key {
      case LevelKeys.EMPTY:
        return;
      case LevelKeys.PROB_GEN_32:
        configureProbGen32(match, key);
        return;
      case "ver1/smoke":
        match.createMonarch("m-atk", 0, 0, 500, 80);
        match.createMonarch("m-def", 1, 0, 100, 200);
        match.createGeneral("g-might-high", "m-atk", 1, 50, 1, 1);
        match.createGeneral("g-might-low", "m-atk", 1, 20, 1, 1);
        var tiles:Array<ITile> = [match.createTile(0, Plain)];
        match.createBoard(tiles);
      default:
        throw 'Game: unknown level_key "$key"';
    }
  }

  static function configureProbGen32(match:GameMatchCore, levelKey:LevelKey):Void {
    var len = 32;
    var seedBase = 'level=${levelKey}|len=${len}';

    // --- 棋盤 ---
    var kinds = generateTileKindsByProbability(len, seedBase);
    var tiles:Array<ITile> = [];
    for (i in 0...kinds.length)
      tiles.push(match.createTile(i, kinds[i]));
    match.createBoard(tiles);

    // --- 4 名君主（對齊 docs/數值算法.md 1.3 普通難度初始值）---
    // createMonarch 只帶 troops/grain；gold 需另外 grant。
    var ids = ["m-a", "m-b", "m-c", "m-d"];
    for (i in 0...ids.length) {
      var mid = ids[i];
      match.createMonarch(mid, i, 0, 1000, 1000);
      var mon = cast(match.monarchById(mid), Monarch);
      mon.reducePrestige(60); // 100 -> 40（保持中聲望）
      mon.grantGold(1000);

      // 初始武將 4 名（docs/數值算法.md 9.2 的「稀有度分配」尚未資料表化；此處先固定可玩數值）
      match.createGeneral('g-${mid}-1', mid, 60, 60, 60, 60);
      match.createGeneral('g-${mid}-2', mid, 55, 55, 55, 55);
      match.createGeneral('g-${mid}-3', mid, 50, 50, 50, 50);
      match.createGeneral('g-${mid}-4', mid, 45, 45, 45, 45);
    }
  }

  /**
   * 依 docs/數值算法.md §1.0 生成 TileKind：
   * - Start 固定 1 個
   * - 其餘格子依權重分配：Village 60、Resource 10、Event 10、General 8、Shop 8（合計 96）
   * - 以 deterministic shuffle 讓結果可重現
   */
  static function generateTileKindsByProbability(len:Int, seedBase:String):Array<TileKind> {
    if (len <= 0)
      return [];
    if (len == 1)
      return [Start];

    var startCount = 1;
    var remaining = len - startCount;

    // 權重（排除 Start）
    var wVillage = 60.0;
    var wResource = 10.0;
    var wEvent = 10.0;
    var wGeneral = 8.0;
    var wShop = 8.0;
    var total = wVillage + wResource + wEvent + wGeneral + wShop; // 96

    // 先取 floor，再按小數部分補齊
    function raw(w:Float):Float
      return remaining * (w / total);

    var rv = raw(wVillage);
    var rr = raw(wResource);
    var re = raw(wEvent);
    var rg = raw(wGeneral);
    var rs = raw(wShop);

    var cVillage = Std.int(Math.floor(rv));
    var cResource = Std.int(Math.floor(rr));
    var cEvent = Std.int(Math.floor(re));
    var cGeneral = Std.int(Math.floor(rg));
    var cShop = Std.int(Math.floor(rs));

    var used = cVillage + cResource + cEvent + cGeneral + cShop;
    var left = remaining - used;
    var fracs = [
      {k: "village", frac: rv - cVillage},
      {k: "resource", frac: rr - cResource},
      {k: "event", frac: re - cEvent},
      {k: "general", frac: rg - cGeneral},
      {k: "shop", frac: rs - cShop},
    ];
    // 用 deterministic「抽籤式」補齊：每次挑剩餘中 frac 最大者；同 frac 用 hash 打散
    while (left > 0) {
      var bestI = 0;
      var bestScore = -1.0;
      for (i in 0...fracs.length) {
        var f = fracs[i];
        var jitter = Deterministic.hash01(seedBase + "|frac|" + f.k + "|" + left) * 1e-6;
        var score = f.frac + jitter;
        if (score > bestScore) {
          bestScore = score;
          bestI = i;
        }
      }
      switch fracs[bestI].k {
        case "village":
          cVillage++;
        case "resource":
          cResource++;
        case "event":
          cEvent++;
        case "general":
          cGeneral++;
        case "shop":
          cShop++;
        default:
      }
      // 避免同一項無限勝出：補 1 次後把 frac 設為 -1（等同已用完補額）
      fracs[bestI].frac = -1.0;
      left--;
    }

    var out:Array<TileKind> = [];
    // Start 先放入，後續再一起 shuffle（讓 Start 位置也可重現變動）
    out.push(Start);
    for (_ in 0...cVillage)
      out.push(Village);
    for (_ in 0...cResource)
      out.push(Resource);
    for (_ in 0...cEvent)
      out.push(Event);
    for (_ in 0...cGeneral)
      out.push(General);
    for (_ in 0...cShop)
      out.push(Shop);

    // deterministic Fisher-Yates
    var i = out.length - 1;
    while (i > 0) {
      var u = Deterministic.hash01(seedBase + "|shuffle|" + i);
      var j = Std.int(Math.floor(u * (i + 1)));
      if (j < 0)
        j = 0;
      if (j > i)
        j = i;
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
      i--;
    }
    return out;
  }
}
