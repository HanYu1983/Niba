(ns app3.core
  (:require [clojure.edn :as edn]
            [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord Card [id])
(defrecord CardPosition [card-id position])
(defrecord SetCard [card-id unit-id])
(defrecord SetGroup [card-id card-ids])

(defrule setgroup
  [Card (= id ?card-id)]
  [CardPosition (= card-id ?card-id) (= position :set-area)]
  [?set-cards <- (acc/all :card-id) :from [SetCard (= unit-id ?card-id)]]
  =>
  (insert! (map->SetGroup {:card-id ?card-id :card-ids ?set-cards})))

(defquery get-card []
  [?items <- Card])

(defquery get-setgroup [?card-id]
  [?cards <- Card (= id ?card-id)]
  [?card-position <- CardPosition (= card-id ?card-id)]
  ;[?set-cards <- SetCard (= unit-id ?card-id)]
  [?set-groups <- SetGroup (= card-id ?card-id)])

(defn -main [args]
  (let [session (-> (mk-session 'app3.core)
                    (insert (map->Card {:id "card-A"})
                            (map->CardPosition {:card-id "card-A", :position :set-area})
                            (map->SetCard {:card-id "character", :unit-id "card-A"})
                            (map->SetCard {:card-id "operation-unit", :unit-id "card-A"}))
                    fire-rules)
        _ (println (query session get-setgroup :?card-id "card-A"))]))