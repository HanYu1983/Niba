(ns module.v1.type
  (:require [clojure.spec.alpha :as s]))


(s/def ::key keyword?)
(s/def ::position (s/tuple int? int?))
(s/def ::positions (s/coll-of ::position))
(s/def ::hp int?)
(s/def ::en int?)

(s/def ::map (s/coll-of vector?))
(s/def ::camera ::position)
(s/def ::cursor ::position)
(s/def ::viewsize (s/tuple int? int?))
(s/def ::mapsize (s/tuple int? int?))

(s/def ::player (s/keys :req-un [::faction]))
(s/def ::players (s/map-of keyword? ::player))

(s/def ::tags (s/map-of keyword? (constantly true)))

(s/def ::bulletCount int?)
(s/def ::weaponLevel int?)
(s/def ::weaponKey ::key)
(s/def ::weapon (s/keys :req-un [::key ::weaponKey ::weaponLevel ::tags ::bulletCount]
                        :opt-un [::range ::type ::suitability]))

(s/def ::component (s/keys :req-un [::key ::componentKey ::tags]))

(s/def ::playerKey ::key)
(s/def ::robotKey ::key)
(s/def ::pilotKey ::key)

(s/def ::weaponEntry (s/tuple keyword? (s/* ::weapon)))
(s/def ::componentEntry (s/tuple keyword? (s/* ::component)))
(s/def ::weapons (s/map-of keyword? (s/* ::weapon)))
(s/def ::components (s/map-of keyword? (s/* ::component)))

(s/def ::robotState (s/keys :req-un [::robotKey ::pilotKey ::weapons ::components ::tags ::hp ::en]))
(s/def ::robot (s/keys :req-un [::key ::position ::robotKey ::playerKey ::robotState]))

(s/def ::itemKey ::key)
(s/def ::item (s/keys :req-un [::key ::position ::itemKey]))

(s/def ::unit (s/or :robot ::robot 
                    :item ::item))

(s/def ::units (comp not nil?))



(s/def ::moveRange ::positions)

(s/def ::mapView (s/keys :req-un [::map ::camera ::viewsize]))
(s/def ::cursorView (s/keys :req-un [::cursor ::camera ::mapsize]))
(s/def ::unitsView (s/keys :req-un [::units ::camera]))
(s/def ::moveRangeView (s/keys :req-un [::units ::moveRange ::camera]))

(def mapType ::map)
(def units ::units)
(def mapView ::mapView)
(def cursorView ::cursorView)
(def unitsView ::unitsView)
(def moveRangeView ::moveRangeView)
(def players ::players)