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
import game.HistoricalPeople;

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
        var mids = match.forceGetUnusedMonarchIds();
        var atk = mids.length > 0 ? mids[0] : "m-atk";
        var def = mids.length > 1 ? mids[1] : "m-def";
        match.createMonarch(atk, 0, 0, 500, 80);
        match.createMonarch(def, 1, 0, 100, 200);
        match.linkPlayerToMonarch(atk, match.createPlayer(atk, false));
        match.linkPlayerToMonarch(def, match.createPlayer(def, false));
        // 兩名武將：取名庫中尚未使用者
        var gids = match.forceGetUnusedGeneralIds();
        var g1 = gids.length > 0 ? gids[0] : "g-might-high";
        var g2 = gids.length > 1 ? gids[1] : "g-might-low";
        var p1 = HistoricalPeople.generalPresetById(g1);
        var p2 = HistoricalPeople.generalPresetById(g2);
        if (p1 != null) {
          var gg1 = cast(match.createGeneral(p1.id, atk, p1.command, p1.might, p1.wit, p1.stewardship), General);
          gg1.setRarity(p1.rarity);
        } else {
          match.createGeneral(g1, atk, 1, 50, 1, 1);
        }
        if (p2 != null) {
          var gg2 = cast(match.createGeneral(p2.id, atk, p2.command, p2.might, p2.wit, p2.stewardship), General);
          gg2.setRarity(p2.rarity);
        } else {
          match.createGeneral(g2, atk, 1, 20, 1, 1);
        }
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

    // --- 4 名主公（GDD 3.2.1）---
    // 先取未用主公 id，再建立；同名人物不得重複出現
    var mids = match.forceGetUnusedMonarchIds();
    if (mids.length < 4)
      throw "Game.configureProbGen32: insufficient monarch ids in catalog";
    var chosen = [mids[0], mids[1], mids[2], mids[3]];
    for (i in 0...chosen.length) {
      var mid = chosen[i];
      // 普通難度基礎值：troops/grain=1000；gold 另 grant 1000
      // GDD 3.2.1 初始優勢（最小版）：以資源微調表達
      var troops = 1000;
      var grain = 1000;
      var gold = 1000;
      switch mid {
        case "m_oda_nobunaga":
          gold += 300;
        case "m_cao_cao":
          troops += 300;
        case "m_liu_bei":
          grain += 300;
        default:
      }
      match.createMonarch(mid, i, 0, troops, grain);
      match.linkPlayerToMonarch(mid, match.createPlayer(mid, i != 0));
      var mon = cast(match.monarchById(mid), Monarch);
      mon.reducePrestige(60); // 100 -> 40（保持中聲望）
      mon.grantGold(gold);

      // 初始武將 4 名：先用歷史名庫（避免重複）
      var gids = match.forceGetUnusedGeneralIds();
      if (gids.length < 4)
        throw "Game.configureProbGen32: insufficient general ids in catalog";
      for (j in 0...4) {
        var gid = gids[j];
        var p = HistoricalPeople.generalPresetById(gid);
        if (p == null)
          throw 'Game.configureProbGen32: missing general preset "$gid"';
        var g = cast(match.createGeneral(p.id, mid, p.command, p.might, p.wit, p.stewardship), General);
        g.setRarity(p.rarity);
      }
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
