package game;

import game.GameIds;

/**
 * docs/裝備系統.md：裝備只能裝在武將上，裝上不可拆下。
 * 領域模型先提供唯讀視角（getter），實際裝備流程由指令/規剘層負責。
 */
interface IEquipment {
  function id():EquipmentId;
  function name():String;
  function type():EquipmentType;
  function rarity():Rarity;

  /** 裝備加成的屬性維度（對應 GeneralStat）。 */
  function bonusStat():GeneralStat;

  /** 屬性加成值（正整數）。 */
  function bonusValue():Int;

  /** 裝備時增加忠誠度（依稀有度）。 */
  function loyaltyBonus():Int;

  /** 價格（單位由規剘定義；先用 Int）。 */
  function price():Int;
}

