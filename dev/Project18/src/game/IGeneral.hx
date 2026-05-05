package game;

import game.GameIds;
import game.Rarity;

/**
 * GDD：武將為君主麾下之可指派單位；四維數值為規剘共用度量。
 */
interface IGeneral {
    /** 於君主麾下唯一。 */
    function id():GeneralId;

    /** 所屬君主。 */
    function owner():MonarchId;

    /**
     * 讀取指定維度之當前強度。
     * 暫時增益／賽場修正是否反映在返回值中，由實作契約載明。
     */
    function stat(which:GeneralStat):Int;

    /** 體力（策略消耗用）；上限語意由實作決定。 */
    function stamina():Int;

    /** 寫入體力（供結算消耗／回復）。 */
    function forceSetStamina(value:Int):Void;

    /** 忠誠度（1~100）。 */
    function loyalty():Int;

    /** 寫入忠誠度（供挖角/事件等結算）。 */
    function forceSetLoyalty(value:Int):Void;

    /** 功績（0~∞）。 */
    function merit():Int;

    /** 累加功績（供結算/成就）。 */
    function forceAddMerit(delta:Int):Void;

    /** 稀有度。 */
    function rarity():Rarity;
}
