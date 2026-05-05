package game;

/**
 * View 可讀的彈窗訊息（由賽局在 apply 時寫入 outbox）。
 */
interface IPopupMessage {
  function id():String;
  function audience():PopupAudience;
  function title():String;
  function message():String;
  function option():PopupOption;
}

