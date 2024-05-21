(ns game.define.card
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [game.tool.card.table]))
(s/def ::proto-id string?)
(s/def ::is-face-down boolean?)
(s/def ::is-roll boolean?)
(s/def ::spec (s/keys :req-un [::proto-id ::is-face-down ::is-roll]))

(def value {:proto-id ""
            :is-face-down false
            :is-roll false})

(defn get-proto-id [ctx]
  (s/assert ::spec ctx)
  (-> ctx :proto-id))