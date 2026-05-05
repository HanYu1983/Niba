package game;

/**
 * 彈窗內容（結構化載荷）。
 * 後續可擴充：例如裝備獲得、結算摘要等多型資料。
 */
enum PopupPayload {
  /** 純文字正文（對應原 message 字串）。 */
  Plain(text:String);
}
