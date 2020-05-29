(ns module.v1.system.hitRateViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm]))


(defn handleHitRateView [gameplayCtx unit [cmd args]]
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down])
        (let [checkHitRate (data/getHitRate gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :checkHitRate checkHitRate))]
          gameplayCtx)

        (some #(= % action) [:left :right])
        (let [checkHitRate (data/getHitRate gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :checkHitRate checkHitRate))]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))