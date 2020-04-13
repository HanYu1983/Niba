(ns module.default.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.default.data])
  (:require-macros [app.gameplay.macros :as m])
  (:require [module.default.phase.common])
  (:require [module.default.data]))


(defmulti _enemyTurn (fn [type gameplayCtx enemy inputCh outputCh] type))

(defmethod _enemyTurn :default [_ gameplayCtx enemy inputCh outputCh]
  (a/go
    (let [units (->> (module.default.data/getUnits gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :player) enemy))))]
      (loop [gameplayCtx gameplayCtx
             units units]
        (if (seq units)
          (let [unit (first units)

                targetPosition [3 3]
                camera (module.default.data/getCamera gameplayCtx)
                paths (module.default.data/getUnitMovePathTreeTo gameplayCtx unit targetPosition)
                nearest (if (paths targetPosition)
                          targetPosition
                          (->> paths
                               (sort-by (fn [[k v]]
                                          (:priority v)))
                               ffirst))
                path (tool.map/buildPath paths nearest)
                ;_ (println paths)
                ;_ (println path)
                _ (a/<! (module.default.phase.common/unitMoveAnim gameplayCtx {:unit (module.default.data/mapUnitToLocal gameplayCtx nil unit)
                                                                             :path (map (partial module.default.data/world2local camera) path)}
                                                                inputCh outputCh))

                gameplayCtx (-> (module.default.data/updateUnit gameplayCtx unit (fn [unit]
                                                                                  unit)))]
            (recur gameplayCtx (rest units)))
          gameplayCtx)))))


(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (_enemyTurn nil gameplayCtx enemy inputCh outputCh))