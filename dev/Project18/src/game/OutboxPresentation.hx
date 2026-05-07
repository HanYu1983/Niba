package game;

import game.AnimationKind;
import game.AnimationPayload;
import game.PopupOption;
import game.PopupPayload;

/**
 * Outbox 顯示型態：同一條 queue 中可混合 Animation/Popup，但由 core 保證嚴格保序。
 */
enum OutboxPresentation {
  Animation(kind:AnimationKind, payload:AnimationPayload, durationMs:Int);
  Popup(title:String, payload:PopupPayload, option:PopupOption);
}

