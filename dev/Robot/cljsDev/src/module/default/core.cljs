(ns module.default.core
  (:require [clojure.core.async :as a])
  (:require [app.gameplay.module]))

(def data {"weaponType" {"single" {"title" "single"}
                         "line" {"title" "line"}}
           "weaponAbility" {"moveAttack" {"title" "move attack"}}
           "weaponEnergyType" {"energy" {"title" "energy"}
                               "bullet" {"title" "bullet"}}
           "weapon" {"beangun" {"title" "bean gun"
                                "type" "single"
                                "range" [2 5]
                                "damage" 3000
                                "energyType" "energy"
                                "energyCost" 20
                                "maxBulletCount" 8
                                "accuracy" 0.7
                                "suitability" [1 0 1 1]
                                "ablitity" ["moveAttack"]}
                     "bigsword" {"title" "big sword"
                                 "type" "line"
                                 "range" [1 2]
                                 "damage" 2000
                                 "energyType" "energy"
                                 "energyCost" 20
                                 "maxBulletCount" 8
                                 "accuracy" 0.9
                                 "suitability" [1 1 1 1]
                                 "ablitity" ["moveAttack"]}}
           "robot" {"jimu" {"title" "jimu"
                            "weapons" ["beangun" "bigsword"]
                            "hp" 2000
                            "en" 120
                            "armor" 1000
                            "power" 7
                            "cost" 3000}}})

(def defaultUnitState {:robot "jimu"
                       :pilot "amuro"
                       :hp 2000
                       :mp 120
                       :component []
                       :weapon [{:weaponKey "beangun"
                                 :bulletCount 12}
                                {:weaponKey "bigsword"}]})


(defmethod app.gameplay.module/loadData :default [_]
  (a/go
    data))

(defmethod app.gameplay.module/unitStateCreate :default [_ unit]
  (merge unit 
         {:state defaultUnitState}))

(defmethod app.gameplay.module/unitStateGetWeapons :default [_ unit]
  (->> (get-in unit [:state :weapon])
       (map (fn [{:keys [weaponKey] :as weapon}]
              (merge (get-in data ["weapon" weaponKey])
                     {:state weapon})))))