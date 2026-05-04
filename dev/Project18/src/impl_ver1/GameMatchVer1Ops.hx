package impl_ver1;

import game.GameIds;
import game.IPlayer;
import game.IPlayerMenuNode;

/**
 * Ver1 規剘：終局、移動落地後之城池分流、進駐／調度資源流動、敵城對峙結算文案與戰果套用。
 * {@link GameMatchCore} 保留選單／pending 邊界校驗與狀態旗標；具體數值規剘在此擴充。
 */
class GameMatchVer1Ops {
  public static function evaluateTermination(m:GameMatchCore):Void {}

  public static function applyMenuLeafForMove(m:GameMatchCore, actor:IPlayer):Void {
    var ruler = cast(m.activeMonarch(), Monarch);
    ruler.advanceOnBoard(GameMatchCore.DEFAULT_MOVE_DELTA, m.board().length());
    m.settleAfterMoveLanding();
  }

  /** 君主踩中 {@link game.TileKind.City} 後，依屬主／空城／駐軍決定 pending 種類（骨架狀態寫入）。 */
  public static function considerLandingAtCityTile(m:GameMatchCore, idx:TileIndex):Void {
    if (m._cityOwner.exists(idx) && m._cityOwner.get(idx) == m.activeMonarch().id())
      m._pendingFriendlyCityTileIndex = idx;
    else if (m._cityOwner.exists(idx) && !m.cityVacantNoGarrison(idx))
      enterHostileCityConfrontationState(m, idx);
    else if (m.cityVacantNoGarrison(idx))
      m._pendingEmptyCityTileIndex = idx;
  }

  static function enterHostileCityConfrontationState(m:GameMatchCore, idx:TileIndex):Void {
    if (!m._cityOwner.exists(idx))
      throw "GameMatchVer1Ops.enterHostileCityConfrontationState: city has no owner";
    m._pendingHostileCityTileIndex = idx;
    m._hostileCityPhase = AttackerChoosing;
    m._hostileCityAttackerId = m.activeMonarch().id();
    m._hostileCityDefenderId = m._cityOwner.get(idx);
    m._hostileCityAwaitingDuel = false;
    m._hostileCityAttackerChoiceToken = "";
    m._hostileCityAttackerGeneralIds = [];
    m._hostileCityDefenderGeneralId = null;
    m._hostileCitySettlementSummary = "";
  }

  /** 我方城池調度表單：城池現狀、君主池上限與預設滑桿位置（規剘可改上限語意）。 */
  public static function friendlyCityDispatchSliderDefaults(m:GameMatchCore, tileIndex:TileIndex, ruler:Monarch):{
    cityTroop:Int,
    cityGrain:Int,
    maxTroopSlider:Int,
    maxGrainSlider:Int,
    defTroop:Int,
    defGrain:Int,
  } {
    var cityTroop = m.forceGetCityStoredTroops(tileIndex);
    var cityGrain = m.forceGetCityStoredGrain(tileIndex);
    var maxTroopSlider = ruler.troops();
    var maxGrainSlider = ruler.grain();
    return {
      cityTroop: cityTroop,
      cityGrain: cityGrain,
      maxTroopSlider: maxTroopSlider,
      maxGrainSlider: maxGrainSlider,
      defTroop: clampInt(cityTroop, 0, maxTroopSlider),
      defGrain: clampInt(cityGrain, 0, maxGrainSlider),
    };
  }

  /**
   * 空城進駐確認：自君主池扣除並累計至城池儲備，設置屬主與駐軍列表。
   * 呼叫前 {@link GameMatchCore} 應已完成表單解析與資源邊界 assert。
   */
  public static function applyEmptyCityOccupySubmit(
    m:GameMatchCore,
    tileIndex:TileIndex,
    ruler:Monarch,
    troops:Int,
    grain:Int,
    garrisonIds:Array<GeneralId>
  ):Void {
    ruler.reduceTroops(troops);
    ruler.reduceGrain(grain);
    var prevT = m._cityStockTroops.exists(tileIndex) ? m._cityStockTroops.get(tileIndex) : 0;
    var prevG = m._cityStockGrain.exists(tileIndex) ? m._cityStockGrain.get(tileIndex) : 0;
    m._cityStockTroops.set(tileIndex, prevT + troops);
    m._cityStockGrain.set(tileIndex, prevG + grain);
    m._cityOwner.set(tileIndex, ruler.id());
    m._cityGarrisonGenerals.set(tileIndex, garrisonIds.copy());
  }

