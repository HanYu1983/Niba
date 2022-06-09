(ns app2.tool.lobby-spec
  (:require [clojure.spec.alpha :as s]))

(s/def ::money int?)

(s/def ::key keyword?)
(s/def ::robotKey keyword?)
(s/def ::pilotKey keyword?)

(s/def ::robots (s/map-of ::key ::robotKey))
(s/def ::pilots (s/map-of ::key ::pilotKey))
(s/def ::pilotStateByPilot (s/map-of ::key any?))
(s/def ::robotByPilot (s/map-of ::key ::key))

(s/def ::weaponKey keyword?)
; 購買的武器
(s/def ::weapons (s/map-of ::key ::weaponKey))
; 安裝在機體上的武器
(s/def ::robotByWeapon (s/map-of ::key ::key))
; 武器升級
(s/def ::weaponLevelByKey (s/map-of ::key int?))

(s/def ::componentKey keyword?)
; 購買的配件
(s/def ::components (s/map-of ::key ::componentKey))
; 安裝在機體上的配件
(s/def ::robotByComponent (s/map-of ::key ::key))

(s/def ::lobby (s/keys :req-un [::robots
                                ::pilots
                                ::robotByPilot
                                ::money
                                ::weapons
                                ::robotByWeapon
                                ::weaponLevelByKey
                                ::components
                                ::robotByComponent
                                ::pilotStateByPilot]))