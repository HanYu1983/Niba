(ns module.default.phase.enemyTurn
  (:require-macros [module.default.macros :as m])
  (:require [module.default.phase.ai.module])
  (:require [module.default.phase.ai.default.core]))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (module.default.phase.ai.module/enemyTurn nil gameplayCtx enemy inputCh outputCh))



