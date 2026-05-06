package impl_ver1.staging;

import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.IJiCeStagingPreviewRow;
import game.GeneralStat;
import game.GameIds;
import game.StrategyCostTier;
import game.Balance;
import impl_ver1.staging.SimpleStagingPreviewRow;
import impl_ver1.core.GameMatchCore;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.jice.LuoshiJiCe;
import impl_ver1.jice.DissensionJiCe;
import impl_ver1.jice.RaidJiCe;
import impl_ver1.jice.RumorJiCe;
import impl_ver1.jice.ConscriptionJiCe;
import impl_ver1.jice.InspireJiCe;
import impl_ver1.jice.EncourageJiCe;
import impl_ver1.jice.HealJiCe;
import impl_ver1.jice.AwakenJiCe;
import impl_ver1.jice.FireJiCe;
import impl_ver1.jice.SabotageJiCe;
import impl_ver1.jice.FarmJiCe;
import impl_ver1.jice.TradeRouteJiCe;
import impl_ver1.jice.FortifyJiCe;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;

/** 把 {@link IJiCe} 包成通用 staging action。 */
class JiCeStagingAction implements IStagingAction {
  final match:GameMatchCore;
  public final card:IJiCe;

  public function new(match:GameMatchCore, card:IJiCe) {
    this.match = match;
    this.card = card;
  }

  public function designLabel():String
    return card.designLabel();

  public function registryKey():String
    return "jice:" + card.registryKey();

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu
    return card.buildPlayerMenu(actor);

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void
    card.resolveChoice(actor, menuNode);

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    // 計策預覽列骨架：先以「成功率」做通用預覽，再逐步補充各牌的特殊預估（如折兵）。
    if (Std.isOfType(card, LuoshiJiCe)) {
      var atk = cast(match.activeMonarch(), Monarch);
      var tid:Null<MonarchId> = null;
      for (m in match.monarchs())
        if (m.id() != actor.monarchId()) {
          tid = m.id();
          break;
        }
      if (tid == null)
        return [];
      var defTroops = cast(match.monarchById(tid), Monarch).troops();

      var rows:Array<IJiCeStagingPreviewRow> = [];
      for (g in atk.roster()) {
        var might = cast(g, General).stat(Might);
        var loss = LuoshiJiCe.previewTroopLoss(defTroops, might);
        rows.push(new SimpleStagingPreviewRow(g.id(), '預估折兵 $loss', loss));
      }
      return rows;
    }

    // 其餘計策：成功率預覽（依各牌 resolveChoice 使用之 stat/tier）
    if (Std.isOfType(card, DissensionJiCe))
      return previewRateRows(Wit, StrategyCostTier.Medium, "成功率（離間）");
    if (Std.isOfType(card, RumorJiCe))
      return previewRateRows(Wit, StrategyCostTier.Medium, "成功率（流言）");
    if (Std.isOfType(card, RaidJiCe))
      return previewRateRows(Might, StrategyCostTier.High, "成功率（急襲）");
    if (Std.isOfType(card, ConscriptionJiCe))
      return previewRateRows(Command, StrategyCostTier.Medium, "成功率（徵兵）");

    if (Std.isOfType(card, InspireJiCe))
      return previewRateRows(Command, StrategyCostTier.Medium, "成功率（鼓舞）");
    if (Std.isOfType(card, EncourageJiCe))
      return previewRateRows(Command, StrategyCostTier.Low, "成功率（激勵）");
    if (Std.isOfType(card, HealJiCe))
      return previewRateRows(Wit, StrategyCostTier.High, "成功率（療傷）");
    if (Std.isOfType(card, AwakenJiCe))
      return previewRateRows(Wit, StrategyCostTier.High, "成功率（覺醒）");

    if (Std.isOfType(card, FireJiCe))
      return previewRateRows(Wit, StrategyCostTier.Medium, "成功率（火計）");
    if (Std.isOfType(card, SabotageJiCe))
      return previewRateRows(Wit, StrategyCostTier.High, "成功率（破壞）");
    if (Std.isOfType(card, FarmJiCe))
      return previewRateRows(Stewardship, StrategyCostTier.Low, "成功率（屯田）");
    if (Std.isOfType(card, TradeRouteJiCe))
      return previewRateRows(Stewardship, StrategyCostTier.Low, "成功率（商路）");
    if (Std.isOfType(card, FortifyJiCe))
      return previewRateRows(Stewardship, StrategyCostTier.Medium, "成功率（築城）");

    return [];
  }

  function previewRateRows(stat:GeneralStat, tier:StrategyCostTier, label:String):Array<IJiCeStagingPreviewRow> {
    var atk = cast(match.activeMonarch(), Monarch);
    var rows:Array<IJiCeStagingPreviewRow> = [];
    var cost = Balance.strategyStaminaCost(tier);
    var previews = GeneralAssignmentOps.previewForRoster(
      registryKey(),
      atk.roster(),
      stat,
      cost,
      tier,
      (_, rate) -> '$label：${Std.int(Math.floor(rate * 100))}%｜體力消耗 $cost'
    );
    for (p in previews)
      rows.push(new SimpleStagingPreviewRow(p.generalId, p.summary, 0));
    return rows;
  }

  public function asJiCe():Null<IJiCe>
    return card;
}

