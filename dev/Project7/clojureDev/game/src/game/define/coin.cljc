(ns game.define.coin
  (:require [clojure.spec.alpha :as s]))
(def coin {:id ""
           :card-id ""})
(s/def ::spec (s/keys :req-un [::id ::card-id]))