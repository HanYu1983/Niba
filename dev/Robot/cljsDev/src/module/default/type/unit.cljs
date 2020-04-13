(ns module.default.type.unit
  (:require [clojure.spec.alpha :as s]))

(s/def ::robot keyword?)
(s/def ::state (s/keys :req-un [::robot ::pilot ::weapons ::components ::tags]))
(s/def ::unit (s/keys :req-un [::player ::type ::position ::state]))

(def instance ::unit)