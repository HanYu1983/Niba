(ns module.v1.phase.ai.default.core
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common]))

(defn myUnits [gameplayCtx enemy])
(defn stillNotMove? [gameplayCtx unit])
(defn stillNotAttack? [gameplayCtx unit])
(defn positionToMove [gameplayCtx unit aiCtx])
(defn unitToAttack [gameplayCtx unit aiCtx])
(defn weaponsCanUseToUnit [gameplayCtx unit targetUnit aiCtx])
(defn weaponToUse [gameplayCtx unit targetUnit aiCtx])

(def basicGoal [:seq
                [:waitTurn 30]
                [:loop
                 [:whenFindEnemy :unit
                  [:seq
                   [:attackEnemy :unit]]]
                 [:attack]]])

(defn updateUnit [gameplayCtx unit inputCh outputCh]
  (a/go
    (let [targetPosition [3 3]
          camera (:camera gameplayCtx)
          paths (data/getUnitMovePathTreeTo gameplayCtx unit targetPosition)
          nearest (if (paths targetPosition)
                    targetPosition
                    (->> paths
                         (sort-by (fn [[k v]]
                                    (:priority v)))
                         ffirst))
          nearest (loop [pos nearest]
                    (let [occupyUnit (tool.units/getByPosition (:units gameplayCtx) pos)]
                      (if (nil? occupyUnit)
                        pos
                        (recur (get-in paths [pos :prev])))))
          nearest (or nearest (:position unit))
          path (tool.map/buildPath paths nearest)
          _ (a/<! (common/unitMoveAnim gameplayCtx {:unit (data/mapUnitToLocal gameplayCtx nil unit)
                                                    :path (map (partial data/world2local camera) path)}
                                       inputCh outputCh))
          gameplayCtx (-> (data/updateUnit gameplayCtx unit (fn [unit]
                                                              (assoc unit :position nearest))))]
      gameplayCtx)))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (a/<! (common/enemyTurnStart gameplayCtx enemy inputCh outputCh))
    (let [units (->> (:units gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :player) enemy))))]
      (loop [gameplayCtx gameplayCtx
             [unit & restUnits] units]
        (if unit
          (recur (a/<! (updateUnit gameplayCtx unit inputCh outputCh)) restUnits)
          gameplayCtx)))))