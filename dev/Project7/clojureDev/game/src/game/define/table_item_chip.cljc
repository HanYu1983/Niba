(ns game.define.table-item-chip
  (:require [clojure.spec.alpha :as s]))

(s/def ::type #{:chip})
(s/def ::value (s/keys :req-un [::type ::proto]))