package view;

import game.GameIds.TileIndex;
import game.CityLevel;
import game.EquipmentType;
import game.GeneralStat;
import game.OutboxPayload;
import game.OutboxPayload.FlowAckKind;
import game.OutboxPayload.HostileSettlementBranch;
import game.OutboxPayload.OutboxUiCopyKey;
import game.OutboxPayload.ResourceGrant;
import game.Rarity;
import game.StrategyCostTier;
import game.StrategyPhase;
import game.OutboxPayload.TerritoryStoresKind;

/**
 * 將 {@link game.OutboxPayload} 轉為預設中文正文（僅 UI 層；賽局不組排版字串）。
 */
class OutboxPopupBodyText {
  /** 移動結束摘要正文（Popup／Animation 共用）。 */
  public static function moveCompletedBody(deltaSteps:Null<Int>, pawnTileIndex:TileIndex):String {
    return (deltaSteps != null ? '本次移動步數：${deltaSteps}\n' : "") + '目前位置：格 ${pawnTileIndex}';
  }

  public static function format(p:OutboxPayload):String {
    return switch p {
      case FlowAck(k): flowAckBody(k);

      case MoveCompleted(delta, pos):
        moveCompletedBody(delta, pos);

      case PawnMove(from, to, delta):
        '移動：${from} → ${to}（${delta}步）';

      case AnimPlainText(msg):
        msg;

      case EmptyCityOccupied(tile, troops, grain, guards):
        '城池格 ${tile}\n進駐兵力：${troops}\n進駐糧食：${grain}\n駐守武將：${guards.length > 0 ? guards.join(", ") : "（無）"}';

      case FriendlyCityDispatchCompleted(tile, tt, gg, gold):
        '城池格 ${tile}\n城池兵力調整為：${tt}\n城池糧食調整為：${gg}\n城池金錢調整為：${gold}';

      case TerritoryStoresDispatchCompleted(surface, tile, tt, gg, gold):
        var prefix = switch surface {
          case VillageStores: "村落";
          case CityStores: "城池";
        };
        '${prefix}格 ${tile}\n${prefix}兵力調整為：${tt}\n${prefix}糧食調整為：${gg}\n${prefix}金錢調整為：${gold}';

      case HostileCombatSettlement(branch, tile, atk, def):
        var atkS = atk != null ? atk : "（無）";
        var bRaw = switch branch {
          case PayToll: "過路費已付";
          case Negotiate: '談判（攻將 ${atkS}）｜協議草案已備';
          case Attrition: '消耗戰（攻將 ${atkS}）｜損耗預估完成';
          case Siege: '攻城戰（攻將 ${atkS}）｜城防推演完成';
          case Duel:
            var d = def != null ? def : "?";
            '單挑（攻將 ${atkS} vs 守將 ${d}）｜勝負已裁定';
        };
        '結算：${bRaw}\n城池格 ${tile}';

      case TileEventAvoidanceSucceeded(gid, stat, sv, pct, mult):
        '武將 ${gid} 規避成功（${statZh(stat)}=${sv}，率=${pct}%）\n事件效果倍率：${mult}';

      case TileEventAvoidanceFailed(gid, stat, sv, pct):
        '武將 ${gid} 規避失敗（${statZh(stat)}=${sv}，率=${pct}%）\n請繼續處理事件選項。';

      case EpidemicResolved(stLoss, trLoss, mult):
        '武將體力 -${stLoss}（全體）\n士兵 -${trLoss}\n倍率 ${mult}';

      case GranaryFireResolved(loss, mult):
        '損失糧食：${loss}（倍率 ${mult}）';

      case DefectionNoGeneralsSkipped:
        "（無麾下武將，事件略過）";

      case DefectionResolved(gid, pct, mult):
        '武將 ${gid} 叛逃離開（率 ${pct}%｜倍率 ${mult}）';

      case DefectionNotTriggered(pct, mult):
        '叛逃未發生（率 ${pct}%｜倍率 ${mult}）';

      case AssassinationNoGeneralsSkipped:
        "（無麾下武將，事件略過）";

      case AssassinationResolved(gid, stat, loss, mult):
        '武將 ${gid}｜${statZh(stat)} 永久 -${loss}\n倍率 ${mult}';

      case RingArmyFundBonus(true, gid, amt):
        '武將 ${gid} 領軍資\n獲得：兵力 +${amt}';
      case RingArmyFundBonus(false, _, amt):
        '獲得：兵力 +${amt}';

      case RingSupplyBonus(gr):
        '獲得：糧食 +${gr}';

      case RingRewardSkipped:
        "略過獎勵。";

      case ChestTroopReward(true, gid, g):
        '武將 ${gid} 領賞\n獲得：兵力 +${g}';
      case ChestTroopReward(false, _, g):
        '獲得：兵力 +${g}\n（麾下無武將）';

      case ResourceClaimed(idx, g):
        '格位 ${idx}\n獲得：金錢 +${g.gold}\n獲得：糧食 +${g.grain}\n獲得：兵力 +${g.troops}';

      case ResourceBoostAssigned(tile, gid, st, sv, sb, sa, base, bonus, total):
        '格位 ${tile}\n指派武將：${gid}（${statZh(st)}=${sv}，體力 ${sb}→${sa}）\n'
        + '基礎：金 ${base.gold}／糧 ${base.grain}／兵 ${base.troops}\n'
        + '加成：+${bonus}\n'
        + '合計：金 ${total.gold}／糧 ${total.grain}／兵 ${total.troops}';

      case VillageTradeOutcome(ok, v, gid, rpct, rtpct, goldSp, grainG, fp, fn, ownerAfter):
        var head = '村落（格 ${v}）交易\n武將：${gid}\n成功率：約 ${rpct}%（roll=${rtpct}%）';
        var mid = if (ok)
          '\n獲得：糧食 +${grainG}\n消耗：金錢 -${goldSp}'
        else
          "\n未完成交換（仍消耗體力）";
        var tail = '\n友好度：${fp} → ${fn}';
        var own = ownerAfter != null ? '\n領地：已歸順（屬主 ${ownerAfter}）' : "";
        head + mid + tail + own + '\n${gid} 體力 -10';

      case VillagePlunderOutcome(ok, v, gid, rpct, gg, gr, gt, fp, fn, pLoss):
        var tag = ok ? "搶奪成功" : "搶奪失敗";
        ok
          ? '村落（格 ${v}）${tag}\n武將：${gid}\n成功率：約 ${rpct}%\n獲得：金 +${gg}｜糧 +${gr}｜兵 +${gt}\n友好度：${fp} → ${fn}\n聲望 -${pLoss}\n${gid} 體力 -12'
          : '村落（格 ${v}）${tag}\n武將：${gid}\n成功率：約 ${rpct}%\n未獲得資源\n友好度：${fp} → ${fn}\n聲望 -${pLoss}\n${gid} 體力 -12';

      case VillageDevelopOutcome(ok, v, gid, pol, rpct, cg, ck, bef, aft):
        '村落格 ${v}\n'
        + '武將：${gid}（政治=${pol}）\n'
        + '成功率：約 ${rpct}%\n'
        + '消耗：村落金 -${cg}、村落糧 -${ck}、體力 -12\n'
        + (ok ? '等級：${cityLvlZh(bef)} → ${cityLvlZh(aft)}' : '等級：${cityLvlZh(bef)}（不變）');

      case VillageConquerOutcome(win, v, gid, commit, af, _, _, _, lossFail):
        win
          ? '攻占成功。\n格子：${v}\n武將：${gid}\n投入兵力：${commit}\n掠奪：村落儲備 30%\n聲望 -3\n友好度：→ ${af}（重置）\n領地：已占領（每回合產出）\n（武將體力 -15）'
          : '攻占失敗。\n格子：${v}\n武將：${gid}\n投入兵力：${commit}\n兵力損失約 20%（-${lossFail}）\n友好度：→ ${af}\n（武將體力 -15）';

      case FriendlyCityDevelopOutcome(ok, v, gid, pol, rpct, cg, ck, bef, aft):
        '城池格 ${v}\n'
        + '武將：${gid}（政治=${pol}）\n'
        + '成功率：約 ${rpct}%\n'
        + '消耗：城池金 -${cg}、城池糧 -${ck}、體力 -15\n'
        + (ok ? '城等級：${cityLvlZh(bef)} → ${cityLvlZh(aft)}' : '城等級：${cityLvlZh(bef)}（不變）');

      case RestStamina(gid, sb, sa, _, terr):
        terr ? '${gid} 體力：${sb} → ${sa}（+${sa - sb}，領地休整）' : '${gid} 體力：${sb} → ${sa}';

      case GeneralBatchRecruited(tile, lines, total):
        var parts = [for (x in lines) '${x.displayName}（${rarityZh(x.rarity)}）金 ${x.costGold}'];
        '武將格 ${tile}\n招募：\n- ${parts.join("\n- ")}\n\n總花費：金 ${total}';

      case ShopEquipmentPurchased(tile, gid, price, name, ty, rr, bst, bv, loy):
        '商店格 ${tile}\n購買：${name}（${equipTy(ty)}/${rarityZh(rr)}）\n'
        + '花費：金 ${price}\n裝備給：${gid}\n'
        + '效果：${statZh(bst)}+${bv}｜忠誠+${loy}';

      case JiCeCasterOutcome(_, phase, caster, pst, tier, _, rate, roll, cost, sb, sa, tgt, fx):
        var buf = new StringBuf();
        buf.add('階段：${phaseZh(phase)}\n');
        buf.add('施放武將：${caster}（體力 ${sb} → ${sa}，消耗 ${cost}）\n');
        buf.add(
          '成功率：約 ${pct(rate)}%（roll=${pct(roll)}%｜${statZh(pst)}｜消耗='
          + tierZh(tier)
          + "）\n"
        );
        if (tgt != null && tgt.length > 0)
          buf.add('目標：${tgt}\n');
        if (fx != null && fx.length > 0) {
          buf.add("效果：\n");
          for (x in fx)
            buf.add('- ${x}\n');
        }
        buf.toString();

      case JiCeTargetOutcome(_, atkMid, caster, fx):
        var buf = new StringBuf();
        buf.add('施放者：${atkMid}\n');
        buf.add('武將：${caster}\n');
        if (fx != null && fx.length > 0) {
          buf.add("影響：\n");
          for (x in fx)
            buf.add('- ${x}\n');
        }
        buf.toString();

      case GameRuleFeedback(code, detail):
        code != null ? '（${code}）\n${detail}' : detail;

      case UiCopy(key): uiCopyBody(key);
    };
  }

