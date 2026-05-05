package impl_ver1;

import game.GameIds;
import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.MenuActivation;
import game.MenuFormWidget;
import game.MenuFormWidget.Button;
import game.PlayerMenuKind;
import game.PlayerMenuKind.StagingSubmit;
/**
 * 路障計策：於打出者當前兵棋格設障；{@link RoadblockMovementHook} 僅阻斷非放置者之逐步移動落地。
 */
class RoadblockJiCe implements IJiCe {
  public static inline var REGISTRY_KEY = "jice_roadblock";
  public static inline var DESIGN_LABEL = "路障";

  var gameMatch:GameMatchCore;

  public function new(gameMatch:GameMatchCore) {
    this.gameMatch = gameMatch;
  }

  public function designLabel():String
    return DESIGN_LABEL;

  public function registryKey():String
    return REGISTRY_KEY;

  public function buildPlayerMenu(actor:IPlayer):IPlayerMenu {
    var submitLeaf = gameMatch.createPlayerMenuEntry(StagingSubmit, "確認於當前格設置路障", true, "confirm_roadblock");
    var root = gameMatch.createPlayerMenuNode("路障", null, ([] : Array<IPlayerMenuNode>), [Button(submitLeaf)]);
    return new PlayerMenu(actor, "jice-" + registryKey(), [root]);
  }

  public function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void {
    if (!gameMatch.stagingMatchesJiCe(this))
      throw "RoadblockJiCe.resolveChoice: pending staging mismatch";
    if (MenuActivation.activatingEntry(menuNode).kind() != StagingSubmit)
      throw "RoadblockJiCe.resolveChoice: 預期 StagingSubmit";

    var ruler = cast(gameMatch.activeMonarch(), Monarch);
    var tile = ruler.pawnIndex();
    var placer = actor.monarchId();
    gameMatch.forceRegisterMovementStepHook(new RoadblockMovementHook(tile, placer));
  }

  static function __init__():Void {
    JiCeRegistry.register(REGISTRY_KEY, function(m:GameMatchCore) return new RoadblockJiCe(m));
  }
}
