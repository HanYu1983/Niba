(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.tool.card.table]
            [game.data.core]
            [game.data.dynamic]
            [game.define.runtime]
            [game.define.card]
            [game.define.card-text]
            [game.define.timing]
            [game.define.card-proto]
            [game.define.game-effect]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.component.phase :as phase]
            [game.component.current-player]
            [game.component.card-table :as card-table]
            [game.component.table :as table]))
(s/def ::spec (s/merge :game.component.cuts/spec
                       :game.component.effect/spec
                       :game.component.card-proto/spec
                       :game.component.table/spec
                       :game.component.phase/spec
                       :game.component.current-player/spec))
(def model (->> {:cuts []
                 :effects {}
                 :table-items {}
                 :phase [:reroll :start]
                 :current-player-id :A
                 :card-proto-pool {}}
                (merge table/table)))
; card-text helper
(defn get-play-card-text [ctx runtime]
  (let [card-proto (-> runtime
                       game.define.runtime/get-card-id
                       (#(card-table/get-card ctx %))
                       game.define.card/get-proto-id
                       game.data.core/get-card-data)
        text {:type [:automatic :constant]
              :conditions {"合計國力6"
                           ['(fn [ctx runtime] ctx)
                            '(fn [ctx runtime]
                               (-> ctx game.data.dynamic/get-my-g count (> 6)))]
                           "横置3個藍G"
                           ['(fn [ctx runtime] ctx
                               (-> ctx game.data.dynamic/get-my-g-can-tap))
                            '(fn [ctx runtime]
                               ctx)]
                           "在手牌或hanger"
                           ['(fn [ctx] ctx) '(fn [ctx] ctx)]
                           "在配備階段"
                           ['(fn [ctx] ctx) '(fn [ctx] ctx)]
                           "放到play-card-zone"
                           ['(fn [ctx] ctx) '(fn [ctx] ctx)]}
              :logic {"出機體"
                      ['(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                       '(fn [ctx runtime]
                          (game.data.dynamic/cut-in ctx (->> {:reason [:play-card ""]
                                                              :text (->> {:type :system
                                                                          :logic {"移到場上"
                                                                                  [nil
                                                                                   '(fn [ctx runtime]
                                                                                      ctx)]}}
                                                                         (merge game.define.card-text/card-text-value)
                                                                         (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                             (merge game.define.effect/effect-value)
                                                             (clojure.spec.alpha/assert :game.define.effect/value))))]}}]
    text))

(defn gen-game-effects-1 [ctx]
  (let [; g
        game-effects-1 (for [card-id (table/get-item-ids-by-ba-syou-keyword ctx :g-zone)]
                         (let [[card-proto] (card-table/get-card-protos-by-ids ctx [card-id])
                               texts (-> card-proto
                                         game.define.card-proto/get-texts
                                         (#(filter (fn [[name text]] (-> text game.define.card-text/is-surrounded-by-arrows)) %)))
                               game-effects-fns (->> texts (mapcat (fn [[name text]] (game.define.card-text/get-game-effects text))))
                               runtime (game.define.runtime/value-of (table/get-card-controller ctx card-id) card-id)
                               game-effects (->> game-effects-fns (map #(% ctx runtime)))]
                           game-effects))
        ; maintenance-area
        game-effects-2 (->> (for [card-id (table/get-item-ids-by-ba-syou-keyword ctx :maintenance-area)]
                              (let [[card-proto] (card-table/get-card-protos-by-ids ctx [card-id])
                                    texts (-> card-proto game.define.card-proto/get-texts)
                                    game-effects-fns (->> texts (mapcat (fn [[name text]] (game.define.card-text/get-game-effects text))))
                                    runtime (game.define.runtime/value-of (table/get-card-controller ctx card-id) card-id)
                                    game-effects (->> game-effects-fns (map #(% ctx runtime)))]
                                game-effects))
                            (mapcat identity)
                            (s/assert (s/coll-of :game.define.game-effect/spec)))]
    game-effects-2))

(defn gen-game-effects-2 [ctx]
  (gen-game-effects-1 ctx))

(defn can-be-destroyed-card-id [ctx player-id]
  (s/assert ::spec ctx)
  (->> ctx
       gen-game-effects-2
       (filter (fn [game-effect]
                 (match game-effect
                   ["敵軍効果では破壊されずダメージを受けない" card-ids & _]
                   (->> card-ids (filter (fn [card-id] card-id)))

                   :else [])))
       (mapcat identity)
       (into {})))

(defn on-move-card [ctx from-ba-syou-id to-ba-syou-id card-id]
  ctx)

(defn move-card [ctx from-ba-syou-id to-ba-syou-id card-id]
  (s/assert ::spec ctx)
  (-> ctx
      (card-table/move-card from-ba-syou-id to-ba-syou-id card-id)
      (on-move-card from-ba-syou-id to-ba-syou-id card-id)))

(defmethod game.data.dynamic/get-my-g :default [ctx player-id] ["0"])
(defmethod game.data.dynamic/get-card-chars :default [ctx card-id] ["0"])
(defmethod game.data.dynamic/get-card-color :default [ctx card-id] ["0"])
(defmethod game.data.dynamic/is-card-color-blue :default [color] true)

(defn tests []
  (s/assert ::spec model)
  (let [ctx (-> model (card-table/add-card [:A :maintenance-area] "0"
                                           (->> {:proto-id "179030_11E_U_BL209R_blue"}
                                                (merge game.define.card/value))))
        _ (-> ctx (get-play-card-text (game.define.runtime/value-of "0" :A)) (#(s/assert :game.define.card-text/value %)))])

  ; test gen-game-effects
  (let [card (->> {:proto-id "179030_11E_U_BL209R_blue"}
                  (merge game.define.card/value))
        ctx (-> model
                (card-table/add-card [:A :maintenance-area] "0" card)
                (card-table/add-card [:B :maintenance-area] "1" card))
        game-effects (gen-game-effects-2 ctx)
        ;_ (println game-effects)
        ]))