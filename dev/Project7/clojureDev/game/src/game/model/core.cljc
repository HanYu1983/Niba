(ns game.model.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.data.core]
            [game.data.dynamic]
            [game.define.runtime :as runtime]
            [game.define.card :as card]
            [game.define.card-text :as card-text]
            [game.define.timing]
            [game.define.card-proto]
            [game.define.game-effect]
            [game.define.effect]
            [game.model.effect]
            [game.model.phase]
            [game.model.current-player]
            [game.model.card-table :refer [get-card get-card-protos-by-ids add-card]]
            [game.model.table :refer [create-table get-item-controller get-item-ids-by-ba-syou-keyword get-card-controller]]))

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

; card-text helper
(defn get-play-card-text [ctx runtime]
  (let [card-proto (-> runtime
                       runtime/get-card-id
                       (#(get-card ctx %))
                       card/get-proto-id
                       game.data.core/get-card-data)
        text {:type [:automatic :constant]
              :conditions {"合計國力6"
                           {:tips '(fn [ctx runtime] ctx)
                            :action '(fn [ctx runtime]
                                       (println "use total power 6")
                                       #_(-> ctx game.data.dynamic/get-my-g count (> 6)))}
                           "横置3個藍G"
                           {:tips '(fn [ctx runtime] ctx
                                     #_(-> ctx game.data.dynamic/get-my-g-can-tap))
                            :action '(fn [ctx runtime]
                                       (println "reroll 3 blue g")
                                       ctx)}
                           "在手牌或hanger"
                           {:tips '(fn [ctx runtime] ctx) :action '(fn [ctx runtime] ctx)}
                           "在配備階段"
                           {:tips '(fn [ctx runtime] ctx) :action '(fn [ctx runtime] ctx)}
                           "放到play-card-zone"
                           {:tips '(fn [ctx runtime] ctx) :action '(fn [ctx runtime] ctx)}}
              :logics {"出機體"
                       {:logic-tree '(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                        :action '(fn [ctx runtime]
                                   (game.data.dynamic/cut-in ctx (->> {:reason [:play-card "" ""]
                                                                       :text (->> {:type :system
                                                                                   :logics {"移到場上"
                                                                                            {:action '(fn [ctx runtime]
                                                                                                        ctx)}}}
                                                                                  (merge game.define.card-text/card-text-value)
                                                                                  (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                      (merge game.define.effect/effect-value)
                                                                      (clojure.spec.alpha/assert :game.define.effect/value))))}}}
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
  (let [model (create-model)
        ctx (-> model (add-card [:A :maintenance-area] "0" (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"})))
        runtime (runtime/value-of "0" :A)
        play-card-text (-> ctx (get-play-card-text runtime))
            ; 指定對象, 對象無法滿足的話不能play
        logic (-> play-card-text
                  card-text/get-logics
                  (get (-> play-card-text card-text/get-logics-ids first)))
        conditions (-> play-card-text (card-text/get-logic-conditions logic))
            ; 支付
        _ (->> conditions vals (map card-text/get-condition-tips) (map #(% ctx runtime)) doall)
        _ (->> conditions vals (map card-text/get-condition-action) (map #(% ctx runtime)) doall)
          ; 效果發生
        _ (-> logic (card-text/get-logic-action) (#(% ctx runtime)))]))

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