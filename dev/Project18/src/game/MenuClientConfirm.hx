package game;

/**
 * 選單條目若帶此結構，表示 UI 在呼叫 {@link IGameMatch#applyMenuLeaf} 前應先向玩家確認。
 * 賽局核心不負責顯示彈窗，只提供文案與語意。
 */
typedef MenuClientConfirm = {
  var title:String;
  var message:String;
};
