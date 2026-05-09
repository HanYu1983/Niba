package impl_ver1.staging;

import game.Balance;
import game.CityLevel;
import game.GameIds;
import game.GeneralStat;
import game.IJiCeStagingPreviewRow;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;
import game.IStagingAction;
import game.MenuFormWidget;
import game.MenuClientConfirm;
import game.PlayerMenuKind;
import game.PopupPayload;
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;
import game.GameError;
import impl_ver1.util.Deterministic;
import game.MenuActivation;
import impl_ver1.jice.JiCeMenuSig;

/**
 * 村落攻占（示範）：選一名武將 + 選擇投入士兵數（slider）→ 顯示勝率 → 確認提交。
 * - 勝率預估公式參考 docs/數值算法.md 3.4（無隨機）
 * - 防守方數值目前用骨架常數；之後接村落/城池模型再替換。
 */
class VillageConquerStagingAction implements IStagingAction {
  final match:GameMatchCore;

  public function new(match:GameMatchCore) {
    this.match = match;
  }

  public function designLabel():String
    return "村落：攻占";

  public function registryKey():String
    return "village_conquer";

  public function asJiCe():Null<game.IJiCe>
    return null;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var ruler = cast(match.activeMonarch(), Monarch);
    var choices:Array<game.MenuGeneralChoice> = [];
    var defSel:Array<String> = [];
    for (g in ruler.roster()) {
      var gid = g.id();
      choices.push({generalId: gid, caption: gid});
      if (defSel.length == 0)
        defSel.push(gid);
    }
    var maxTroops = ruler.troops();
    // 強語意：只要 submit enabled，使用者在 widget 約束內提交就不應因兵力=0被拒絕
    var sliderMin = maxTroops > 0 ? 1 : 0;
    var sliderMax = maxTroops;
    var defTroops = maxTroops > 0 ? Std.int(Math.min(500, maxTroops)) : 0;
    var conquerConfirm:MenuClientConfirm = {
      title: "確認攻占",
      message: "攻占會消耗兵力並影響武將體力，勝負依目前規剘結算。\n確定要攻占嗎？",
    };
    // menu 建構端先做合法性：需有 pending village、至少 1 名武將、且投入兵力預設值 > 0
    var vIdx = match.forceGetPendingVillageTile();
    var enabled = vIdx != null && choices.length > 0 && defTroops > 0 && maxTroops > 0;
    var sig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (vIdx != null ? Std.string(vIdx) : "null"),
      "generals=" + choices.map(c -> c.generalId).join(","),
      "maxTroops=" + Std.string(maxTroops),
    ]);
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認攻占", enabled, JiCeMenuSig.attach("conquer_ok", sig), conquerConfirm);
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇攻占武將（單選）", choices, defSel),
      Slider("投入士兵數", sliderMin, sliderMax, 1, defTroops),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("攻占", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-village-conquer", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw new GameError("目前不是你的回合，無法攻占。", "操作失敗", "village-conquer/actor");
    var token = MenuActivation.activatingEntry(menuNode).decisionToken();
    var gotSig = JiCeMenuSig.parseSig(token);
    var vIdx = match.forceGetPendingVillageTile();
    var nowChoices:Array<game.MenuGeneralChoice> = [];
    for (g in ruler.roster())
      nowChoices.push({generalId: g.id(), caption: g.id()});
    var nowMaxTroops = ruler.troops();
    var nowSig = JiCeMenuSig.make([
      registryKey(),
      "pending=" + (vIdx != null ? Std.string(vIdx) : "null"),
      "generals=" + nowChoices.map(c -> c.generalId).join(","),
      "maxTroops=" + Std.string(nowMaxTroops),
    ]);
    var sigMismatch = (gotSig != null && gotSig != nowSig);
    if (vIdx == null) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新開啟村落攻占。", "village-conquer/state-changed");
      throw "VillageConquerStagingAction: pending missing (sig matched) — menu/widget mismatch";
    }

    var commitTroops:Int = 0;
    for (w in menuNode.formWidgets())
      switch w {
        case Slider(_, _, _, _, v):
          commitTroops = v;
        default:
      }
    if (commitTroops <= 0 || commitTroops > nowMaxTroops) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，投入兵力已不合法。", "village-conquer/state-changed");
      throw "VillageConquerStagingAction: invalid-troops (sig matched) — menu/widget mismatch";
    }

    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var gOk = false;
    for (c in nowChoices)
      if (c.generalId == gid) {
        gOk = true;
        break;
      }
    if (!gOk) {
      if (sigMismatch)
        throw JiCeMenuSig.stateChangedError("狀態已變更，請重新選擇攻占武將。", "village-conquer/state-changed");
      throw "VillageConquerStagingAction: invalid-choice (sig matched) — menu/widget mismatch";
    }
    var gAtk = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);
    // commitTroops 已以 nowMaxTroops 檢查

    var atkPower = attackPower(commitTroops, gAtk);
    var defPower = defenderPower(vIdx, ruler.id());
    // docs/數值算法.md 3.2：雙方皆帶 0.85~1.15 隨機係數（勝負用；預覽不含隨機）
    var rSeed = 'village_conquer|t=${vIdx}|r=${match.roundNumber()}|m=${ruler.id()}|g=${gid}|troops=${commitTroops}';
    var atkRand = 0.85 + Deterministic.hash01(rSeed + "|atk") * 0.30;
    var defRand = 0.85 + Deterministic.hash01(rSeed + "|def") * 0.30;
    var win = (atkPower * atkRand) > (defPower * defRand);
    var lootGold = 0;
    var lootGrain = 0;
    var lootTroops = 0;
    var troopLossOnFail = 0;

    // 結算對齊（最小版）：
    // - docs/數值算法.md 3.2：加入 0.85~1.15 隨機係數（可重現）
    // - docs/數值算法.md 5.3：守軍友好度修正採 0.5
    // - docs/數值算法.md 3.3：攻占成功掠奪部分資源（ver1：村落儲備的 30%）
    if (win) {
      // docs/數值算法.md §10.1：攻占成功 → 功績 +20
      gAtk.grantMerit(20);
      // docs/數值算法.md 7.1：攻占成功 → 聲望 -3
      ruler.reducePrestige(3);

      ruler.reduceTroops(commitTroops);
      // 掠奪村落儲備資源 30%（四捨五入到整數）；剩餘留在領地庫
      var prevGold = match.forceGetVillageStoredGold(vIdx);
      var prevGrain = match.forceGetVillageStoredGrain(vIdx);
      var prevTroops = match.forceGetVillageStoredTroops(vIdx);
      lootGold = Std.int(Math.floor(prevGold * 0.30));
      lootGrain = Std.int(Math.floor(prevGrain * 0.30));
      lootTroops = Std.int(Math.floor(prevTroops * 0.30));
      if (lootGold > 0)
        ruler.grantGold(lootGold);
      if (lootGrain > 0)
        ruler.grantGrain(lootGrain);
      if (lootTroops > 0)
        ruler.grantTroops(lootTroops);
      match.forcePutVillageStores(vIdx, prevTroops - lootTroops, prevGrain - lootGrain, prevGold - lootGold);
      // GDD 2.1.3：攻占成功後友好度重置為 50（中立），並成為領地（每回合產出）
      match.forceSetVillageFriendly(vIdx, ruler.id(), 50);
      match.forceSetVillageOwner(vIdx, ruler.id());
    } else {
      // 攻占失敗：投入士兵損失 20%
      troopLossOnFail = Std.int(Math.floor(commitTroops * 0.2));
      ruler.reduceTroops(troopLossOnFail);
      // GDD 2.1.3：攻占失敗後友好度 -10
      var prevF = match.forceGetVillageFriendly(vIdx, ruler.id());
      match.forceSetVillageFriendly(vIdx, ruler.id(), Balance.clampInt(prevF - 10, 0, 100));
    }
    // 低消耗體力
    GeneralAssignmentApply.applyStaminaCost(gAtk, 15);

    var afterF = match.forceGetVillageFriendly(vIdx, ruler.id());
    match.pushOutboxPlain(
      ruler.id(),
      win ? "攻占成功" : "攻占失敗",
      PopupPayload.VillageConquerOutcome(win, vIdx, gid, commitTroops, afterF, lootGold, lootGrain, lootTroops, troopLossOnFail),
      "village-conquer"
    );
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var vIdx = match.forceGetPendingVillageTile();
    if (vIdx == null)
      return [];
    var defP = defenderPower(vIdx, ruler.id());
    var rows:Array<IJiCeStagingPreviewRow> = [];
    // 使用預設投入兵力（500 或目前兵力）
    var commit = Std.int(Math.min(500, ruler.troops()));
    if (commit <= 0)
      return [];
    var previews = GeneralAssignmentOps.previewForRosterWithRate(
      GeneralAssignmentKeys.VillageConquer,
      ruler.roster(),
      Might,
      15,
      g -> {
        var atkP = attackPower(commit, cast g);
        return (atkP / (atkP + defP)); // 0..1
      },
      (_, rate) -> '投入 $commit 兵：預估勝率 ${Std.int(Math.floor(rate * 100))}%'
    );
    for (p in previews)
      rows.push(new SimpleStagingPreviewRow(p.generalId, p.summary, 0));
    return rows;
  }

  static function attackPower(troops:Int, g:General):Float {
    var might = g.stat(Might) / 100.0;
    var cmd = g.stat(Command) / 100.0 * 0.5;
    var stamina = Balance.staminaModifier(g.stamina());
    return troops * (might + cmd) * stamina;
  }

  function defenderPower(vIdx:TileIndex, attackerId:MonarchId):Float {
    // GDD 2.1.3：友好度越高，守軍戰鬥力越低
    // docs/數值算法.md 5.3：守軍戰力 = (100 + 城池等級×50) × 友好度修正(0.5) × 隨機係數
    // ver1：把「守軍戰力」映射到本模組的同形公式：以 defTroops 表示基礎守軍量，再乘 friendly 修正。
    var lvl = match.forceGetVillageLevel(vIdx);
    var n = switch lvl {
      case Village: 1;
      case SmallCity: 2;
      case BigCity: 3;
      case Capital: 4;
    };
    var defTroops = 100 + (n * 50);
    var defMight = 0.55;
    var defCmd = 0.55 * 0.5;
    var stamina = 1.0;
    var city = Balance.cityDefenseBonus(CityLevel.Village);
    // friendlyModifier：friendly 越低倍率越高；因此可直接套用
    var f = match.forceGetVillageFriendly(vIdx, attackerId);
    // docs/數值算法.md 5.3：友好度修正係數為 0.5（與城池攻占的 0.3 不同）
    var friendly = 1.0 + (100 - f) / 100.0 * 0.5;
    return defTroops * (defMight + defCmd) * stamina * city * friendly;
  }
}

