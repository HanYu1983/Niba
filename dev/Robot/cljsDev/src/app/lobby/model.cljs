(ns app.lobby.model
  (:require [cljs.reader])
  (:require [clojure.spec.alpha :as s]))

(s/def ::key keyword?)
(s/def ::robotKey keyword?)
(s/def ::pilotKey keyword?)
(s/def ::robots (s/map-of ::key ::robotKey))
(s/def ::pilots (s/map-of ::key ::pilotKey))
(s/def ::robotByPilot (s/map-of ::key ::key))
(s/def ::money int?)

(s/def ::weaponKey keyword?)
; 機器上的武器(哪台機體/哪個武器)
(s/def ::weaponUpgradeKey (s/tuple ::key ::weaponKey))
; 武器升級
(s/def ::weaponLevelByWeaponUpgradeKey (s/map-of ::weaponUpgradeKey int?))

(s/def ::componentKey keyword?)
; 購買的配件
(s/def ::components (s/map-of ::key ::componentKey))
; 安裝在機體上的配件
(s/def ::robotByComponent (s/map-of ::key ::key))

(s/def ::model (s/keys :req-un [::robots ::pilots ::robotByPilot ::money ::weaponLevelByWeaponUpgradeKey ::robotByComponent]))

(def defaultLobbyModel {:robots {}
                        :pilots {}
                        :robotByPilot {}
                        :money 0
                        :weaponLevelByWeaponUpgradeKey {}
                        :robotByComponent {}})


(defn load []
  {:post [(s/valid? ::model %)]}
  (or (-> (aget js/localStorage "lobby")
          (cljs.reader/read-string))
      defaultLobbyModel))

(defn save [lobbyCtx]
  {:pre [(s/valid? ::model lobbyCtx)]}
  (.setItem js/localStorage "lobby" (str lobbyCtx))
  lobbyCtx)
