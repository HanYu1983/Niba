package impl_ver1.model;

import game.AnimationAudience;
import game.AnimationKind;
import game.AnimationPayload;
import game.IAnimationMessage;

class AnimationMessage implements IAnimationMessage {
  final _id:String;
  final _audience:AnimationAudience;
  final _kind:AnimationKind;
  final _payload:AnimationPayload;
  final _ctxKey:String;

  public function new(id:String, audience:AnimationAudience, kind:AnimationKind, payload:AnimationPayload, ctxKey:String) {
    _id = id;
    _audience = audience;
    _kind = kind;
    _payload = payload;
    _ctxKey = ctxKey;
  }

  public function id():String return _id;
  public function audience():AnimationAudience return _audience;
  public function kind():AnimationKind return _kind;
  public function payload():AnimationPayload return _payload;
  public function ctxKey():String return _ctxKey;
}

