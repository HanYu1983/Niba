(ns game.data.core
  (:require [clojure.core :refer [read-string slurp]]
            [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.data.dynamic]))

(defn get-card-data [card-id]
  ; 其它方法
  ; (-> (str "game.data." card-id "/value") read-string eval)
  (-> card-id empty? (and (throw (ex-info (str "card-id must exist:" card-id) {}))))
  (-> card-id
      (#(str "data/" % ".edn")) slurp read-string eval
      (#(merge game.define.card-proto/card-proto %))
      (#(s/assert :game.define.card-proto/value %))))

(def get-card-data-memo (memoize get-card-data))

(defn tests []
  (doseq [card-id ["179030_11E_U_BL212N_blue"
                   "179030_11E_U_BL209R_blue"
                   "179030_11E_U_BL213S_blue"]]
    (-> card-id get-card-data-memo))
  (-> "179030_11E_U_BL212N_blue" get-card-data-memo :gsign (= [:blue :uc]) (or (throw (ex-info "must blue uc" {})))))
