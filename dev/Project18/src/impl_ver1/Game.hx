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
import game.Rarity;
import impl_ver1.model.General;

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
        match.createPlayer("m-atk", "m-atk", false);
        match.createPlayer("m-def", "m-def", false);
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
      match.createPlayer(mid, mid, false);
      var mon = cast(match.monarchById(mid), Monarch);
      mon.reducePrestige(60); // 100 -> 40（保持中聲望）
      mon.grantGold(1000);

      // 初始武將 4 名：docs/數值算法.md 9.2
      // - 1 名精良
      // - 2 名普通
      // - 1 名隨機（普通或精良）
      var seed = seedBase + "|init_gen|" + mid;
      spawnGeneratedGeneral(match, 'g-${mid}-1', mid, Fine, seed + "|1");
      spawnGeneratedGeneral(match, 'g-${mid}-2', mid, Common, seed + "|2");
      spawnGeneratedGeneral(match, 'g-${mid}-3', mid, Common, seed + "|3");
      var u = Deterministic.hash01(seed + "|4rar");
      var r4:Rarity = (u < 0.5) ? Common : Fine;
      spawnGeneratedGeneral(match, 'g-${mid}-4', mid, r4, seed + "|4");
    }
  }

  static function spawnGeneratedGeneral(match:GameMatchCore, id:GeneralId, owner:MonarchId, r:Rarity, seedBase:String):Void {
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

    cmd = game.Balance.clampInt(cmd, 10, 100);
    mig = game.Balance.clampInt(mig, 10, 100);
    wit = game.Balance.clampInt(wit, 10, 100);
    stw = game.Balance.clampInt(stw, 10, 100);

    var g = cast(match.createGeneral(id, owner, cmd, mig, wit, stw), General);
    g.setRarity(r);
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
