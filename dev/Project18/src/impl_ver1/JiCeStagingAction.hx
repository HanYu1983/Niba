package impl_ver1;

import game.IJiCe;
import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IStagingAction;

/** 把 {@link IJiCe} 包成通用 staging action。 */
class JiCeStagingAction implements IStagingAction {
  public final card:IJiCe;

  public function new(card:IJiCe) {
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

  public function asJiCe():Null<IJiCe>
    return card;
}

