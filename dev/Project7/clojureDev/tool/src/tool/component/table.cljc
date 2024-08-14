(ns tool.component.table
  (:require [clojure.spec.alpha :as s]
            [tool.card.table]))

(s/def ::table :tool.card.table/table)
(s/def ::spec (s/keys :req-un [::table]))

(defn get-table [ctx]
  (s/assert ::spec ctx)
  (-> ctx :table))

(defn set-table [ctx table]
  (s/assert ::spec ctx)
  (-> ctx (assoc :table table)))