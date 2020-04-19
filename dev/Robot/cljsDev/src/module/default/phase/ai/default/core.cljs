(ns module.default.phase.ai.default.core
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.default.data])
  (:require [module.default.phase.common])
  (:require [module.default.data])
  (:require [module.default.phase.ai.module]))

(defn myUnits [gameplayCtx enemy])
(defn stillNotMove? [gameplayCtx unit])
(defn stillNotAttack? [gameplayCtx unit])
(defn positionToMove [gameplayCtx unit aiCtx])
(defn unitToAttack [gameplayCtx unit aiCtx])
(defn weaponsCanUseToUnit [gameplayCtx unit targetUnit aiCtx])
(defn weaponToUse [gameplayCtx unit targetUnit aiCtx])

(defmethod module.default.phase.ai.module/enemyTurn :default [_ gameplayCtx enemy inputCh outputCh]
  (a/go
    (a/<! (module.default.phase.common/enemyTurnStart gameplayCtx enemy inputCh outputCh))
    (let [units (->> (module.default.data/getUnits gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :player) enemy))))]
      (loop [gameplayCtx gameplayCtx
             [unit & restUnits] units]
        (if unit
          (let [targetPosition [3 3]
                camera (module.default.data/getCamera gameplayCtx)
                paths (module.default.data/getUnitMovePathTreeTo gameplayCtx unit targetPosition)
                nearest (if (paths targetPosition)
                          targetPosition
                          (->> paths
                               (sort-by (fn [[k v]]
                                          (:priority v)))
                               ffirst))
                nearest (loop [pos nearest]
                          (let [occupyUnit (tool.units/getByPosition (module.default.data/getUnits gameplayCtx) pos)]
                            (if (nil? occupyUnit)
                              pos
                              (recur (get-in paths [pos :prev])))))
                nearest (or nearest (:position unit))
                path (tool.map/buildPath paths nearest)
                _ (a/<! (module.default.phase.common/unitMoveAnim gameplayCtx {:unit (module.default.data/mapUnitToLocal gameplayCtx nil unit)
                                                                               :path (map (partial module.default.data/world2local camera) path)}
                                                                  inputCh outputCh))
                gameplayCtx (-> (module.default.data/updateUnit gameplayCtx unit (fn [unit]
                                                                                   (assoc unit :position nearest))))]
            (recur gameplayCtx restUnits))
          gameplayCtx)))))