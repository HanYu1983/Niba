(ns game.define.table-item-card
  (:require [clojure.spec.alpha :as s]))

(s/def ::type #{:card})
(s/def ::value (s/keys :req-un [::type ::proto]))