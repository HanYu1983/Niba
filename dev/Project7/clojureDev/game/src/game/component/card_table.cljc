(ns game.component.card-table
  (:require [clojure.spec.alpha :as s]
            [tool.card.table]
            [tool.component.card-table]
            [game.data.core]
            [game.define.card]
            [game.define.basyou]))

(def card-table (tool.component.card-table/create-table))

(def get-table tool.component.card-table/get-table)

(def set-table tool.component.card-table/set-table)

(def get-cards tool.component.card-table/get-cards)

(def set-cards tool.component.card-table/set-cards)

(defn add-card [ctx ba-syou-id id card]
  (s/assert :game.define.basyou/spec ba-syou-id)
  (s/assert :game.define.card/spec card)
  (tool.component.card-table/add-card ctx ba-syou-id id card))

(def get-card tool.component.card-table/get-card)

(def get-cards-by-ids tool.component.card-table/get-cards-by-ids)

(def is-card tool.component.card-table/is-card)

(def remove-card tool.component.card-table/remove-card)

(defn get-card-protos-by-ids [ctx ids]
  (-> ctx :cards (map ids)
      (#(map game.define.card/get-proto-id %))
      (#(map game.data.core/get-card-data %))
      (#(s/assert (s/coll-of :game.define.card-proto/value) %))))

(defn move-card [ctx from-ba-syou-id to-ba-syou-id card-id]
  (s/assert :game.define.basyou/spec from-ba-syou-id)
  (s/assert :game.define.basyou/spec to-ba-syou-id)
  (-> ctx (is-card card-id)
      (or (throw (ex-info "card not found" {:card-id card-id} :card-not-found))))
  (-> ctx get-table tool.card.table/get-decks (get from-ba-syou-id) (#(some #{card-id} %))
      (or (throw (ex-info "card not found in ba-syou" {:ba-syou-id from-ba-syou-id} :card-not-found-in-ba-syou))))
  (-> ctx get-table (tool.card.table/move-card from-ba-syou-id to-ba-syou-id card-id) (#(set-table ctx %))))

(defn set-card-is-roll [ctx ba-syou-id card-id is-roll]
  (s/assert :game.define.basyou/spec ba-syou-id)
  #_(-> ctx (update-in (card-is-roll-path card-id) is-roll))

  (-> ctx (is-card card-id)
      (or (throw (ex-info "card not found" {:card-id card-id} :card-not-found))))
  (-> ctx get-table tool.card.table/get-decks (get ba-syou-id) (#(some #{card-id} %))
      (or (throw (ex-info "card not found in ba-syou" {:ba-syou-id ba-syou-id} :card-not-found-in-ba-syou))))
  (-> ctx get-cards (update card-id game.define.card/set-is-roll is-roll) (#(set-cards ctx %))))

(defn tests []
  (tool.component.card-table/tests)
  (let [ctx card-table
        card (-> game.define.card/value (assoc :proto-id "179030_11E_U_BL209R_blue"))
        ctx (-> ctx (add-card [:A :maintenance-area] "0" card))
        _ (-> ctx (get-card-protos-by-ids ["0"]))]))