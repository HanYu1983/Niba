(ns module.default.type.unit
  (:require [clojure.spec.alpha :as s])
  (:require [module.default.type.weapon]))

(s/def ::robot keyword?)
(s/def ::pilot keyword?)
(s/def ::player keyword?)
(s/def ::weapons (s/map-of keyword? (s/* module.default.type.weapon/instance)))
(s/def ::state (s/keys :req-un [::robot ::pilot ::weapons ::components ::tags]))
(s/def ::unit (s/keys :req-un [::player ::type ::position ::state]))

(def instance ::unit)