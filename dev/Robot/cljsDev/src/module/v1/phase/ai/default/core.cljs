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
    (let [gameplayCtx (a/<! (data/onEnemyTurnStart gameplayCtx enemy inputCh outputCh))
          gameplayCtx (initEnemy gameplayCtx enemy)
          units (->> (:units gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :playerKey) enemy))))]
      (loop [gameplayCtx gameplayCtx
             [unit & restUnits] units]
        (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
        (if unit
          (let [{:keys [viewsize mapsize]} gameplayCtx
                [vw vh] viewsize
                [mw mh] mapsize
                gameplayCtx (assoc gameplayCtx :cursor (:position unit))
                gameplayCtx (assoc gameplayCtx :camera (->> (:position unit)
                                                            (map + [(- (js/Math.floor (/ vw 2))) (- (js/Math.floor (/ vh 2)))])
                                                            ((fn [[x y]]
                                                               [(max 0 (min x (- mw vw)))
                                                                (max 0 (min y (- mh vh)))]))))
                _ (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))]
            (recur (a/<! (updateUnit gameplayCtx unit inputCh outputCh)) restUnits))
          (a/<! (data/onEnemyTurnEnd gameplayCtx enemy inputCh outputCh)))))))