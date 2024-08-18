(ns game.model.table
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [tool.card.table]
            [tool.component.table :refer [get-table]]
            [game.define.effect]
            [game.define.runtime]
            [game.define.card :as card]
            [game.define.chip]
            [game.define.coin]
            [game.define.basyou :as basyou]
            [game.model-spec.core]
            [game.model.card-table :refer [create-card-table get-cards-by-ids is-card add-card get-card is-card]]
            [game.model.chip-table :refer [create-chip-table is-chip]]
            [game.model.coin-table :refer [create-coin-table get-coin is-coin add-coin]]))

(defn create-table []
  (merge (create-card-table)
         (create-chip-table)
         (create-coin-table)))

(defn get-item-ids-by-ba-syou [ctx ba-syou]
  (s/assert :game.model-spec.core/is-table ctx)
  (s/assert :game.define.basyou/spec ba-syou)
  (let [item-ids (-> ctx get-table
                     (tool.card.table/get-decks-deck ba-syou))]
    item-ids))

(defn get-item-ids-by-ba-syou-keyword [ctx ba-syou-keyword]
  (s/assert :game.model-spec.core/is-table ctx)
  (s/assert :game.define.basyou/ba-syou-keyword ba-syou-keyword)
  (let [item-ids (->> ctx get-table
                      tool.card.table/get-decks
                      (filter (fn [[ba-syou _]] (-> ba-syou game.define.basyou/get-ba-syou-keyword (= ba-syou-keyword))))
                      (mapcat (fn [[_ ids]] ids)))]
    item-ids))

(defn get-cards-by-ba-syou [ctx ba-syou]
  (s/assert :game.model-spec.core/is-table ctx)
  (s/assert :game.define.basyou/spec ba-syou)
  (->> ba-syou
       (get-item-ids-by-ba-syou ctx)
       (get-cards-by-ids ctx))
  #_(-> ctx
        (get-item-ids-by-ba-syou ba-syou)
        (#(get-cards-by-ids ctx %))))

(defn get-item-ids-by-player-id [ctx player-id]
  (s/assert :game.model-spec.core/is-table ctx)
  (->> (basyou/get-basyous-by-player-id player-id)
       (filter (comp basyou/is-ba? basyou/get-ba-syou-keyword))
       (mapcat #(get-item-ids-by-ba-syou ctx %))))

(defn get-card-ids-by-player-id [ctx player-id]
  (s/assert :game.model-spec.core/is-table ctx)
  (->> player-id
       (get-item-ids-by-player-id ctx)
       (filter (fn [card-id] (is-card ctx card-id)))))

(defn get-card-controller [ctx card-id]
  (s/assert :game.model-spec.core/is-table ctx)
  ; 所在area或部隊的控制者
  (-> ctx
      get-table
      (tool.card.table/get-deck-id-by-card-id card-id)
      (or (throw (ex-info (str "card not found:" card-id) {})))
      game.define.basyou/get-player-id))

(def get-chip-controller get-card-controller)

(defn get-coin-controller [ctx coin-id]
  (s/assert :game.model-spec.core/is-table ctx)
  (-> ctx
      (get-coin coin-id)
      (or (throw (ex-info (str "coin not found:" coin-id) {})))
      game.define.coin/get-player-id))

(defn get-item-controller [ctx item-id]
  (s/assert :game.model-spec.core/is-table ctx)
  (cond
    (is-card ctx item-id)
    (-> ctx (get-card-controller item-id))

    (is-chip ctx item-id)
    (-> ctx (get-chip-controller item-id))

    (is-coin ctx item-id)
    (-> ctx (get-coin-controller item-id))))

(defn get-effect-player-id [ctx eff]
  (s/assert :game.model-spec.core/is-table ctx)
  (match (-> eff game.define.effect/get-reason)
    [:text-effect card-id _text-id]
    (-> ctx (get-item-controller card-id))
    :else
    (-> eff game.define.effect/get-player-id)))

(defn get-reason-runtime
  "取得效果的執行期資訊"
  [ctx reason]
  (s/assert :game.model-spec.core/is-table ctx)
  (s/assert :game.define.effect/reason reason)
  (match reason
    [:system response-player-id]
    {:card-id ["system no card id", nil] :player-id [nil, response-player-id]}

    [:play-card play-card-player-id card-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:play-text play-card-player-id card-id _text-id]
    {:card-id [nil, card-id] :player-id [nil, play-card-player-id]}

    [:text-effect card-id _text-id]
    (let [response-player-id (->> card-id (get-item-controller ctx))]
      {:card-id [nil, card-id] :player-id [nil, response-player-id]})

    :else
    (throw (ex-info "reason not match" {}))))

(defn get-effect-runtime
  "取得效果的執行期資訊"
  [ctx effect]
  (s/assert :game.model-spec.core/is-table ctx)
  (s/assert :game.define.effect/value effect)
  (get-reason-runtime ctx (:reason effect)))

(defn test-get-effect-runtime []
  (let [ctx (-> (create-table)
                (add-card [:A :maintenance-area] "card-0" (card/create)))
        runtimes (for [effect (map #(assoc game.define.effect/effect-value :reason %)
                                   [[:system :A] [:play-card :A "card-0"] [:play-text :A "card-0" "text"] [:text-effect "card-0" "text"]])]
                   (get-effect-runtime ctx effect))
        _ (doseq [runtime runtimes]
            (s/assert :game.define.runtime/spec runtime))]))

(defn test-get-card-ids-by-ba-syou []
  (let [basyou [:A :maintenance-area]
        card-0 (card/create)
        ctx (create-table)
        ctx (-> ctx (add-card basyou "card-0" card-0))
        item-ids (-> ctx (get-item-ids-by-ba-syou basyou))
        _ (-> item-ids vec (= ["card-0"]) (or (throw (ex-info "must [card-0]" {}))))]))

(defn tests []
  (let [ctx (s/assert :game.model-spec.core/is-table (create-table))
        card-item (card/create)
        ctx (add-card ctx [:A :te-hu-ta] "card-1" card-item)
        _ (-> ctx (get-card "card-1") (= card-item) (or (throw (ex-info "must eq card-item" {}))))
        coin-item (->> {:id "+1/+1/+1"} (merge game.define.coin/coin))
        ctx (add-coin ctx "card-1" "coin-1" coin-item)
        _ (-> ctx (get-coin "coin-1") (= coin-item) (or (throw (ex-info "must eq coin-item" {}))))])
  (test-get-effect-runtime)
  (test-get-card-ids-by-ba-syou))