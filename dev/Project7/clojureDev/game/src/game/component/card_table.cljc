(ns game.component.card-table
  (:require [clojure.spec.alpha :as s]
            [game.define.card]
            [game.define.basyou]
            [game.tool.card.table]))

(s/def ::table :game.tool.card.table/table)
(s/def ::cards (s/map-of any? :game.define.card/spec))
(s/def ::spec (s/keys :req-un [::table ::cards]))

(def card-table {:cards {}
                 :table game.tool.card.table/table})

(defn get-table [ctx]
  (s/assert ::spec ctx)
  (-> ctx :table))

(defn get-cards [ctx]
  (s/assert ::spec ctx)
  (-> ctx :cards))

(defn add-card [ctx deck-id id card]
  (s/assert ::spec ctx)
  (s/assert :game.define.basyou/spec deck-id)
  (s/assert :game.define.card/spec card)
  (-> ctx
      (update :table game.tool.card.table/add-card deck-id id nil)
      (update :cards assoc id card)))

(defn get-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :cards (get id) (or (throw (ex-info (str "card id not found:" id) {})))))

(defn is-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :cards (get id) nil? not))

(defn remove-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx
      (update :cards dissoc id)
      (update :table game.tool.card.table/remove-card id)))

(defn tests []
  (let [ctx (s/assert ::spec card-table)
        card game.define.card/value
        ctx (-> ctx (add-card [:A :maintenance-area] "0" card))
        _ (-> ctx (is-card "0") (or (throw (ex-info "must is card" {}))))
        _ (-> ctx (get-card "0") (= card) (or (throw (ex-info "must be card" {}))))
        ctx (-> ctx (remove-card "0"))]))