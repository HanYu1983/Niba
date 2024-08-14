(ns tool.component.coin-table
  (:require [clojure.spec.alpha :as s]
            [game.define.coin]
            [game.define.basyou]))

(s/def ::coins (s/map-of any? any?))
(s/def ::coin-id-2-card-id (s/map-of any? any?))
(s/def ::spec (s/keys :req-un [::coins ::coin-id-2-card-id]))

(def coin-table {:coins {}
                 :coin-id-2-card-id {}})

(defn create-table []
  (s/assert ::spec coin-table))

(defn add-coin [ctx card-id id card]
  (s/assert ::spec ctx)
  (-> ctx
      (update :coins assoc id card)
      (update :coin-id-2-card-id assoc id card-id)))

(defn get-coin [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :coins (get id) (or (throw (ex-info (str "coin id not found:" id) {})))))

(defn is-coin [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :coins (get id) nil? not))

(defn remove-coin [ctx id]
  (s/assert ::spec ctx)
  (-> ctx
      (update :coins dissoc id)
      (update :coin-id-2-card-id dissoc id)))

(defn get-coin-ids-by-card-id [ctx card-id]
  (s/assert ::spec ctx)
  (->> ctx :coin-id-2-card-id
       (filter (fn [[_ card-id2]] (= card-id card-id2)))
       (map first)))

(defn tests []
  (let [ctx (s/assert ::spec coin-table)
        coin "coin"
        ctx (-> ctx (add-coin "card0" "0" coin))
        _ (-> ctx (is-coin "0") (or (throw (ex-info "must is coin" {}))))
        _ (-> ctx (get-coin "0") (= coin) (or (throw (ex-info "must be coin" {}))))
        _ (-> ctx (get-coin-ids-by-card-id "card0") vec (= ["0"]) (or (throw (ex-info "must [0]" {}))))
        ctx (-> ctx (remove-coin "0"))
        _ (-> ctx (get-coin-ids-by-card-id "card0") empty? (or (throw (ex-info "must empty" {}))))]))