(ns game.entity.model
  (:require [game.component.table :refer [create-table]]))

(def model (->> {:cuts []
                 :effects {}
                 :table-items {}
                 :phase [:reroll :start]
                 :current-player-id :A
                 :card-proto-pool {}
                 :selection {}}
                (merge (create-table))))