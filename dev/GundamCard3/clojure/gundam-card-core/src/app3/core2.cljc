(ns app3.core2
  (:require [clojure.edn :as edn]
            [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord Card [id is-open is-roll meta])

(defrecord CardStack [id card-ids])

(defn shuffle-card-stack [card-stack]
  (update card-stack :card-ids shuffle))

(defrecord CardTable [card-map card-stack-map])

(defn create-card-table [cards card-stacks])

(defn move-card [table from to options ids])

(defrecord Coin [id meta])
(defrecord CoinTable [coin-map coin-assoc-map])
(defn get-coin [id])
(defn get-coins [assoc-id])


(defrecord Game [card-table coin-table]
  IGame
  (get-card [game]))
