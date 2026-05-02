package game;

import game.GameIds;

/**
 * 計策「選將前」預計算列：供 UI 展示與二次選單；實際結算須與 predictedTroopLoss 一致。
 */
interface IJiCeStagingPreviewRow {
    function generalId():GeneralId;

    /** 人讀說明（可含數值摘要）。 */
    function outcomeDescription():String;

    /** 與選定後 apply 時對守方兵力之折損量（整數刻度）一致。 */
    function predictedTroopLoss():Int;
}
