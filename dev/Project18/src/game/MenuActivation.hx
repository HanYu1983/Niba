package game;

/**
 * 表單節點送出時如何對應到「動作葉」：優先 {@link IPlayerMenuNode#activationEntry}（同節點多按鈕），否則 {@link IPlayerMenuNode#leaf}。
 */
class MenuActivation {
  public static function activatingEntry(node:IPlayerMenuNode):IPlayerMenuEntry {
    var a = node.activationEntry();
    if (a != null)
      return a;
    var L = node.leaf();
    if (L == null)
      throw "MenuActivation: 節點須設 activationEntry（表單多按鈕）或具 leaf（單葉節點）";
    return L;
  }
}
