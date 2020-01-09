(ns app.gameplay.data
  (:require [clojure.core.async :as a]))


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

(defn loadData []
  (let [worker (a/chan)]
    (a/go
      (a/>! worker data)
      (a/close! worker))
    worker))