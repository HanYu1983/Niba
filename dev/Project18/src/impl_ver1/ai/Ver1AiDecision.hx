package impl_ver1.ai;

import game.IPlayerMenuEntry;
import game.IPlayerMenuNode;

typedef Ver1AiDecision = {
  /** 要 apply 的節點（leaf 或表單節點）。 */
  var node:IPlayerMenuNode;
  /** 若為表單內 Button 需指定 activationEntry；否則可用 leaf。 */
  var activationEntry:Null<IPlayerMenuEntry>;
  /** 表單填值修補（可空）。 */
  var widgetPatches:Array<Ver1AiWidgetPatch>;
}

enum Ver1AiWidgetPatch {
  SetSlider(widgetIndex:Int, value:Int);
  SetGeneralMultiPick(widgetIndex:Int, ids:Array<String>);
  SetMonarchSinglePick(widgetIndex:Int, ids:Array<String>);
  SetTileSinglePick(widgetIndex:Int, idxs:Array<Int>);
}

