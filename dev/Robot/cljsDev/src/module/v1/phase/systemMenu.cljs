(ns module.v1.phase.systemMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [module.v1.data :as data])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [module.v1.step.menu :refer [menu]]))

(defn systemMenu [gameplayCtx _ inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [[gameplayCtx select] (a/<! (menu gameplayCtx {:menu [["cancel"]
                                                                 ["endTurn"]
                                                                 ["load"]
                                                                 ["save"]
                                                                 ["giveUp"]] :data {}} inputCh outputCh))]
        (cond
          (= "endTurn" select)
          [gameplayCtx true]

          (= "cancel" select)
          [gameplayCtx false]

          (= "giveUp" select)
          [(update gameplayCtx :done (constantly {:cause :giveUp})) true]

          (= "load" select)
          (let [gameplayCtx (data/load! data/gameplayCtx)]
            [gameplayCtx false])

          (= "save" select)
          (let [_ (data/save! gameplayCtx)]
            (recur gameplayCtx))

          :else
          (recur gameplayCtx))))))