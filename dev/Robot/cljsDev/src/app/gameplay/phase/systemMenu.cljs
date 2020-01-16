(ns app.gameplay.phase.systemMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
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

                                               updateSystemMenu

                                               actions]])
  (:require [app.gameplay.step.menu :refer [menu]]))

(defn systemMenu [gameplayCtx args inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [[gameplayCtx select] (a/<! (menu gameplayCtx {:menu [["endTurn"] ["cancel"]] :data {}} inputCh outputCh))]
        (cond
          (= "endTurn" select)
          [gameplayCtx true]

          (some #(= select %) [:cancel "cancel"])
          [gameplayCtx false]

          :else
          (recur gameplayCtx))))))