(ns tool.card.table
  (:require [clojure.spec.alpha :as s]))

(s/def ::card-id any?)
(s/def ::card any?)
(s/def ::deck-id any?)
(s/def ::deck (s/coll-of ::card-id))
(s/def ::decks (s/map-of ::deck-id ::deck))
(s/def ::cards (s/map-of ::card-id ::card))
(s/def ::table (s/keys :req-un [::decks ::cards]))

(def table {:decks {}
            :cards {}})

(defn create-table []
  (s/assert ::table table))

(defn map-card [table f]
  (s/assert ::table table)
  (update table :cards #(into {} (map (fn [[card-id card]] [card-id (f card)]) %))))

(defn add-card [table deck-id card-id card]
  (s/assert ::table table)
  (-> table
      (update :cards #(assoc % card-id card))
      (update :decks (fn [decks]
                       (if (get decks deck-id)
                         (update decks deck-id #(conj % card-id))
                         (assoc decks deck-id [card-id]))))))

(defn get-deck-id-by-card-id [table card-id]
  (s/assert ::table table)
  (some->> table :decks (filter #(some #{card-id} (second %))) first first))

(defn get-decks [table]
  (s/assert ::table table)
  (-> table :decks))

(defn set-decks [table decks]
  (s/assert ::table table)
  (-> table (assoc :decks decks) (#(s/assert ::table %))))

(defn get-decks-deck [table deck-id]
  (s/assert ::table table)
  (-> table get-decks (get deck-id)))

(defn move-card [table from-deck-id to-deck-id card-id]
  (s/assert ::table table)
  (-> table get-decks
      (update from-deck-id (fn [deck] (remove #(= % card-id) deck)))
      (update to-deck-id conj card-id)
      (#(set-decks table %))))

#_(defn get-deck [deck deck-id]
    (s/assert ::deck deck)
    (-> deck (get deck-id)))

(defn remove-card [table card-id]
  (s/assert ::table table)
  (-> table
      (update :decks (fn [decks]
                       (->> decks
                            (map (fn [[deck-id cards]]
                                   [deck-id (into [] (remove #(= % card-id) cards))]))
                            (into {}))))
      (update :cards dissoc card-id)))

(defn shuffle-deck [table deck-id]
  (s/assert ::table table)
  (-> table
      (update-in [:decks deck-id] shuffle)))