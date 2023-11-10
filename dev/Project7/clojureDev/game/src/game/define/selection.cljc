(ns game.define.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]))

(s/def ::spec (s/or :card (s/cat :type #{:card} :ids (s/+ any?))
                    :basyou (s/cat :type #{:basyou} :ids (s/+ any?))
                    :battle-point (s/cat :type #{:battle-point} :options (s/+ :game.define.basic/battle-point))))

(defn tests []
  (doseq [selection [[:card 0]
                     [:basyou 1 2]
                     [:battle-point ["*" 1 3] [2 3 4]]]]
    (s/assert ::spec selection)))

