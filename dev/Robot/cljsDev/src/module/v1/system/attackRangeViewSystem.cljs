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
  (let [state (-> gameplayCtx :fsm tool.fsm/load)
        cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
        cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
        weaponIdx (get-in state [:data :weaponIdx])]
    (if (= cursor1 weaponIdx)
      (-> (data/getUnitWeapons gameplayCtx unit)
          second
          (nth cursor2)
          ((fn [weapon]
             (data/getUnitWeaponRange gameplayCtx unit weapon))))
      [])))

(defn handleAttackRangeView [gameplayCtx unit [cmd args]]
  {:pre [(common/explainValid? (s/tuple ::type/unit) [unit])]}
  (common/assertSpec ::spec/unitMenuView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down])
        (let [attackRange (getAttackRange gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :attackRange attackRange))]
          gameplayCtx)

        (some #(= % action) [:left :right])
        (let [attackRange (getAttackRange gameplayCtx unit)
              gameplayCtx (-> gameplayCtx
                              (assoc :attackRange attackRange))]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))
