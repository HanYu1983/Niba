(ns module.v1.phase.ai.default.core
  (:require [clojure.core.async :as a]
            [clojure.set])
  (:require [tool.map]
            [tool.fsm]
            [tool.units]
            [tool.goal]
            [tool.kmeans]
            [module.v1.data :as data]
            [module.v1.phase.ai.default.do-goal :as do-goal]
            [module.v1.phase.ai.default.goalType :as goalType]
            [module.v1.common :as common]))

(def basicGoal [:stack
                [:think]])

(defn updateUnit [gameplayCtx unit inputCh outputCh]
  (a/go
    (let [goals (or (-> unit :robotState :goals) basicGoal)
          goal (tool.goal/get-goal goals)
          _ (common/explainValid? ::goalType/goal goal)
          unit (update-in unit [:robotState :goals] (constantly goals))
          gameplayCtx (a/<! (do-goal/do-goal goal gameplayCtx unit inputCh outputCh))]
      gameplayCtx)))


(defn initEnemy [gameplayCtx enemy]
  (let [units (->> (:units gameplayCtx)
                   (tool.units/getAll)
                   (filter (fn [unit]
                             (= (get unit :playerKey) enemy))))
        targetUnits (->> (:units gameplayCtx)
                         (tool.units/getAll)
                         (filter (fn [unit]
                                   (= (get unit :playerKey) :player))))
        clusterCnt (min 4 (count units) (count targetUnits))]
    (if (zero? clusterCnt)
      gameplayCtx
      (let [{:keys [clusters]} (tool.kmeans/kmeans (map :position units) clusterCnt {})
            {targetCenteroids :centroids} (tool.kmeans/kmeans (map :position targetUnits) clusterCnt {})
            nextUnits (map (fn [unit groupIdx]
                             (let [moveToPosition (mapv Math/floor (-> (nth targetCenteroids groupIdx) :centroid))
                                   goal [:moveTo moveToPosition]
                                   _ (common/assertSpec ::goalType/goal goal)]
                               (update-in unit [:robotState :orderGoal] (constantly goal))))
                           units
                           clusters)
            gameplayCtx (reduce (fn [gameplayCtx [unit nextUnit]]
                                  (data/updateUnit gameplayCtx unit (constantly nextUnit)))
                                gameplayCtx
                                (zipmap units nextUnits))]
        gameplayCtx))))


(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (a/<! (common/enemyTurnStart gameplayCtx enemy inputCh outputCh))
    (let [gameplayCtx (initEnemy gameplayCtx enemy)
          units (->> (:units gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :playerKey) enemy))))]
      (loop [gameplayCtx gameplayCtx
             [unit & restUnits] units]
        (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
        (if unit
          (let [gameplayCtx (assoc gameplayCtx :cursor (:position unit))]
            (recur (a/<! (updateUnit gameplayCtx unit inputCh outputCh)) restUnits))
          gameplayCtx)))))