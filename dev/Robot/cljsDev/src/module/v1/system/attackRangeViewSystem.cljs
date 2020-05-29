(ns module.v1.system.attackRangeViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm]))


(defn handleAttackRangeView [gameplayCtx unit [cmd args]]
  {:pre [(common/explainValid? (s/tuple ::type/unit) [unit])]}
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down])
        (let [attackRange (data/getAttackRange gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :attackRange attackRange))]
          gameplayCtx)

        (some #(= % action) [:left :right])
        (let [attackRange (data/getAttackRange gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :attackRange attackRange))]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))