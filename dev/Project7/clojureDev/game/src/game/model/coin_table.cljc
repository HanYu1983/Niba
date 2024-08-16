(ns game.model.coin-table
  (:require [clojure.spec.alpha :as s]
            [tool.component.coin-table]
            [game.define.coin]
            [game.define.basyou]))

(def create-coin-table tool.component.coin-table/create-coin-table)

(defn add-coin [ctx card-id id card]
  (s/assert :game.define.coin/spec card)
  (tool.component.coin-table/add-coin ctx card-id id card))

(def get-coin tool.component.coin-table/get-coin)

(def is-coin tool.component.coin-table/is-coin)

(def remove-coin tool.component.coin-table/remove-coin)

(def get-coin-ids-by-card-id tool.component.coin-table/get-coin-ids-by-card-id)

(defn tests []
  (tool.component.coin-table/tests))