(ns game.define.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.battle-point]))


(s/def ::quantity (s/or :count (s/tuple #{:count} int?)
                        :at-least (s/tuple #{:at-least} int?)
                        :all  #{:all}))

(s/def ::selection-type (s/or :card (s/cat :type #{:card}
                                           :options (s/+ any?))
                              :basyou (s/cat :type #{:basyou}
                                             :options (s/+ any?))
                              :battle-point (s/cat :type #{:battle-point}
                                                   :options (s/+ :game.define.battle-point/spec))))

(s/def ::spec (s/tuple ::selection-type ::quantity))

(defn get-options [selection]
  (s/assert ::spec selection)
  (-> selection first rest))

(defn tests []
  (doseq [selection [[[:card 0] :all]
                     [[:basyou 1 2] [:at-least 1]]
                     [[:battle-point ["*" 1 3] [2 3 4]] [:count 1]]]]
    (s/assert ::spec selection)))

