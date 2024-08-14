(ns tool.component.card-table
  (:require [clojure.spec.alpha :as s]
            [tool.card.table]))

(s/def ::cards (s/map-of any? any?))
(s/def ::spec (s/merge :tool.component.table/spec
                       (s/keys :req-un [::cards])))

(def card-table {:cards {}
                 :table (tool.card.table/create-table)})

(defn create-table []
  (s/assert ::spec card-table))

(defn get-cards [ctx]
  (s/assert ::spec ctx)
  (-> ctx :cards))

(defn set-cards [ctx cards]
  (s/assert ::spec ctx)
  (-> ctx (assoc :cards cards)))

(defn add-card [ctx ba-syou-id id card]
  (s/assert ::spec ctx)
  (-> ctx
      (update :table tool.card.table/add-card ba-syou-id id nil)
      (update :cards assoc id card)))

(defn get-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :cards (get id)))

(defn get-cards-by-ids [ctx ids]
  (s/assert ::spec ctx)
  (-> ctx :cards (keep ids)))

(defn is-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :cards (get id) nil? not))

(defn remove-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx
      (update :cards dissoc id)
      (update :table tool.card.table/remove-card id)))

(defn tests []
  (let [ctx (s/assert ::spec card-table)
        card "card"
        ctx (-> ctx (add-card [:A :maintenance-area] "0" card))
        _ (-> ctx (is-card "0") (or (throw (ex-info "must is card" {}))))
        _ (-> ctx (get-card "0") (= card) (or (throw (ex-info "must be card" {}))))
        _ (-> ctx (remove-card "0"))]))