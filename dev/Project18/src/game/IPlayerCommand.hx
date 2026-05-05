package game;

import game.IPlayer;
import game.IPlayerMenuNode;

/**
 * 「玩家指令」抽象：可生成選單節點，並在 apply 時處理結算或進入 staging。
 * 目標：讓不同指令（選兵/選將/免輸入）都能用一致形狀被註冊與派發。
 */
interface IPlayerCommand {
  function kind():PlayerMenuKind;
  function designLabel():String;

  /**
   * 回傳要掛在「本回合」下的節點；若此回合不應出現則回傳 null。
   * enabled/disabled 由實作決定（回傳 node.leaf().isEnabled 或表單 Button）。
   */
  function buildActionNode(actor:IPlayer):Null<IPlayerMenuNode>;

  /** applyMenuLeaf 時處理該 kind。 */
  function apply(actor:IPlayer, menuNode:IPlayerMenuNode):Void;
}

