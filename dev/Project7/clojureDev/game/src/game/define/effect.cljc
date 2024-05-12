(ns game.define.effect
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.tool.logic-tree]
            [game.define.card-text]
            [game.define.gsign]
            [game.common.dynamic]))

(s/def ::card-id any?)
(s/def ::player-id any?)
(s/def ::text-id any?)
; reason
(s/def ::system (s/tuple #{:system} ::player-id))
(s/def ::play-card (s/tuple #{:play-card} ::player-id ::card-id))
(s/def ::play-text (s/tuple #{:play-text} ::player-id ::card-id ::text-id))
(s/def ::text-effect (s/tuple #{:text-effect} ::card-id ::text-id))
(s/def ::reason (s/or :system ::system
                      :play-card ::play-card
                      :play-text ::play-text
                      :text-effect ::text-effect))

(s/def ::text :game.define.card-text/value)
(s/def ::value (s/keys :req-un [::reason ::text]
                       :opt-un [::clear-cutin-status ::is-option ::is-immediate]))
;;(s/def ::spec (s/tuple any? ::value))

(def effect-value {:reason [:system :A]
                   :text game.define.card-text/card-text-value})

(def reasons [[:system :A] [:play-card :A 0] [:play-text :A 0 0] [:text-effect 0 0]])

(defn tests []
  (s/assert ::value effect-value)
  (s/assert (s/coll-of ::reason) reasons))