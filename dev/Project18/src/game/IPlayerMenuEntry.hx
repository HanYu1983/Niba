package game;

/**
 * GDD：主選單單一列；caption 為當下語境之純展示字串（實作可再套 i18n）。
 * isEnabled==false 時仍可列示，用於「存在但暫不可用」之教學／灰階 UX。
 */
interface IPlayerMenuEntry {
    function kind():PlayerMenuKind;

    function caption():String;

    /** 當前賽局狀態下是否允許進入該分支。 */
    function isEnabled():Bool;

    /** 機械選項鍵（例如 ITileEvent.resolveChoice 之 choiceId）；非選項類葉為 null。 */
    function decisionToken():Null<String>;
}
