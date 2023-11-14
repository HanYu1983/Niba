(ns game.component.table
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.define.effect]
            [game.define.table-item]
            [game.define.runtime]
            [game.tool.card.table]))

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
  (s/assert ::spec ctx)
  (s/assert :game.define.table-item/value item)
  (match item
    ; 所在area或部隊的控制者
    {:type :card}
    :A
    ; 所在area或部隊的控制者
    {:type :chip}
    :A

    {:type :coin :player-id player-id}
    player-id
    
    :else
    (throw (ex-info (str "item not match:" item) {}))))

(defn get-effect-runtime
  "取得效果的執行期資訊"
  [ctx effect]
  (s/assert ::spec ctx)
  (s/assert :game.define.effect/spec effect)
  (match (-> effect second :reason)
    [:system response-player-id]
    {:card-id ["system no card id", nil] :player-id [nil, response-player-id]}

    [:play-card play-card-player-id card-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:play-text play-card-player-id card-id text-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:text-effect card-id text-id]
    (let [response-player-id (->> card-id (get-item ctx) (get-item-controller ctx))]
      {:card-id [nil, card-id] :player-id [nil, response-player-id]})

    :else
    (throw (ex-info "reason not match" {}))))

(defn test-get-effect-runtime []
  (let [ctx {:table game.tool.card.table/table
             :table-items {"gundam" {:type :card
                                     :proto ""}}}
        runtimes (for [effect (map #(assoc game.define.effect/effect-value :reason %) 
                                   [[:system :A] [:play-card :A "gundam"] [:play-text :A "gundam" "text"] [:text-effect "gundam" "text"]])]
                   (get-effect-runtime ctx ["effect-id" effect]))
        _ (doseq [runtime runtimes]
            (s/assert :game.define.runtime/spec runtime))]))

(defn tests []
  (let [ctx (s/assert ::spec {:table game.tool.card.table/table
                              :table-items {}})
        card-item {:type :card :proto ""}
        ctx (add-card-or-chip ctx [:A :hand] "item-1" card-item)
        _ (-> ctx (get-item "item-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))
        coin-item {:type :coin :description "+1/+1/+1" :player-id :A}
        ctx (add-coin ctx "coin-1" coin-item)
        _ (-> ctx (get-item "coin-1") (= coin-item) (or (throw (ex-info "must eq coin-item" {}))))
        coin-item2 (assoc coin-item :description "change")
        ctx (set-item ctx "coin-1" coin-item2)
        _ (-> ctx (get-item "coin-1") (= coin-item2) (or (throw (ex-info "must eq coin-item2" {}))))
        ctx (map-items ctx (fn [[key _]] [key card-item]))
        _ (-> ctx (get-item "coin-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))]) 
  (test-get-effect-runtime))