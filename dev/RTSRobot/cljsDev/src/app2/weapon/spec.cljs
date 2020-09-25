(ns app2.weapon.spec
  (:require [clojure.spec.alpha :as s]))

(s/def ::bullet-count number?)
(s/def ::weapon (s/keys :req-un [::id ::weapon-proto-id ::bullet-count]))