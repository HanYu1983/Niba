package game;

import game.IPlayer;
import game.IPlayerMenu;
import game.IPlayerMenuNode;
import game.IJiCe;
import game.IJiCeStagingPreviewRow;

/**
 * 「暫存（staging）」型指令：需要 UI 先選擇/填寫，再按提交後 resolve。
 *
 * 目標：把「計策暫存」這種流程抽象化，讓未來村落/城池/商店等指令也能復用同一套
 * build → staging → submit(resolve) 的管線。
 */
interface IStagingAction {
  /** UI 顯示用名稱。 */
  function designLabel():String;

  /** 用於 debug/ctx tag（需穩定）。 */
  function registryKey():String;

  /** 建立暫存期玩家菜單。 */
  function buildPlayerMenu(actor:IPlayer):IPlayerMenu;

  /** 於提交時結算（讀取已被 UI 改寫過的 menuNode widgets）。 */
  function resolveChoice(actor:IPlayer, menuNode:IPlayerMenuNode):Void;

  /** 暫存期預覽列（成功率/勝率/效果摘要等）；無則回傳空陣列。 */
  function previewRows(actor:IPlayer):Array<IJiCeStagingPreviewRow>;

  /**
   * 相容舊語意：若本 staging 實際上是一張計策，回傳該 card；否則回傳 null。
   * 讓既有 debug/test API 仍可用而不強迫全專案立即改名。
   */
  function asJiCe():Null<IJiCe>;
}

