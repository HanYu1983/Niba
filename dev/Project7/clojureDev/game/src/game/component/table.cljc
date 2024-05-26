(ns game.component.table
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.tool.card.table]
            [game.define.effect]
            [game.define.runtime]
            [game.define.card]
            [game.define.chip]
            [game.define.coin]
            [game.define.basyou]
            [game.component.card-table :as card-table]
            [game.component.chip-table :as chip-table]
            [game.component.coin-table :as coin-table]))


(s/def ::spec (s/merge :game.component.card-table/spec
                       :game.component.coin-table/spec
                       :game.component.chip-table/spec))

(def table (merge game.component.card-table/card-table
                  game.component.coin-table/coin-table
                  game.component.chip-table/chip-table))

(defn get-item-ids-by-ba-syou [ctx ba-syou]
  (s/assert ::spec ctx)
  (s/assert :game.define.basyou/spec ba-syou)
  (let [item-ids (-> ctx
                     card-table/get-table
                     (game.tool.card.table/get-decks-deck ba-syou))]
    item-ids))

(defn get-card-controller [ctx card-id]
  (s/assert ::spec ctx)
  ; 所在area或部隊的控制者
  (-> ctx 
      card-table/get-table 
      (game.tool.card.table/get-deck-id-by-card-id card-id) 
      (or (throw (ex-info (str "card not found:" card-id) {})))
      game.define.basyou/get-player-id))

(def get-chip-controller get-card-controller)

(defn get-coin-controller [ctx coin-id]
  (s/assert ::spec ctx)
  (-> ctx
      (coin-table/get-coin coin-id)
      (or (throw (ex-info (str "coin not found:" coin-id) {})))
      game.define.coin/get-player-id))

(defn get-item-controller [ctx item-id]
  (s/assert ::spec ctx)
  (cond
    (card-table/is-card ctx item-id)
    (-> ctx (get-card-controller item-id))

    (chip-table/is-chip ctx item-id)
    (-> ctx (get-chip-controller item-id))

    (coin-table/is-coin ctx item-id)
    (-> ctx (get-coin-controller item-id))))

(defn get-effect-runtime
  "取得效果的執行期資訊"
  [ctx effect]
  (s/assert ::spec ctx)
  (s/assert :game.define.effect/value effect)
  (match (-> effect :reason)
    [:system response-player-id]
    {:card-id ["system no card id", nil] :player-id [nil, response-player-id]}

    [:play-card play-card-player-id card-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:play-text play-card-player-id card-id text-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:text-effect card-id text-id]
    (let [response-player-id (->> card-id (get-item-controller ctx))]
      {:card-id [nil, card-id] :player-id [nil, response-player-id]})

    :else
    (throw (ex-info "reason not match" {}))))

(defn test-get-effect-runtime []
  (let [ctx (-> table
                (game.component.card-table/add-card [:A :maintenance-area] "card-0" game.define.card/value))
        runtimes (for [effect (map #(assoc game.define.effect/effect-value :reason %)
                                   [[:system :A] [:play-card :A "card-0"] [:play-text :A "card-0" "text"] [:text-effect "card-0" "text"]])]
                   (get-effect-runtime ctx effect))
        _ (doseq [runtime runtimes]
            (s/assert :game.define.runtime/spec runtime))]))

(defn test-get-card-ids-by-ba-syou []
  (let [basyou [:A :maintenance-area]
        card-0 game.define.card/value
        ctx table
        ctx (-> ctx (card-table/add-card basyou "card-0" card-0))
        item-ids (-> ctx (get-item-ids-by-ba-syou basyou))
        _ (-> item-ids vec (= ["card-0"]) (or (throw (ex-info "must [card-0]" {}))))]))

(defn tests []
  (let [ctx (s/assert ::spec table)
        card-item game.define.card/value
        ctx (game.component.card-table/add-card ctx [:A :te-hu-ta] "card-1" card-item)
        _ (-> ctx (game.component.card-table/get-card "card-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))
        coin-item (->> {:id "+1/+1/+1"} (merge game.define.coin/coin))
        ctx (game.component.coin-table/add-coin ctx "card-1" "coin-1" coin-item)
        _ (-> ctx (game.component.coin-table/get-coin "coin-1") (= coin-item) (or (throw (ex-info "must eq coin-item" {}))))])
  (test-get-effect-runtime)
  (test-get-card-ids-by-ba-syou))