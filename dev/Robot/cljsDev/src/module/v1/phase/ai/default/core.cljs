(ns module.v1.phase.ai.default.core
  (:require [clojure.core.async :as a]
            [clojure.set])
  (:require [tool.map]
            [tool.fsm]
            [tool.units]
            [tool.goal]
            [module.v1.data :as data]
            [module.v1.phase.ai.default.do-goal :as do-goal]
            [module.v1.phase.ai.default.goalType :as goalType]
            [module.v1.common :as common]))

(def basicGoal [:stack
                [:moveTo [5 5]]
                [:moveTo [10 10]]
                [:findAndAttack]])

(defn updateUnit [gameplayCtx unit inputCh outputCh]
  (a/go
    (let [goals (or (-> unit :robotState :goals) basicGoal)
          goal (tool.goal/get-goal goals)
          _ (common/explainValid? ::goalType/goal goal)
          unit (update-in unit [:robotState :goals] (constantly goals))
          gameplayCtx (a/<! (do-goal/do-goal goal gameplayCtx unit inputCh outputCh))]
      gameplayCtx)))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (a/<! (common/enemyTurnStart gameplayCtx enemy inputCh outputCh))
    (let [units (->> (:units gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :playerKey) enemy))))]
      (loop [gameplayCtx gameplayCtx
             [unit & restUnits] units]
        (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
        (if unit
          (recur (a/<! (updateUnit gameplayCtx unit inputCh outputCh)) restUnits)
          gameplayCtx)))))