package game;

import game.GameIds;

/**
 * GDD：主選單單一列；caption 為當下語境之純展示字串（實作可再套 i18n）。
 * isEnabled==false 時仍可列示，用於「存在但暫不可用」之教學／灰階 UX。
 */
interface IPlayerMenuEntry {
    function kind():PlayerMenuKind;

    function caption():String;

    /** 當前賽局狀態下是否允許進入該分支。 */
    function isEnabled():Bool;

    /**
     * 此 entry 的「責任者」（應由哪位君主按下/送出 apply）。
     * - 多數情況下等同目前建立 menu 的 actor。
     * - 多方互動（例如敵城對峙）可用於 UI 判斷是否應自動 AiStep 或提示等待另一席位處理。
     */
    function responsibleMonarchId():Null<MonarchId>;

    /** 機械選項鍵；非選項類葉為 null。 */
    function decisionToken():Null<String>;

    /**
     * 若非 null，View 應在送出 {@code applyMenuLeaf} 前先顯示確認（取消則不 apply、不改賽局）。
     */
    function clientConfirm():Null<MenuClientConfirm>;
}
