(ns game.define.chip
  (:require [clojure.spec.alpha :as s]))

(def chip {:id ""
           :card-proto-id ""})

(s/def ::spec (s/keys :req-un [::id ::card-proto-id]))