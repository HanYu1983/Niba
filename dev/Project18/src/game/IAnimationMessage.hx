package game;

import game.GameIds;

/**
 * View 可讀的動畫訊息（由賽局在 apply 時寫入 outbox）。
 * 非阻塞：UI 可依序播放並 ack 消費。
 */
interface IAnimationMessage {
  function id():String;
  function audience():AnimationAudience;
  function kind():AnimationKind;
  function payload():AnimationPayload;
  function ctxKey():String;
}

