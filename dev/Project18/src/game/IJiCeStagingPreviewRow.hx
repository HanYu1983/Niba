package game;

import game.GameIds;

/**
 * 「選將前」預計算列：計策暫存與格子事件暫存共用；供 UI 展示與二次選單。
 * 計策對守方折兵時 {@link #predictedTroopLoss} 須與結算一致；事件等非折兵語意可填 0，細節見文案。
 */
interface IJiCeStagingPreviewRow {
    function generalId():GeneralId;

    /** 人讀說明（可含數值摘要）。 */
    function outcomeDescription():String;

    /** 與選定後 apply 時對守方兵力之折損量（整數刻度）一致。 */
    function predictedTroopLoss():Int;
}
