(ns app.gameplay.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [app.gameplay.model])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common]))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (loop []
      (a/<! (app.gameplay.phase.common/enemyTurnStart gameplayCtx enemy inputCh outputCh))
      (a/<! (app.module/gameplayOnEnemyTurn app.module/*module gameplayCtx enemy inputCh outputCh)))))