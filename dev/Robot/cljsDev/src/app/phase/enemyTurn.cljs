(ns app.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.map])
  (:require [app.data])
  (:require [app.gameplay])
  (:require [app.fsm])
  (:require [app.unitState])
  (:require [app.units])
  (:require-macros [app.macros :as m])
  (:require [app.phase.common :refer [playerTurnStart
                                      enemyTurnStart
                                      updateMap
                                      updateUnits
                                      updateCursor
                                      updateMoveRange
                                      updateAttackRange

                                      updatePlayTurn

                                      actions]]))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (loop []
      (a/<! (enemyTurnStart gameplayCtx enemy inputCh outputCh))
      gameplayCtx)))