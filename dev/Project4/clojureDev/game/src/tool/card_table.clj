(ns tool.card-table
  (:require [clojure.spec.alpha :as s]))


(s/def ::card-stacks map?)
(s/def ::cards map?)
(s/def ::table (s/keys :req-un [::card-stacks ::cards]))

(def ^:private table {:card-stacks {}
                      :cards {}})

(defn create-table []
  table)

(defn add-card [table card-stack-id card])

(defn move-card [table from-card-stack-id to-card-stack-id card-id])

(defn map-card [table f]
  (map f (:cards table)))

(defn get-card-iterator [table]
  (:cards table))