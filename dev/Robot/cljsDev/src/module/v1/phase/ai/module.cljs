(ns module.v1.phase.ai.module)

(defmulti enemyTurn (fn [type gameplayCtx enemy inputCh outputCh] type))