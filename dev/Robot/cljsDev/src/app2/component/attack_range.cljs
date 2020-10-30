(ns app2.component.attack-range
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.data.data :refer [getUnitWeaponRange]]
            [app2.tool.const :refer [*test search-position]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [tool.menuCursor :refer [getCursor1 getCursor2]]))

(defn getAttackRange [ctx menu-key unit]
  (s/assert ::view-spec/menu-component (menu-key ctx))
  (s/assert (s/nilable ::gameplay-spec/robot) unit)
  (let [{:keys [menu-cursor menu-cursor-data]} (-> ctx menu-key)
        cursor1 (getCursor1 menu-cursor)
        cursor2 (getCursor2 menu-cursor)
        {:keys [weaponIdx weapons]} menu-cursor-data]
    (if (= cursor1 weaponIdx)
      (->> (s/assert
            ::gameplay-spec/weaponState
            (nth weapons cursor2))
           (getUnitWeaponRange ctx unit))
      [])))

(defn handle-attack-range-component [ctx menu-key unit [cmd args]]
  (go
    (try
      (cond
        (= :on-click cmd)
        (cond
          (#{"w" "s" "a" "d"} args)
          [(assoc ctx :attackRange (getAttackRange ctx menu-key unit)) nil]

          :else
          [ctx nil])

        :else
        [ctx nil])
      (catch js/Error e
        [ctx e]))))