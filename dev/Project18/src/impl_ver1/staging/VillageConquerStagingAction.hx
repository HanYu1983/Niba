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
import impl_ver1.rules.GeneralAssignmentOps;
import impl_ver1.rules.GeneralAssignmentApply;
import impl_ver1.rules.GeneralAssignmentKeys;
import impl_ver1.core.GameMatchCore;
import impl_ver1.model.Monarch;
import impl_ver1.model.General;
import impl_ver1.model.PlayerMenu;

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
    var defTroops = maxTroops > 0 ? Std.int(Math.min(500, maxTroops)) : 0;
    var conquerConfirm:MenuClientConfirm = {
      title: "確認攻占",
      message: "攻占會消耗兵力並影響武將體力，勝負依目前規剘結算。\n確定要攻占嗎？",
    };
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認攻占", true, "conquer_ok", conquerConfirm);
    var widgets:Array<MenuFormWidget> = [
      GeneralMultiPick("選擇攻占武將（單選）", choices, defSel),
      Slider("投入士兵數", 0, maxTroops, 1, defTroops),
      Button(submit),
    ];
    var node = match.createPlayerMenuNode("攻占", null, [], widgets);
    return new PlayerMenu(actor, actor.monarchId() + "-village-conquer", [node]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    var ruler = cast(match.activeMonarch(), Monarch);
    if (actor.monarchId() != ruler.id())
      throw "VillageConquerStagingAction: actor must be active monarch";
    var vIdx = match.forceGetPendingVillageTile();
    if (vIdx == null)
      throw "VillageConquerStagingAction: no pendingVillage";

    var commitTroops:Int = 0;
    for (w in menuNode.formWidgets())
      switch w {
        case Slider(_, _, _, _, v):
          commitTroops = v;
        default:
      }
    if (commitTroops <= 0)
      throw "VillageConquerStagingAction: commitTroops must be > 0";

    var gid = GeneralAssignmentApply.pickSingleGeneralId(menuNode.formWidgets());
    var gAtk = GeneralAssignmentApply.requireOwnedGeneral(ruler, gid);

    if (commitTroops > ruler.troops())
      throw "VillageConquerStagingAction: insufficient troops";

    var atkPower = attackPower(commitTroops, gAtk);
    var defPower = defenderPower(vIdx, ruler.id());
    var win = atkPower > defPower;

    // 骨架結算：先用 deterministic（無隨機）勝負。
    if (win) {
      ruler.reduceTroops(commitTroops);
      ruler.grantGrain(100);
      // GDD 2.1.3：攻占成功後友好度重置為 50（中立），並成為領地（每回合產出）
      match.forceSetVillageFriendly(vIdx, ruler.id(), 50);
      match.forceSetVillageOwner(vIdx, ruler.id());
    } else {
      // 攻占失敗：投入士兵損失 20%
      var loss = Std.int(Math.floor(commitTroops * 0.2));
      ruler.reduceTroops(loss);
      // GDD 2.1.3：攻占失敗後友好度 -10
      var prevF = match.forceGetVillageFriendly(vIdx, ruler.id());
      match.forceSetVillageFriendly(vIdx, ruler.id(), Balance.clampInt(prevF - 10, 0, 100));
    }
    // 低消耗體力
    GeneralAssignmentApply.applyStaminaCost(gAtk, 15);

    var afterF = match.forceGetVillageFriendly(vIdx, ruler.id());
    var body = win
      ? '攻占成功。\n格子：${vIdx}\n武將：${gid}\n投入兵力：${commitTroops}\n獲得：糧食 +100\n友好度：→ ${afterF}（重置）\n領地：已占領（每回合產出）\n（武將體力 -15）'
      : '攻占失敗。\n格子：${vIdx}\n武將：${gid}\n投入兵力：${commitTroops}\n兵力損失約 20%\n友好度：→ ${afterF}\n（武將體力 -15）';
    match.pushInfoPopup(ruler.id(), win ? "攻占成功" : "攻占失敗", game.PopupPayload.Plain(body), "village-conquer");
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
    var defTroops = 800;
    var defMight = 0.55;
    var defCmd = 0.55 * 0.5;
    var stamina = 1.0;
    var city = Balance.cityDefenseBonus(CityLevel.Village);
    // friendlyModifier：friendly 越低倍率越高；因此可直接套用
    var f = match.forceGetVillageFriendly(vIdx, attackerId);
    var friendly = Balance.friendlyModifier(f);
    return defTroops * (defMight + defCmd) * stamina * city * friendly;
  }
}

