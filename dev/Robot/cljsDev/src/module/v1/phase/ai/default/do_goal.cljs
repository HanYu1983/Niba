(ns module.v1.phase.ai.default.do-goal
  (:require [clojure.core.async :as a]
            [clojure.set])
  (:require [tool.map]
            [tool.fsm]
            [tool.units]
            [tool.goal]
            [module.v1.data :as data]
            [module.v1.common :as common]
            [module.v1.session.battleMenu :as battleMenu]
            [module.v1.phase.unitBattleMenu :refer [unitBattleMenu]]))


(defn myUnits [gameplayCtx enemy])
(defn stillNotMove? [gameplayCtx unit])
(defn stillNotAttack? [gameplayCtx unit])
(defn positionToMove [gameplayCtx unit aiCtx])
(defn unitToAttack [gameplayCtx unit aiCtx])
(defn weaponsCanUseToUnit [gameplayCtx unit targetUnit aiCtx])
(defn weaponToUse [gameplayCtx unit targetUnit aiCtx])

(defmulti do-goal (fn [[goalType]] goalType))

(defmethod do-goal :findAndAttack [_ gameplayCtx unit inputCh outputCh]
  (a/go
    (let [[_ weapons] (data/getUnitWeapons gameplayCtx unit)
          weapon (first weapons)
          attackUnit (->> (:units gameplayCtx)
                          (tool.units/getAll)
                          (filter #(-> % :playerKey (= :player)))
                          first)
          battleMenu [{:unit attackUnit :action [:pending]}
                      {:unit unit
                       :action [:attack weapon]
                       :hitRate (data/getUnitHitRate gameplayCtx unit weapon attackUnit)}]
          _ (common/explainValid? ::battleMenu/defaultModel battleMenu)
          [gameplayCtx _] (a/<! (unitBattleMenu gameplayCtx {:battleMenu battleMenu :fixRight true} inputCh outputCh))]
      gameplayCtx)))

(defmethod do-goal :moveTo [[_ targetPosition] gameplayCtx unit inputCh outputCh]
  (a/go
    (let [camera (:camera gameplayCtx)
          paths (data/getUnitMovePathTreeTo gameplayCtx unit targetPosition)
          nearest (if (paths targetPosition)
                    targetPosition
                    (->> paths
                         (sort-by (fn [[pos _]]
                                    (data/estimateCost pos targetPosition)))
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
          nextUnit (-> unit
                       (assoc :position nearest)
                       (update-in [:robotState :goals] tool.goal/next-goal)
                       (update-in [:robotState :tags] #(conj % [:done true])))
          gameplayCtx (data/updateUnit gameplayCtx unit (constantly nextUnit))]
      gameplayCtx)))