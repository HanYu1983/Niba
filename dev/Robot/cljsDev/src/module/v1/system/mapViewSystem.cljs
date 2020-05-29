(ns module.v1.system.mapViewSystem
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common]))


(defn handleMapView [gameplayCtx [cmd args]]
  {:pre [(common/explainValid? ::spec/mapView gameplayCtx)]}
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameplayCtx [:camera] #(mapv + % (action {:rup [0 -1]
                                                             :rdown [0 1]
                                                             :rleft [-1 0]
                                                             :rright [1 0]})))
        :else
        gameplayCtx))
    
    :else
    gameplayCtx))