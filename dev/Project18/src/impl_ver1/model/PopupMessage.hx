package impl_ver1.model;

import game.IPopupMessage;
import game.PopupAudience;
import game.PopupOption;

class PopupMessage implements IPopupMessage {
  final _id:String;
  final _audience:PopupAudience;
  final _title:String;
  final _message:String;
  final _option:PopupOption;

  public function new(id:String, audience:PopupAudience, title:String, message:String, option:PopupOption) {
    _id = id;
    _audience = audience;
    _title = title;
    _message = message;
    _option = option;
  }

  public function id():String return _id;
  public function audience():PopupAudience return _audience;
  public function title():String return _title;
  public function message():String return _message;
  public function option():PopupOption return _option;
}

