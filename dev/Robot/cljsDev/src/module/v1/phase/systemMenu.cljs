(ns module.v1.phase.systemMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [module.v1.step.menu :refer [menu]]))

(defn systemMenu [gameplayCtx _ inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [[gameplayCtx select] (a/<! (menu gameplayCtx {:menu [["endTurn"] ["cancel"]] :data {}} inputCh outputCh))]
        (cond
          (= "endTurn" select)
          [gameplayCtx true]

          (= "cancel" select)
          [gameplayCtx false]

          :else
          (recur gameplayCtx))))))