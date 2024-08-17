(ns game.model.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [tool.card.table :as table]
            [tool.component.table :refer [get-table]]
            [game.data.core]
            [game.data.dynamic]
            [game.define.runtime :as runtime]
            [game.define.card :as card]
            [game.define.card-text :as card-text]
            [game.define.timing]
            [game.define.card-proto :as card-proto]
            [game.define.game-effect]
            [game.define.effect]
            [game.model.effect]
            [game.model.phase]
            [game.model.current-player]
            [game.model.card-table :refer [get-card get-card-protos-by-ids add-card]]
            [game.model.table :refer [create-table get-item-controller get-item-ids-by-ba-syou-keyword get-card-controller get-cards-by-ba-syou]]))

(defn create-model []
  (->> {:cuts []
        :effects {}
        :table-items {}
        :phase [:reroll :start]
        :current-player-id :A
        :card-proto-pool {}
        :selection {}}
       (merge (create-table))
       (s/assert :game.model-spec.core/is-model)))

(defn get-runtime-card-id [_ctx runtime]
  (runtime/get-card-id runtime))

(defn get-runtime-player-id [_ctx runtime]
  (runtime/get-player-id runtime))

(defn get-card-proto [ctx card-id]
  (-> ctx (get-card card-id) card/get-proto-id game.data.core/get-card-data))

(defn get-card-basyou [ctx card-id]
  (-> ctx get-table (table/get-deck-id-by-card-id card-id)))

(defn get-card-type [ctx card-id]
  (-> ctx (get-card-proto card-id) card-proto/get-type))

(defn get-card-runtime-type [ctx card-id]
  (-> ctx 
      (get-card-basyou card-id) 
      (match [_ :g-zone] :graphic :else (get-card-type ctx card-id))
      (#(s/assert :game.define.card-proto/type %))))

; card-text helper
(defn get-play-g-text [ctx runtime])

(defn get-play-card-text [ctx runtime]
  (let [card-id (get-runtime-card-id ctx runtime)
        card-proto (get-card-proto ctx card-id)
        card-runtime-type (get-card-runtime-type ctx card-id)
        common-conditions {"合計國力6"
                           {:tips '(fn [ctx runtime] ctx)
                            :action '(fn [ctx runtime]
                                       (println "合計國力6")
                                       #_(-> ctx game.data.dynamic/get-my-g count (> 6))
                                       ctx)}
                           "横置3個藍G"
                           {:tips '(fn [ctx runtime]
                                     #_(-> ctx game.data.dynamic/get-my-g-can-tap)
                                     ctx)
                            :action '(fn [ctx runtime]
                                       (println "横置3個藍G")
                                       ctx)}
                           "在手牌或hanger"
                           {:tips '(fn [ctx runtime] ctx) :action '(fn [ctx runtime] ctx)}
                           "在配備階段"
                           {:tips '(fn [ctx runtime] ctx) :action '(fn [ctx runtime] ctx)}
                           "放到play-card-zone"
                           {:tips '(fn [ctx runtime] ctx)
                            :action '(fn [ctx runtime]
                                       (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                             player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                             ctx (-> ctx (game.data.dynamic/move-card [player-id :te-hu-ta] [player-id :played-card] card-id))]
                                         ctx))}}
        text (condp = card-runtime-type
               :graphic
               {:type [:automatic :constant]
                :conditions {"是否沒出過G"
                             {:action '(fn [ctx runtime])}}
                :logics {"放到g-zone"
                         {:logic-tree '(And (Leaf "是否沒出過G"))
                          :action '(fn [ctx runtime]
                                     (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                           player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                           ctx (-> ctx (game.data.dynamic/move-card [player-id :te-hu-ta] [player-id :g-zone] card-id))]
                                       ctx))}}}


               :unit
               {:type [:automatic :constant]
                :conditions common-conditions
                :logics {"出機體"
                         {:logic-tree '(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "在手牌或hanger") (Leaf "在配備階段") (Leaf "放到play-card-zone"))
                          :action '(fn [ctx runtime]
                                     (game.data.dynamic/cut-in ctx (->> {:reason [:play-card "" ""]
                                                                         :text (->> {:type :system
                                                                                     :logics {"移到場上"
                                                                                              {:action '(fn [ctx runtime]
                                                                                                          (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                                                                                                player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                                                                                ctx (-> ctx (game.data.dynamic/move-card [player-id :played-card] [player-id :maintenance-area] card-id))]
                                                                                                            ctx))}}}
                                                                                    (merge game.define.card-text/card-text-value)
                                                                                    (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                        (merge game.define.effect/effect-value)
                                                                        (clojure.spec.alpha/assert :game.define.effect/value))))}}}
               
               :command
               {:type [:automatic :constant]
                :conditions common-conditions
                :logics {"出指令"
                         {:logic-tree '(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "在手牌或hanger") (Leaf "在配備階段") (Leaf "放到play-card-zone"))
                          :action '(fn [ctx runtime]
                                     (game.data.dynamic/cut-in ctx (->> {:reason [:play-card "" ""]
                                                                         :text (->> {:type :system
                                                                                     :logics {"移到墓地"
                                                                                              {:action '(fn [ctx runtime]
                                                                                                          (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                                                                                                player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                                                                                ctx (-> ctx (game.data.dynamic/move-card [player-id :played-card] [player-id :junk-yard] card-id))]
                                                                                                            ctx))}}}
                                                                                    (merge game.define.card-text/card-text-value)
                                                                                    (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                        (merge game.define.effect/effect-value)
                                                                        (clojure.spec.alpha/assert :game.define.effect/value))))}}}
               
               :else (throw (ex-info "not impl yet" {:card-runtime-type card-runtime-type})))
        _ (s/assert :game.define.card-text/value text)]
    text))

