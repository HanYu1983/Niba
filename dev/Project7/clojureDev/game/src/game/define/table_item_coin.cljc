(ns game.define.table-item-coin
  (:require [clojure.spec.alpha :as s]))

(s/def ::type #{:coin})
(s/def ::value (s/keys :req-un [::type ::description ::player-id]))