  static function flowAckBody(k:FlowAckKind):String {
    return switch k {
      case EmptyCityOccupyAborted: "未進駐空城。";
      case StagingAborted: "已取消暫存操作。";
      case VillageInteractionEnded: "已結束村落互動。";
      case VillageFriendlyVisitEnded: "已離開我方村落。";
      case FriendlyCityVisitEnded: "已離開我方城池。";
      case ResourceInteractionEndedWithoutBoost: "已結束資源格互動（不加成）。";
      case GeneralTileLeft: "已離開武將格。";
      case ShopTileLeft: "已離開商店格。";
    };
  }

  static function uiCopyBody(k:OutboxUiCopyKey):String {
    return switch k {
      case TestPage3JiCeIntro:
        "目標：測試策略（移動前/移動後）與計策暫存流程。\n\n"
        + "建議步驟：\n"
        + "1) 右側『Menu』→『本回合』→『策略（移動前）』：測試指定玩家/格子/武將類計策。\n"
        + "2) 點『移動』後（仍在落地前窗口）再用『策略（移動後）』：應只能指定『所站格子』。\n"
        + "3) 進入暫存後，可用『取消（返回）』退出 staging。\n";
      case TestPage4AiIntro:
        "目標：測試 aiSuggest + AI 自動操作是否能推進回合並收束。\n\n"
        + "本場四名君主皆為 AI 席位：載入選單後會自動排程 AiStep（無需手動按鈕）。\n"
        + "可觀察是否自動完成 Move→落地→互動→ConfirmDone 並輪轉四家。\n";
    };
  }

  static function statZh(s:GeneralStat):String {
    return switch s {
      case Command: "統御";
      case Might: "武力";
      case Wit: "智謀";
      case Stewardship: "政治";
    };
  }

  static function phaseZh(p:Null<StrategyPhase>):String {
    return switch p {
      case PreMove: "移動前";
      case PostMove: "移動後";
      case null: "（未知）";
    };
  }

  static function tierZh(t:StrategyCostTier):String {
    return switch t {
      case Low: "低";
      case Medium: "中";
      case High: "高";
    };
  }

  static function pct(v:Float):Int
    return Std.int(Math.floor(v * 100));

  static function cityLvlZh(l:CityLevel):String {
    return switch l {
      case Village: "村落";
      case SmallCity: "小城";
      case BigCity: "大城";
      case Capital: "都城";
    };
  }

  static function rarityZh(r:Rarity):String {
    return switch r {
      case Common: "普通";
      case Fine: "精良";
      case Epic: "史詩";
      case Legendary: "傳說";
    };
  }

  static function equipTy(t:EquipmentType):String {
    return switch t {
      case Weapon: "武器";
      case Armor: "防具";
      case TacticsBook: "兵法";
      case PoliticsBook: "政書";
    };
  }
}
