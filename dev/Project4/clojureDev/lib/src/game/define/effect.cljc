(ns game.define.effect
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [game.define.card]
            [game.define.player]
            [game.define.card-text]
            [tool.card.table]))

(s/def ::card-id :game.define.card/id)
(s/def ::player-id :game.define.player/id)
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
;
(s/def ::id string?)
(s/def ::text :game.define.card-text/spec)
(s/def ::is-immediate boolean?)
(s/def ::is-option boolean?)
(s/def ::spec (s/keys :req-un [::id ::reason ::text]
                      :opt-un [::is-immediate ::is-option]))

(def effect {:id "1"
             :reason [:system :A]
             :text game.define.card-text/card-text
             :is-immediate true
             :is-option false})

(def reasons [[:system :A] [:play-card :A 0] [:play-text :A 0 0] [:text-effect 0 0]])

(defn tests []
  (s/assert ::spec effect)
  (s/assert (s/coll-of ::reason) reasons))