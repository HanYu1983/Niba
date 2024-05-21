(ns game.define.table-item-card
  (:require [clojure.spec.alpha :as s]
            [game.define.card]))

(s/def ::type #{:card})
(s/def ::card :game.define.card/spec)
(s/def ::value (s/keys :req-un [::type ::card]))
(defn value-of [card]
  (s/assert :game.define.card/spec card)
  (s/assert ::value {:type :card :card card}))
(defn get-card [ctx]
  (s/assert ::value ctx)
  (-> ctx :card))