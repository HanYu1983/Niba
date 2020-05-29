(ns module.v1.system.startUnitsMenuViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm]))


(defn handleStartUnitsMenuView [gameplayCtx [cmd args]]
  {:pre [(common/explainValid? (s/tuple ::spec/startUnitsMenuView) [gameplayCtx])]}
  (common/explainValid? ::spec/startUnitsMenuView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (action #{:up :down})
        (let [state (-> gameplayCtx :fsm tool.fsm/load)
              {:keys [units]} state
              cnt (count (into [] units))
              state (update state :cursor (comp #(max 0 %)
                                                #(min (dec cnt) %)
                                                (action {:up dec :down inc})))
              gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
          gameplayCtx)

        (action #{:left :right})
        (let [state (-> gameplayCtx :fsm tool.fsm/load)
              {:keys [units selectedUnits cursor]} state
              cnt (count (into [] units))]
          (if (zero? cnt)
            gameplayCtx
            (let [selected (-> units (#(into [] %)) (nth cursor) first)
                  selectedUnits (if (contains? selectedUnits selected)
                                  (disj selectedUnits selected)
                                  (conj selectedUnits selected))
                  state (assoc state :selectedUnits selectedUnits)
                  gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
              gameplayCtx)))

        :else
        gameplayCtx))

    :else
    gameplayCtx))