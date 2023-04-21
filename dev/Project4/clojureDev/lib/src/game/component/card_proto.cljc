(ns game.component.card-proto
  (:require [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.component.spec]
            [game.component.protocol.basic]))

(s/def ::spec (s/keys :req-un [:game.component.spec/card-proto-pool]))

(defn register-card-proto [ctx key proto]
  (s/assert ::spec ctx)
  (assoc-in ctx [:card-proto-pool key] proto))

(defn get-current-card-proto [ctx key]
  (s/assert ::spec ctx)
  (or (get-in ctx [:card-proto-pool key])
      (game.component.protocol.basic/get-card-proto ctx key)))

(defn tests []
  (let [ctx {:env :test
             :card-proto-pool {}}]
    (-> ctx
        (register-card-proto :robot1 game.define.card-proto/card-proto)
        (#(= (:card-proto-pool %) {:robot1 game.define.card-proto/card-proto}))
        (assert (ex-message "register-card-proto fail")))
    (-> ctx
        (register-card-proto :robot1 game.define.card-proto/card-proto)
        (get-current-card-proto :robot1)
        (#(= % game.define.card-proto/card-proto))
        (assert (ex-message "get-current-card-proto fail")))))