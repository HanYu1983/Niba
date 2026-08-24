package game;

/**
 * 移動逐步結算時，{@link IJiCeMovementStepHook} 對單一步的回覆語意。
 */
enum MovementStepOutcome {
  /** 繼續消費剩餘步數（若有）。 */
  Continue;

  /**
   * 不再前進：棋子已停於「本步落地」之格。
   * 整次 Move 仍會在最後做一次 {@link IGameMatch} 落地結算（與一步走完語意一致）。
   */
  HaltRemainingSteps;
}
