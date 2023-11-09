(ns game.define.table-item-chip
  (:require [clojure.spec.alpha :as s]
            [game.define.card-proto]))

(s/def ::type #{:chip})
(s/def ::card-proto :game.define.card-proto/value)
(s/def ::value (s/keys :req-un [::type ::card-proto]))