(ns game.component.card-proto
  (:require [clojure.spec.alpha :as s]
            [game.common.dynamic]
            [game.define.card-proto]))

(s/def ::card-proto-pool (s/map-of any? :game.define.card-proto/value))
(s/def ::spec (s/keys :req-un [::card-proto-pool]))

(defn register-card-proto [ctx key proto]
  (s/assert ::spec ctx)
  (assoc-in ctx [:card-proto-pool key] proto))

(defn get-current-card-proto [ctx key]
  (s/assert ::spec ctx)
  (or (get-in ctx [:card-proto-pool key])
      (game.common.dynamic/get-card-proto ctx key)))

(defn tests []
  (let [ctx {:env :test
             :card-proto-pool {}}
        card-proto game.define.card-proto/default-card-proto-value]
    (-> ctx
        (register-card-proto :robot1 card-proto)
        (#(= (:card-proto-pool %) {:robot1 card-proto}))
        (assert (ex-message "register-card-proto fail")))
    (-> ctx
        (register-card-proto :robot1 card-proto)
        (get-current-card-proto :robot1)
        (#(= % card-proto))
        (assert (ex-message "get-current-card-proto fail")))))