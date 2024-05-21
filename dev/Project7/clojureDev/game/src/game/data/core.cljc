(ns game.data.core
  (:require [clojure.core :refer [read-string slurp]]
            [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.data.179030_11E_U_BL212N_blue]
            [game.data.179030_11E_U_BL209R_blue]))

(defn get-card-data [card-id]
  (-> (str "data/" card-id ".edn") slurp read-string eval
      (#(merge game.define.card-proto/default-card-proto-value %))
      (#(s/assert :game.define.card-proto/value %)))
  #_(-> (str "game.data." card-id "/value") read-string eval))

(defn tests []
  (doseq [card-id ["179030_11E_U_BL212N_blue"
                   "179030_11E_U_BL209R_blue"
                   "179030_11E_U_BL213S_blue"]]
    (-> card-id get-card-data))
  (-> "179030_11E_U_BL212N_blue" get-card-data :gsign (= [:blue :uc]) (or (throw (ex-info "must blue uc" {})))))


(defn test-card-proto []
(let [play-card-effect
      (merge game.define.effect/effect-value
             {:reason [:play-card ""]
              :text (merge game.define.card-text/card-text-value
                           {:type :system
                            :conditions {"合計國力6"
                                         {:tips '(fn [ctx runtime] ctx)
                                          :count 0
                                          :options {}
                                          :action '(fn [ctx runtime]
                                                     (-> ctx get-my-g count (> 6)))}
                                         "横置3個藍G"
                                         {:tips '(fn [ctx runtime] ctx
                                                   (-> ctx get-my-g-can-tap))
                                          :count 3
                                          :options {}
                                          :action '(fn [ctx runtime]
                                                       ; tap
                                                     ctx)}
                                         "放到play-card-zone"
                                         {:tips '(fn [ctx runtime]
                                                   ctx)
                                          :action '(fn [ctx runtime]
                                                     ctx)}}
                            :logic {"出機體"
                                    ['(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                                     '(fn [ctx runtime]
                                        (game.common.dynamic/cut-in ctx (->> {:reason [:play-card ""]
                                                                              :text (->> {:type :system
                                                                                          :logic {"移到場上"
                                                                                                  [nil
                                                                                                   '(fn [ctx runtime]
                                                                                                      ctx)]}}
                                                                                         (merge game.define.card-text/card-text-value)
                                                                                         (s/assert :game.define.card-text/value))}
                                                                             (merge game.define.effect/effect-value)
                                                                             (s/assert :game.define.effect/value))))]}})})]))