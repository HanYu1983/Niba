(ns module.default.phase.enemyTurn
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [app.gameplay.model])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common])
  (:require [module.default.data]))

(defn enemyTurn [gameplayCtx enemy inputCh outputCh]
  (a/go
    (let [units (->> (app.gameplay.model/getUnits gameplayCtx)
                     (tool.units/getAll)
                     (filter (fn [unit]
                               (= (get unit :player) enemy))))]
      (loop [gameplayCtx gameplayCtx
             units units]
        (if (seq units)
          (let [unit (first units)

                targetPosition [3 3]
                camera (app.gameplay.model/getCamera gameplayCtx)
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
                _ (a/<! (app.gameplay.phase.common/unitMoveAnim gameplayCtx {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil unit)
                                                                             :path (map (partial app.gameplay.model/world2local camera) path)}
                                                                inputCh outputCh))

                gameplayCtx (-> (app.gameplay.model/updateUnit gameplayCtx unit (fn [unit]
                                                                                  unit)))]
            (recur gameplayCtx (rest units)))
          gameplayCtx)))))