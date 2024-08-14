(ns game.entity.model
  (:require [game.component.table]))

(def model (->> {:cuts []
                 :effects {}
                 :table-items {}
                 :phase [:reroll :start]
                 :current-player-id :A
                 :card-proto-pool {}
                 :selection {}}
                (merge game.component.table/table)))