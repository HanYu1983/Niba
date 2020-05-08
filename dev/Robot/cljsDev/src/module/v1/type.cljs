(ns module.v1.type
  (:require [clojure.spec.alpha :as s]))


(s/def ::key keyword?)
(s/def ::position (s/tuple int? int?))

(s/def ::map (s/coll-of vector?))
(s/def ::camera ::position)
(s/def ::cursor ::position)
(s/def ::viewsize (s/tuple int? int?))
(s/def ::mapsize (s/tuple int? int?))
(s/def ::unit (s/keys :req-un [::key ::position]))
(s/def ::units (s/coll-of ::unit))

(s/def ::mapView (s/keys :req-un [::map ::camera ::viewsize]))
(s/def ::cursorView (s/keys :req-un [::cursor ::camera ::mapsize]))
(s/def ::unitsView (s/keys :req-un [::units ::camera]))

(s/def ::gameView (s/keys :req-un [::mapView ::cursorView ::unitsView]))


(def gameView ::gameView)