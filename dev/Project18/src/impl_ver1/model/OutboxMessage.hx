package impl_ver1.model;

import game.IOutboxMessage;
import game.OutboxAudience;
import game.OutboxPresentation;
import game.OutboxPresentationMode;

class OutboxMessage implements IOutboxMessage {
  final _id:String;
  final _audience:OutboxAudience;
  final _ctxKey:String;
  final _blocking:Bool;
  final _mode:OutboxPresentationMode;
  final _presentation:OutboxPresentation;

  public function new(
    id:String,
    audience:OutboxAudience,
    ctxKey:String,
    blocking:Bool,
    mode:OutboxPresentationMode,
    presentation:OutboxPresentation
  ) {
    _id = id;
    _audience = audience;
    _ctxKey = ctxKey;
    _blocking = blocking;
    _mode = mode;
    _presentation = presentation;
  }

  public function id():String return _id;
  public function audience():OutboxAudience return _audience;
  public function ctxKey():String return _ctxKey;
  public function blocking():Bool return _blocking;
  public function presentationMode():OutboxPresentationMode return _mode;
  public function presentation():OutboxPresentation return _presentation;
}

