package game;

import game.PopupOption;

/**
 * Outbox 顯示型態（不含載荷）；{@link IOutboxMessage#payload} 提供統一 {@link OutboxPayload}。
 */
enum OutboxPresentation {
  Animation(durationMs:Int);
  Popup(title:String, option:PopupOption);
}
