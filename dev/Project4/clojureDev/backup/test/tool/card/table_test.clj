(ns tool.card.table-test
  (:require [clojure.test :refer :all]
            [tool.card.table :as table]))

(deftest create-table-test
  (is (= (table/create-table) {:decks {}, :cards {}})))

(deftest map-card-test
  (let [table {:cards {1 {:value 1}
                       2 {:value 2}}
               :decks {}}
        table' (table/map-card table (fn [card] (update card :value inc)))]
    (is (= (get-in table' [:cards 1]) {:value 2}))
    (is (= (get-in table' [:cards 2]) {:value 3}))
    (is (= (count (:cards table')) (count (:cards table))))))

(deftest add-card-test
  (let [table (table/create-table)]
    (is (= (table/add-card table :deck1 :card1 "King of Spades")
           {:decks {:deck1 [:card1]}, :cards {:card1 "King of Spades"}}))
    (is (= (table/add-card {:decks {:deck1 [:card1]}, :cards {:card1 "King of Spades"}}
                           :deck1 :card2 "Queen of Hearts")
           {:decks {:deck1 [:card1 :card2]}, :cards {:card1 "King of Spades" :card2 "Queen of Hearts"}}))))

(deftest remove-card-test
  (let [table (-> (table/create-table)
                  (table/add-card :deck1 :card1 "King of Spades")
                  (table/add-card :deck1 :card2 "Queen of Hearts"))]
    (is (= (table/remove-card table :card1)
           {:decks {:deck1 [:card2]}, :cards {:card2 "Queen of Hearts"}}))
    (is (= (table/remove-card {:decks {:deck1 [:card2]}, :cards {:card2 "Queen of Hearts"}}
                              :card2)
           {:decks {:deck1 []}, :cards {}}))))