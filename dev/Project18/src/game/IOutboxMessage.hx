package game;

import game.GameIds;

interface IOutboxMessage {
  function id():String;
  function audience():OutboxAudience;
  function ctxKey():String;
  function blocking():Bool;
  function presentationMode():OutboxPresentationMode;
  function presentation():OutboxPresentation;
  function payload():OutboxPayload;
}

