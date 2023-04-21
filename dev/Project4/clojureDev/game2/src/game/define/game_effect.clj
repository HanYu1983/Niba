(ns game.define.game-effect
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [game.define.card]
            [game.define.card-text]
            [tool.card.table]))

(s/def ::card-id :game.define.card/id)
(s/def ::battle-point :game.define.basic/battle-point)
(s/def ::speed int?)
(s/def ::card-text :game.define.card-text/spec)
(s/def ::spec (s/or :add-battle-point (s/tuple #{:add-battle-point} ::card-id ::battle-point)
                    :attack-speed (s/tuple #{:attack-speed} ::card-id ::speed)
                    :add-text (s/tuple #{:add-text} ::card-id ::card-text)
                    :enter-field-this-turn (s/tuple #{:enter-field-this-turn} ::card-id)
                    :can-not-reroll (s/tuple #{:can-not-reroll} ::card-id)))

(defn tests []
  (s/assert ::spec [:add-battle-point :gundam ["*" 1 2]])
  (s/assert ::spec [:add-text :gundam game.define.card-text/card-text]))