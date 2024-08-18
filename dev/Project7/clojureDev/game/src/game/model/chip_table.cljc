(ns game.model.chip-table
  (:require [clojure.spec.alpha :as s]
            [tool.component.chip-table]
            [tool.card.table]
            [game.define.chip]
            [game.define.basyou]))

(def create-chip-table tool.component.chip-table/create-chip-table)

(def get-chips tool.component.chip-table/get-chips)

(def get-chip tool.component.chip-table/get-chip)

(def is-chip tool.component.chip-table/is-chip)

(def remove-chip tool.component.chip-table/remove-chip)

(defn add-chip [ctx deck-id id card]
  (s/assert :game.define.basyou/spec deck-id)
  (s/assert :game.define.chip/spec card)
  (-> ctx
      (update :table tool.card.table/add-card deck-id id nil)
      (update :chips assoc id card)))

(defn tests []
  (tool.component.chip-table/tests))