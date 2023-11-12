(ns game.component.table
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.tool.card.table]
            [game.define.table-item]))

(s/def ::table :game.tool.card.table/table)
(s/def ::table-items (s/map-of any? :game.define.table-item/value))
(s/def ::spec (s/keys :req-un [::table ::table-items]))

(defn add-card-or-chip [ctx deck-id item-id card]
  (s/assert ::spec ctx)
  (s/assert :game.define.table-item/value card)
  (-> ctx
      (update :table (fn [table]
                       (game.tool.card.table/add-card table deck-id item-id nil)))
      (update :table-items (fn [table-items]
                             (assoc table-items item-id card)))))

(defn add-coin [ctx item-id coin]
  (s/assert ::spec ctx)
  (s/assert :game.define.table-item/value coin)
  (-> ctx
      (update :table-items (fn [table-items]
                             (assoc table-items item-id coin)))))

(defn map-items [ctx f]
  (s/assert ::spec ctx)
  (-> ctx (update :table-items (fn [table-items]
                                 (->> table-items (map f) (into {}))))))

(defn get-item [ctx item-id]
  (-> ctx :table-items (get item-id)))

(defn set-item [ctx item-id item]
  (update-in ctx [:table-items item-id] (constantly item)))

(defn get-item-controller [ctx item]
  (match item
    ; 所在area或部隊的控制者
    {:type :card}
    nil
    ; 所在area或部隊的控制者
    {:type :chip}
    nil

    {:type :coin :player-id player-id}
    player-id
    
    :else
    (throw (ex-info "item not match" item))))

(defn get-effect-controller [ctx effect]
  (match effect
    [:system player-id] player-id
    [:play-card player-id card-id] player-id
    [:play-text player-id card-id text-id] player-id
    [:text-effect card-id text-id] (get-item-controller ctx card-id)
    :else (throw (ex-info "effect not match" effect))))

(defn tests []
  (let [ctx (s/assert ::spec {:table game.tool.card.table/table
                              :table-items {}})
        card-item {:type :card :proto ""}
        ctx (add-card-or-chip ctx [:A :hand] "item-1" card-item)
        _ (-> ctx (get-item "item-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))
        coin-item {:type :coin :description "+1/+1/+1"}
        ctx (add-coin ctx "coin-1" coin-item)
        _ (-> ctx (get-item "coin-1") (= coin-item) (or (throw (ex-info "must eq coin-item" {}))))
        coin-item2 (assoc coin-item :description "change")
        ctx (set-item ctx "coin-1" coin-item2)
        _ (-> ctx (get-item "coin-1") (= coin-item2) (or (throw (ex-info "must eq coin-item2" {}))))
        ctx (map-items ctx (fn [[key _]] [key card-item]))
        _ (-> ctx (get-item "coin-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))]))