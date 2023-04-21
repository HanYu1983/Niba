(ns tool.card.table
  (:require [clojure.spec.alpha :as s]))

(s/def ::card-id any?)
(s/def ::card any?)
(s/def ::deck-id any?)
(s/def ::deck (s/map-of ::card-id ::card))
(s/def ::decks (s/map-of ::deck-id ::deck))
(s/def ::cards (s/map-of ::card-id ::card))
(s/def ::table (s/keys :req-un [::decks ::cards]))

(def ^:private table {:decks {}
                      :cards {}})

(defn create-table []
  table)

(defn map-card [table f]
  (update table :cards #(into {} (map (fn [[card-id card]] [card-id (f card)]) %))))

(defn add-card [table deck-id card-id card]
  (-> table
      (update :cards #(assoc % card-id card))
      (update :decks (fn [decks]
                       (if (deck-id decks)
                         (update decks deck-id #(conj % card-id))
                         (assoc decks deck-id [card-id]))))))

(defn remove-card [table card-id]
  (-> table
      (update :decks (fn [decks]
                       (->> decks
                            (map (fn [[deck-id cards]]
                                   [deck-id (into [] (remove #(= % card-id) cards))]))
                            (into {}))))
      (update :cards dissoc card-id)))

(defn shuffle-deck [table deck-id]
  (-> table
      (update-in [:decks deck-id] shuffle)))