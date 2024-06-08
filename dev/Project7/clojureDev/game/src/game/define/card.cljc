(ns game.define.card
  (:require [clojure.spec.alpha :as s]
            [game.tool.card.table]))
(s/def ::proto-id string?)
(s/def ::is-face-down boolean?)
(s/def ::is-roll boolean?)
(s/def ::spec (s/keys :opt-un [::proto-id ::is-face-down ::is-roll]))

(def value {:is-face-down false
            :is-roll false})

(defn get-is-roll [ctx]
  (s/assert ::spec ctx)
  (-> ctx :is-roll))

(defn set-is-roll [ctx is-roll]
  (s/assert ::spec ctx)
  (-> ctx get-is-roll (not= is-roll)
      (or (throw (ex-info "" {} :same-state))))
  (-> ctx (assoc :is-roll is-roll)))

(defn get-proto-id [ctx]
  (s/assert ::spec ctx)
  (-> ctx :proto-id))