(ns app.gameplay.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unit])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
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