(ns game.component.table
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.tool.card.table]
            [game.define.effect]
            [game.define.runtime]
            [game.define.card]
            [game.define.chip]
            [game.define.coin]
            [game.component.card-table]
            [game.component.chip-table]
            [game.component.coin-table]))


(s/def ::spec (s/merge :game.component.card-table/spec
                       :game.component.coin-table/spec
                       :game.component.chip-table/spec))

(def table (merge game.component.card-table/card-table
                  game.component.coin-table/coin-table
                  game.component.chip-table/chip-table))

(defn get-card-controller [ctx card-id]
  ; 所在area或部隊的控制者
  :A)


#_(defn get-item-controller [ctx item]
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
  (s/assert :game.define.effect/value effect)
  (match (-> effect :reason)
    [:system response-player-id]
    {:card-id ["system no card id", nil] :player-id [nil, response-player-id]}

    [:play-card play-card-player-id card-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:play-text play-card-player-id card-id text-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:text-effect card-id text-id]
    (let [response-player-id (->> card-id (get-card-controller ctx))]
      {:card-id [nil, card-id] :player-id [nil, response-player-id]})

    :else
    (throw (ex-info "reason not match" {}))))

(defn test-get-effect-runtime []
  (let [ctx (-> table
                (game.component.card-table/add-card [:A :maintenance-area] "0" game.define.card/value))
        runtimes (for [effect (map #(assoc game.define.effect/effect-value :reason %)
                                   [[:system :A] [:play-card :A "gundam"] [:play-text :A "gundam" "text"] [:text-effect "gundam" "text"]])]
                   (get-effect-runtime ctx effect))
        _ (doseq [runtime runtimes]
            (s/assert :game.define.runtime/spec runtime))]))

(defn tests []
  (let [ctx (s/assert ::spec table)
        card-item game.define.card/value
        ctx (game.component.card-table/add-card ctx [:A :te-hu-ta] "card-1" card-item)
        _ (-> ctx (game.component.card-table/get-card "card-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))
        coin-item {:id "+1/+1/+1"}
        ctx (game.component.coin-table/add-coin ctx "card-1" "coin-1" coin-item)
        _ (-> ctx (game.component.coin-table/get-coin "coin-1") (= coin-item) (or (throw (ex-info "must eq coin-item" {}))))])
  (test-get-effect-runtime))