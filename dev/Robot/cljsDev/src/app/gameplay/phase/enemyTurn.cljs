(ns app.gameplay.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.default.data])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common])
  (:require [module.default.tmp]))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (loop []
      (a/<! (app.gameplay.phase.common/enemyTurnStart gameplayCtx enemy inputCh outputCh))
      (a/<! (module.default.tmp/gameplayOnEnemyTurn app.module/*module gameplayCtx enemy inputCh outputCh)))))