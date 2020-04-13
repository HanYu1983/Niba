(ns module.default.type.weapon
  (:require [clojure.spec.alpha :as s]))

(s/def ::key keyword?)
(s/def ::weaponKey keyword?)
(s/def ::weapon (s/keys :req-un [::key ::weaponKey ::level ::tags ::bulletCount]
                        :opt-un [::range ::type ::suitability]))

(def instance ::weapon)