package game;

import game.GameIds;

/**
 * GDD：玩家（操作者席位）與賽局實體之橋接。
 * 四名玩家各對應一枚君主；本介面承載輸入綁定、人類可讀名等 UI 側關切，不取代 IMonarch 的狀態權威。
 */
interface IPlayer {
    /** 與君主主鍵一致；尚未經 IGameMatch.linkPlayerToMonarch 綁定時可為空字串。 */
    function monarchId():MonarchId;

    /**
     * 顯示名（可本地化）；與君主劇本稱號分層，避免與規剘 ID 混淆。
     */
    function displayName():String;

    /** UI/控制器語意：是否由 AI 控制（不改變規則，僅影響自動操作與顯示）。 */
    function isAi():Bool;
}
