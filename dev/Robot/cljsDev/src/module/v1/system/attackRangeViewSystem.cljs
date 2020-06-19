(ns module.v1.system.attackRangeViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [module.v1.system.spec :as spec]))

(defn getAttackRange [gameplayCtx unit]
  {:pre [(common/explainValid? (s/tuple ::spec/unitMenuView ::type/unit) [gameplayCtx unit])]}
  (common/assertSpec ::spec/unitMenuView gameplayCtx)
  (let [state (-> gameplayCtx :fsm tool.fsm/load)
        cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
        cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
        {:keys [weaponIdx weapons]} (:data state)]
    (if (= cursor1 weaponIdx)
      (->> (nth weapons cursor2)
           (data/getUnitWeaponRange gameplayCtx unit))
      [])))

(defn handleAttackRangeView [gameplayCtx unit [cmd args]]
  {:pre [(common/explainValid? (s/tuple ::spec/unitMenuView ::type/unit) [gameplayCtx unit])]}
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (#{:up :down :left :right} action)
        (let [attackRange (getAttackRange gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :attackRange attackRange))]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))
