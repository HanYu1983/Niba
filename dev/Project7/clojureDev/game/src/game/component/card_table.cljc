(ns game.component.card-table
  (:require [clojure.spec.alpha :as s]
            [game.tool.card.table]
            [game.data.core]
            [game.define.card]
            [game.define.basyou]))

(s/def ::table :game.tool.card.table/table)
(s/def ::cards (s/map-of any? :game.define.card/spec))
(s/def ::spec (s/keys :req-un [::table ::cards]))

(def table-path [:table])
(def cards-path [:cards])
(defn card-path [card-id] [:cards card-id])
(defn card-is-roll-path [card-id] (into (card-path card-id) game.define.card/is-roll-path))


(def card-table {:cards {}
                 :table game.tool.card.table/table})

(defn get-table [ctx]
  (s/assert ::spec ctx)
  (-> ctx :table))

(defn set-table [ctx table]
  (s/assert ::spec ctx)
  (-> ctx (assoc :table table)))

(defn get-cards [ctx]
  (s/assert ::spec ctx)
  (-> ctx :cards))

(defn set-cards [ctx cards]
  (s/assert ::spec ctx)
  (-> ctx (assoc :cards cards)))

(defn add-card [ctx ba-syou-id id card]
  (s/assert ::spec ctx)
  (s/assert :game.define.basyou/spec ba-syou-id)
  (s/assert :game.define.card/spec card)
  (-> ctx
      (update :table game.tool.card.table/add-card ba-syou-id id nil)
      (update :cards assoc id card)))

(defn get-card [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :cards (get id) #_(or (throw (ex-info (str "card id not found:" id) {})))))

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
      (update :table game.tool.card.table/remove-card id)))

(defn get-card-protos-by-ids [ctx ids]
  (s/assert ::spec ctx)
  (-> ctx :cards (map ids)
      (#(map game.define.card/get-proto-id %))
      (#(map game.data.core/get-card-data %))
      (#(s/assert (s/coll-of :game.define.card-proto/value) %))))

(defn move-card [ctx from-ba-syou-id to-ba-syou-id card-id]
  (s/assert ::spec ctx)
  (s/assert :game.define.basyou/spec from-ba-syou-id)
  (s/assert :game.define.basyou/spec to-ba-syou-id)
  (-> ctx (is-card card-id)
      (or (throw (ex-info "card not found" {:card-id card-id} :card-not-found))))
  (-> ctx get-table game.tool.card.table/get-decks (get from-ba-syou-id) (#(some #{card-id} %))
      (or (throw (ex-info "card not found in ba-syou" {:ba-syou-id from-ba-syou-id} :card-not-found-in-ba-syou))))
  (-> ctx get-table (game.tool.card.table/move-card from-ba-syou-id to-ba-syou-id card-id) (#(set-table ctx %))))

(defn set-card-is-roll [ctx ba-syou-id card-id is-roll]
  (s/assert ::spec ctx)
  (s/assert :game.define.basyou/spec ba-syou-id)
  #_(-> ctx (update-in (card-is-roll-path card-id) is-roll))

  (-> ctx (is-card card-id)
      (or (throw (ex-info "card not found" {:card-id card-id} :card-not-found))))
  (-> ctx get-table game.tool.card.table/get-decks (get ba-syou-id) (#(some #{card-id} %))
      (or (throw (ex-info "card not found in ba-syou" {:ba-syou-id ba-syou-id} :card-not-found-in-ba-syou))))
  (-> ctx get-cards (update card-id game.define.card/set-is-roll is-roll) (#(set-cards ctx %))))

(defn tests []
  (let [ctx (s/assert ::spec card-table)
        card game.define.card/value
        ctx (-> ctx (add-card [:A :maintenance-area] "0" card))
        _ (-> ctx (is-card "0") (or (throw (ex-info "must is card" {}))))
        _ (-> ctx (get-card "0") (= card) (or (throw (ex-info "must be card" {}))))
        ctx (-> ctx (remove-card "0"))])


  (let [ctx card-table
        card (-> game.define.card/value (assoc :proto-id "179030_11E_U_BL209R_blue"))
        ctx (-> ctx (add-card [:A :maintenance-area] "0" card))
        _ (-> ctx (get-card-protos-by-ids ["0"]))]))