(ns game.entity.model
  (:require [clojure.spec.alpha :as s]
            [game.tool.card.table]
            [game.data.core]
            [game.define.runtime]
            [game.define.card]
            [game.define.card-text]
            [game.define.table-item-card]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.component.phase]
            [game.component.current-player]
            [game.component.table :as table]))
(s/def ::spec (s/merge :game.component.cuts/spec
                       :game.component.effect/spec
                       ;:game.component.card-proto/spec
                       :game.component.table/spec
                       :game.component.phase/spec
                       :game.component.current-player/spec))
(def model (->> {:cuts []
                 :effects {}
                 :table-items {}
                 :phase [:reroll :start]
                 :current-player-id :A}
                (merge game.component.table/table-component)))
; card-text helper
(defn get-play-card-text [ctx runtime]
  (let [card-proto (-> runtime
                       game.define.runtime/get-card-id
                       (#(table/get-card ctx %))
                       game.define.card/get-proto-id
                       game.data.core/get-card-data)
        text game.define.card-text/card-text-value]
    text))

(defn tests []
  (s/assert ::spec model)
  (let [ctx (-> model (table/add-card-or-chip [:A :maintenance-area] "0"
                                              (game.define.table-item-card/value-of
                                               (->> {:proto-id "179030_11E_U_BL209R_blue"}
                                                    (merge game.define.card/value)))))
        _ (-> (get-play-card-text ctx (game.define.runtime/value-of "0" :A)))]))