(ns game.data
  (:require [clojure.core :refer [read-string slurp]]
            [clojure.spec.alpha :as s]
            [game.basic :refer :all]))

(defn get-card-data [card-id]
  ; 其它方法
  (-> card-id empty? (and (throw (ex-info (str "card-id must exist:" card-id) {}))))
  (-> card-id
      (#(str "data/" % ".edn")) slurp read-string eval (#(s/assert :game.basic/card-proto %))))

(def get-card-data-memo (memoize get-card-data))

; =========================
(defmethod game-get-effect-card-id :game.data [game eff]
  "runtime-card-id")

(defmethod game-set-tip :game.data [game card-id condition-id tip]
  (println "game-set-tip " card-id condition-id tip)
  (update-in game [:tips card-id condition-id] (constantly tip)))

(defmethod game-get-tip :game.data [game card-id condition-id]
  (get-in game [:tips card-id condition-id]))

(defmethod game-get-tips :game.data [game card-id]
  (get-in game [:tips card-id]))

(defmethod game-tip-is-ok-to-perform :game.data [game tip]
  true)


(defn test-get-card-data []
  (let [data (get-card-data "test_card")
        _ (println data)
        ; save
        data-str (str data)
        ; load
        data2 (read-string data-str)
        _ (println data2)
        text (-> data2 :texts first)
        action (-> text (text-get-action 0))
        ctx (->> (action-evaluate-conditions action {:env :game.data, :version 0} {:env :game.data}))
        _ (println ctx)])
  (doseq [card-id ["test_card"]]
    (-> card-id get-card-data-memo))
  (-> "test_card" get-card-data-memo :gsign (= [:blue :uc]) (or (throw (ex-info "must blue uc" {})))))
