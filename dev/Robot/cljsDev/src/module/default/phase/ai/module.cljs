(ns module.default.phase.ai.module)

(defmulti enemyTurn (fn [type gameplayCtx enemy inputCh outputCh] type))