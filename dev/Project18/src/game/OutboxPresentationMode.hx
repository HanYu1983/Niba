package game;

/**
 * 呈現策略（UI 用）：
 * - Serial：只呈現 head
 * - FanOut2：允許 UI 同時預載/呈現 head 與 next（但 ack 仍嚴格只允許 head）
 */
enum OutboxPresentationMode {
  Serial;
  FanOut2;
}