  /** 進駐取消：無資源效果（預留未來紀錄／統計）。 */
  public static function onEmptyCityOccupyAbort(m:GameMatchCore):Void {}

  /**
   * 我方城池調度：城池兵力／糧食目標與君主池同步（差額進出）。
   */
  public static function applyFriendlyCityDispatch(
    m:GameMatchCore,
    tileIndex:TileIndex,
    ruler:Monarch,
    targetTroops:Int,
    targetGrain:Int
  ):Void {
    var oldT = m.forceGetCityStoredTroops(tileIndex);
    var oldG = m.forceGetCityStoredGrain(tileIndex);
    var dT = targetTroops - oldT;
    var dG = targetGrain - oldG;
    if (dT > 0)
      ruler.reduceTroops(dT);
    else if (dT < 0)
      ruler.grantTroops(-dT);
    if (dG > 0)
      ruler.reduceGrain(dG);
    else if (dG < 0)
      ruler.grantGrain(-dG);
    m._cityStockTroops.set(tileIndex, targetTroops);
    m._cityStockGrain.set(tileIndex, targetGrain);
  }

  /** 結束拜訪城池（預留事件／音效鉤子）。 */
  public static function onFriendlyCityVisitEnd(m:GameMatchCore):Void {}

  /** 攻方敵城選項已確認（過路費試算、談判旗標等可在此擴充）。 */
  public static function onHostileCityAttackerConfirmed(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /** 依暫存旗標組攻方可見結算摘要（文案／數值預覽）。 */
  public static function computeHostileCitySettlementSummary(m:GameMatchCore):String {
    var tileIdx = m._pendingHostileCityTileIndex != null ? m._pendingHostileCityTileIndex : -1;
    var tok = m._hostileCityAttackerChoiceToken;
    var atkG = m._hostileCityAttackerGeneralIds.length > 0 ? m._hostileCityAttackerGeneralIds[0] : "(無)";
    switch tok {
      case "pay_toll":
        return '結算：過路費已付｜城池格 $tileIdx';
      case "negotiate":
        return '結算：談判（攻將 $atkG）｜協議草案已備';
      case "attrition":
        return '結算：消耗戰（攻將 $atkG）｜損耗預估完成';
      case "siege":
        return '結算：攻城戰（攻將 $atkG）｜城防推演完成';
      case "duel":
        var defG = m._hostileCityDefenderGeneralId != null ? m._hostileCityDefenderGeneralId : "?";
        return '結算：單挑（攻將 $atkG vs 守將 $defG）｜勝負已裁定';
      default:
        throw 'GameMatchVer1Ops.computeHostileCitySettlementSummary: 未知選項 $tok';
    }
  }

  /** 守方非單挑確認後鉤子（士氣／AI 反應等）。 */
  public static function onHostileCityDefenderAck(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /** 守方單挑應戰武將確定後鉤子（決鬥預覽数值）。 */
  public static function onHostileCityDefenderDuelPickConfirmed(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  /** 攻方確認結算後套用實際戰果（扣糧、易主、駐軍損耗等）；呼叫時仍可讀 pending 暫存。 */
  public static function applyHostileCitySettlementAck(m:GameMatchCore, actor:IPlayer, menuNode:IPlayerMenuNode):Void {}

  static function clampInt(v:Int, lo:Int, hi:Int):Int {
    if (v < lo)
      return lo;
    if (v > hi)
      return hi;
    return v;
  }
}
