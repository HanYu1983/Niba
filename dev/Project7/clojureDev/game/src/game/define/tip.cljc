(ns game.define.tip
  (:require [clojure.spec.alpha :as s]
            [game.define.battle-point]
            [game.define.basyou]))


(s/def ::quantity (s/or :count (s/tuple #{:count} int?)
                        :at-least (s/tuple #{:at-least} int?)))

(s/def ::tip-selection-card (s/cat :type #{:card}
                                   :options (s/+ any?)))

(s/def ::tip-selection-unit (s/cat :type #{:unit}
                                   :options (s/+ (s/tuple any? :game.define.basyou/spec))))

(s/def ::tip-selection-basyou (s/cat :type #{:basyou}
                                     :options (s/+ :game.define.basyou/spec)))

(s/def ::tip-selection-basyou-keyword (s/cat :type #{:basyou-keyword}
                                             :options (s/+ :game.define.basyou/ba-syou-keyword)))

(s/def ::tip-selection-battle-point (s/cat :type #{:battle-point}
                                           :options (s/+ :game.define.battle-point/spec)))

(s/def ::tip-selection (s/or :card ::tip-selection-card
                             :unit ::tip-selection-unit
                             :basyou ::tip-selection-basyou
                             :basyou-keyword ::tip-selection-basyou-keyword
                             :battle-point ::tip-selection-battle-point))

(s/def ::spec (s/tuple any? ::tip-selection ::quantity))

(defn get-id [tip]
  (s/assert ::spec tip)
  (-> tip first))

(defn get-tip-selection [tip]
  (s/assert ::spec tip)
  (-> tip second))

(defn get-tip-selection-type [tip-selection]
  (s/assert ::tip-selection tip-selection)
  (-> tip-selection first))

(defn get-tip-selection-items [tip-selection]
  (s/assert ::tip-selection tip-selection)
  (-> tip-selection rest vec))

(defn get-tip-selection-items-unit-id [tip-selection]
  (s/assert ::tip-selection tip-selection)
  (-> tip-selection get-tip-selection-type (= :unit) (or (throw (ex-info "tip type must be unit" {}))))
  (->> tip-selection get-tip-selection-items (map first) vec))

(defn tests []
  (doseq [tips [[:tip-1 [:card 0] [:count 1]]
                [:tip-2 [:basyou [:A :maintenance-area] [:B :junk-yard]] [:at-least 1]]
                [:tip-3 [:basyou-keyword :maintenance-area] [:count 2]]
                [:tip-4 [:battle-point ["*" 1 3] [2 3 4]] [:count 1]]
                [:tip-5 [:unit [0 [:A :maintenance-area]]] [:count 1]]
                [:select-one-unit [:unit ["player-a-unit-0" [:A :maintenance-area]] ["player-a-unit-1" [:A :maintenance-area]]] [:count 1]]]]
    (s/assert ::spec tips)))

