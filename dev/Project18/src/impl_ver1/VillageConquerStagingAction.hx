package impl_ver1;

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
import game.PlayerMenuKind;

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
    var submit:IPlayerMenuEntry = match.createPlayerMenuEntry(PlayerMenuKind.StagingSubmit, "確認攻占", true, "conquer_ok");
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

    var picked:Array<String> = [];
    var commitTroops:Int = 0;
    for (w in menuNode.formWidgets())
      switch w {
        case GeneralMultiPick(_, _, sel):
          picked = sel.copy();
        case Slider(_, _, _, _, v):
          commitTroops = v;
        default:
      }
    if (commitTroops <= 0)
      throw "VillageConquerStagingAction: commitTroops must be > 0";

    var gid:Null<GeneralId> = null;
    var seen = new Map<String, Bool>();
    for (id in picked) {
      if (seen.exists(id))
        continue;
      seen.set(id, true);
      gid = id;
    }
    if (gid == null)
      throw "VillageConquerStagingAction: must pick a general";

    var gAtk:Null<General> = null;
    for (g in ruler.roster())
      if (g.id() == gid) {
        gAtk = cast g;
        break;
      }
    if (gAtk == null)
      throw "VillageConquerStagingAction: picked general not in roster";

    if (commitTroops > ruler.troops())
      throw "VillageConquerStagingAction: insufficient troops";

    var atkPower = attackPower(commitTroops, gAtk);
    var defPower = defenderPower();
    var win = atkPower > defPower;

    // 骨架結算：先用 deterministic（無隨機）勝負。
    if (win) {
      ruler.reduceTroops(commitTroops);
      ruler.grantGrain(100);
    } else {
      // 攻占失敗：投入士兵損失 20%
      var loss = Std.int(Math.floor(commitTroops * 0.2));
      ruler.reduceTroops(loss);
    }
    // 低消耗體力
    gAtk.forceSetStamina(Balance.clampInt(gAtk.stamina() - 15, 0, 100));
  }

  public function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow> {
    var ruler = cast(match.activeMonarch(), Monarch);
    var defP = defenderPower();
    var rows:Array<IJiCeStagingPreviewRow> = [];
    // 使用預設投入兵力（500 或目前兵力）
    var commit = Std.int(Math.min(500, ruler.troops()));
    if (commit <= 0)
      return [];
    for (g in ruler.roster()) {
      var atkP = attackPower(commit, cast g);
      var rate = (atkP / (atkP + defP)) * 100.0;
      var pct = Std.int(Math.floor(rate));
      rows.push(new SimpleStagingPreviewRow(g.id(), '投入 $commit 兵：預估勝率 ${pct}%', 0));
    }
    return rows;
  }

  static function attackPower(troops:Int, g:General):Float {
    var might = g.stat(Might) / 100.0;
    var cmd = g.stat(Command) / 100.0 * 0.5;
    var stamina = Balance.staminaModifier(g.stamina());
    return troops * (might + cmd) * stamina;
  }

  static function defenderPower():Float {
    // 骨架常數：村落守軍 + 中階防禦（之後接 friendly/level/守方武將）
    var defTroops = 800;
    var defMight = 0.55;
    var defCmd = 0.55 * 0.5;
    var stamina = 1.0;
    var city = Balance.cityDefenseBonus(CityLevel.Village);
    var friendly = Balance.friendlyModifier(50);
    return defTroops * (defMight + defCmd) * stamina * city * friendly;
  }
}

