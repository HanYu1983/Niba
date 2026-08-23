(ns gundam.card3.table-engine-test
  (:require [clojure.test :refer [deftest is testing]]
            [clara.rules :as cr]
            [clara.rules.engine :as eng]
            [gundam.card3.table.engine :as table-eng]
            [gundam.card3.table.model :refer [->CardStack ->MoveTopCmd ->ShuffleCmd]]
            [gundam.card3.table.rules :as tr]
            [gundam.card3.table.stack-key :as sk]))

(def 本国 (sk/stack-key sk/player-a "本国"))
(def 手札 (sk/stack-key sk/player-a "手札"))

(deftest clara-query-and-insert-smoke
  (let [rb (:rulebase (eng/components (cr/mk-session 'gundam.card3.table.rules)))
        qk (keys (:query-nodes rb))
        s (-> (apply cr/insert (cr/mk-session 'gundam.card3.table.rules)
                     [(->CardStack "k" ["a" "b"])])
              cr/fire-rules)
        rows (cr/query s tr/card-stacks)]
    (is (seq qk) "rulebase 應註冊 card-stacks query")
    (is (= 1 (count rows)) "insert + fire 後應能查到 CardStack")
    (let [r (first rows)
          m (if (and (map? r) (:bindings r)) (:bindings r) r)
          fact (first (vals m))]
      (is (= "k" (:stack-key fact))))))

(deftest move-top-to-hand-append
  (let [st {本国 ["d1" "d2" "d3"] 手札 ["h1"]}
        out (table-eng/apply-command st (->MoveTopCmd 本国 手札 2 :bottom))]
    (is (= #{本国 手札} (set (keys out))))
    (is (= ["d3"] (out 本国)))
    (is (= ["h1" "d1" "d2"] (out 手札)))))

(deftest move-top-prepend-to-deck
  (let [st {本国 ["d1" "d2"] 手札 ["h1" "h2"]}
        out (table-eng/apply-command st (->MoveTopCmd 手札 本国 1 :top))]
    (is (= ["h1" "d1" "d2"] (out 本国)))
    (is (= ["h2"] (out 手札)))))

(deftest shuffle-preserves-multiset
  (let [ids (vec (map str (range 20)))
        st {本国 ids}
        out (table-eng/apply-command st (->ShuffleCmd 本国))]
    (is (= (frequencies ids) (frequencies (out 本国))))
    (is (= 20 (count (out 本国))))))

(deftest draw-six-opening
  "對齊 07／02：起手自本国頂抽 6 到手札（append）。"
  (let [deck (vec (map #(str "c" %) (range 10)))
        st {本国 deck 手札 []}
        out (table-eng/apply-command st (->MoveTopCmd 本国 手札 6 :bottom))]
    (is (= (vec (map #(str "c" %) (range 6))) (out 手札)))
    (is (= (vec (map #(str "c" %) (range 6 10))) (out 本国)))))

(deftest apply-commands-sequence
  (let [st {本国 ["a" "b" "c"] 手札 []}
        out (table-eng/apply-commands st
                                [(->ShuffleCmd 本国)
                                 (->MoveTopCmd 本国 手札 1 :bottom)])]
    (is (= 1 (count (out 手札))))
    (is (= 2 (count (out 本国))))))