(defn gen-game-effects-1 [ctx]
  (let [; g
        game-effects-1 (for [card-id (get-item-ids-by-ba-syou-keyword ctx :g-zone)]
                         (let [[card-proto] (get-card-protos-by-ids ctx [card-id])
                               texts (-> card-proto
                                         game.define.card-proto/get-texts
                                         (#(filter (fn [[name text]] (-> text game.define.card-text/is-surrounded-by-arrows)) %)))
                               game-effects-fns (->> texts (mapcat (fn [[name text]] (game.define.card-text/get-game-effects text))))
                               runtime (game.define.runtime/value-of (get-card-controller ctx card-id) card-id)
                               game-effects (->> game-effects-fns (map #(% ctx runtime)))]
                           game-effects))
        ; maintenance-area
        game-effects-2 (->> (for [card-id (get-item-ids-by-ba-syou-keyword ctx :maintenance-area)]
                              (let [[card-proto] (get-card-protos-by-ids ctx [card-id])
                                    texts (-> card-proto game.define.card-proto/get-texts)
                                    game-effects-fns (->> texts (mapcat (fn [[name text]] (game.define.card-text/get-game-effects text))))
                                    runtime (game.define.runtime/value-of (get-card-controller ctx card-id) card-id)
                                    game-effects (->> game-effects-fns (map #(% ctx runtime)))]
                                game-effects))
                            (mapcat identity)
                            (s/assert (s/coll-of :game.define.game-effect/spec)))]
    game-effects-2))

(defn gen-game-effects-2 [ctx]
  (gen-game-effects-1 ctx))

(def gen-game-effects-memo (memoize gen-game-effects-2))


(defn get-card-item-type
  "取得卡片類型, 比如機體或指令"
  [ctx card-id])

(defn get-effect-card-item-type 
  "取得效果的卡片類型, 比如機體效果或指令效果"
  [ctx effect] 
  (s/assert ::spec ctx)
  (match (-> ctx game.define.effect/get-reason)
    [:system player-id] (throw (ex-info "" {} :abc))
    [:play-card player-id card-id] (-> ctx (get-card-item-type card-id))
    [:play-text player-id card-id text-id] (-> ctx (get-card-item-type card-id))
    [:text-effect card-id text-id] (-> ctx (get-card-item-type card-id))))

(defn can-not-be-moved-cards-ids [ctx effect])

;; 自軍効果以外では破壊されずダメージを受けない
;; 敵軍ユニットの効果では破壊されずダメージを受けない
;; 敵軍コマンドの効果では破壊されず移動しない

(defn can-not-be-destroyed-card-ids [ctx effect]
  (s/assert ::spec ctx)
  (->> ctx
       gen-game-effects-memo
       (filter (fn [game-effect]
                 (match game-effect
                   (:or ["敵軍効果では破壊されずダメージを受けない" card-ids & _]
                        ["自軍効果以外では破壊されずダメージを受けない" card-ids & _])
                   (let [player-a (-> effect game.define.effect/get-player-id)
                         can-not-destroyed-card-ids (->> card-ids
                                                         (map #(get-item-controller ctx %))
                                                         (zipmap card-ids)
                                                         (filter (fn [[card-id player-b]]
                                                                   (not= player-a player-b)))
                                                         (map first))]
                     can-not-destroyed-card-ids)

                   ["敵軍ユニットの効果では破壊されずダメージを受けない" card-ids & _]
                   (let [player-a (-> effect game.define.effect/get-player-id)
                         effect-card-item-type (->> effect (get-effect-card-item-type ctx))
                         can-not-destroyed-card-ids (condp = effect-card-item-type
                                                      :unit
                                                      (->> card-ids
                                                           (map #(get-item-controller ctx %))
                                                           (zipmap card-ids)
                                                           (filter (fn [[card-id player-b]]
                                                                     (not= player-a player-b)))
                                                           (map first))
                                                      [])]
                     can-not-destroyed-card-ids)

                   ["敵軍コマンドの効果では破壊されず移動しない" card-ids & _]
                   (let [player-a (-> effect game.define.effect/get-player-id)
                         effect-card-item-type (->> effect (get-effect-card-item-type ctx))
                         can-not-destroyed-card-ids (condp = effect-card-item-type
                                                      :command
                                                      (->> card-ids
                                                           (map #(get-item-controller ctx %))
                                                           (zipmap card-ids)
                                                           (filter (fn [[card-id player-b]]
                                                                     (not= player-a player-b)))
                                                           (map first))
                                                      [])]
                     can-not-destroyed-card-ids)

                   :else [])))
       (mapcat identity)
       (into {})))

(def can-not-be-destroyed-card-ids-memo (memoize can-not-be-destroyed-card-ids))

(defn test-play-card-text []
  (let [player-a :A
        model (create-model)
        ctx (-> model (add-card [player-a :te-hu-ta] "0" (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"})))
        runtime (runtime/value-of "0" player-a)
        play-card-text (-> ctx (get-play-card-text runtime))
        ; 指定對象, 對象無法滿足的話不能play
        logic (-> play-card-text
                  card-text/get-logics
                  (get (-> play-card-text card-text/get-logics-ids first)))
        conditions (-> play-card-text (card-text/get-logic-conditions logic))
        ; 支付
        ctx (->> conditions vals (map card-text/get-condition-tips) (map (fn [f] (or f identity))) (reduce (fn [ctx f] (f ctx runtime)) ctx))
        ctx (->> conditions vals (map card-text/get-condition-action) (map (fn [f] (or f identity))) (reduce (fn [ctx f] (f ctx runtime)) ctx))
        ; 效果發生
        _ctx (-> logic (card-text/get-logic-action) (#(% ctx runtime)))
        _ (-> ctx (get-cards-by-ba-syou [player-a :te-hu-ta]) count zero? (or (throw (ex-info "player-a te-hu-ta must 0" {}))))
        _ (-> ctx (get-cards-by-ba-syou [player-a :played-card]) count (= 1) (or (throw (ex-info "player-a played-card must 1" {}))))]))

(defn tests []
  (test-play-card-text)
  (let [model (create-model)]
  ; test gen-game-effects
    (let [card (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"})
          ctx (-> model
                  (add-card [:A :maintenance-area] "0" card)
                  (add-card [:B :maintenance-area] "1" card))
          game-effects (gen-game-effects-memo ctx)
        ;_ (println game-effects)
          ])))