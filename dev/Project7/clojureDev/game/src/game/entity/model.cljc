(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.tool.card.table]
            [game.data.core]
            [game.define.runtime]
            [game.define.card]
            [game.define.card-text]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.component.phase]
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
                           {:tips '(fn [ctx runtime] ctx)
                            :count 0
                            :options {}
                            :action '(fn [ctx runtime]
                                       (-> ctx game.data.dynamic/get-my-g count (> 6)))}
                           "横置3個藍G"
                           {:tips '(fn [ctx runtime] ctx
                                     (-> ctx game.data.dynamic/get-my-g-can-tap))
                            :count 3
                            :options {}
                            :action '(fn [ctx runtime]
                                       ctx)}
                           "在手牌或hanger"
                           {:action '(fn [ctx] ctx)}
                           "在配備階段"
                           {:action '(fn [ctx] ctx)}
                           "放到play-card-zone"
                           {:tips '(fn [ctx runtime]
                                     ctx)
                            :action '(fn [ctx runtime]
                                       ctx)}}
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

(defn tests []
  (s/assert ::spec model)
  (let [ctx (-> model (card-table/add-card [:A :maintenance-area] "0"
                                           (->> {:proto-id "179030_11E_U_BL209R_blue"}
                                                (merge game.define.card/value))))
        _ (-> ctx (get-play-card-text (game.define.runtime/value-of "0" :A)) (#(s/assert :game.define.card-text/value %)))]))