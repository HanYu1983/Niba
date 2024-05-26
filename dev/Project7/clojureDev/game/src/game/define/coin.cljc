(ns game.define.coin
  (:require [clojure.spec.alpha :as s]))
(def coin {:id nil :player-id nil})
(s/def ::spec (s/keys :req-un [::id ::player-id]))

(defn get-player-id [ctx]
  (s/assert ::spec ctx)
  (-> ctx :player-id))