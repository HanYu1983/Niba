package game;

/**
 * GDD／架構：全域辨識型別。
 * 僅約定語意，不由本層賦予實作。
 */

/** 君主（玩家席位）於一局中的穩定辨識。 */
typedef MonarchId = String;

/** 武將實體於君主麾下之辨識。 */
typedef GeneralId = String;

/** 環狀棋盤格之離散索引（由零或由一起算由規剘另行約定）。 */
typedef TileIndex = Int;

/** 關卡／劇本組態鍵（由 IGame.createGameMatch 傳入）。 */
typedef LevelKey = String;

/** 計策類型資料鍵（對應 IJiCe.registryKey／資料表 id）。 */
typedef JiCeKey = String;

/** 裝備實體辨識（可對應資料表 id + 生成序號）。 */
typedef EquipmentId = String;
