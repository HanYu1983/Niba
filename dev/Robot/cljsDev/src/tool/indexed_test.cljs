(ns tool.indexed-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [tool.indexed :refer [make-indexed sync-indexed]]))


 
(deftest test-1 []
  (testing "test-1"
    (async done (let [units {"a" {:position [0 1]}
                             "b" {:position [0 3]}
                             "c" {:position [1 1]}
                             "d" {:position [1 2]}}
                      indexed (make-indexed (fn [[_ v]]
                                              (get-in v [:position 1])))
                      indexed (reduce #(conj %1 %2) indexed units)

                      _ (is (= [["a" {:position [0 1]}]
                                ["c" {:position [1 1]}]
                                ["d" {:position [1 2]}]
                                ["b" {:position [0 3]}]] (into [] indexed)))

                      find (subseq indexed > ["" {:position [0 2]}])
                      _ (is (= '(["d" {:position [1 2]}] ["b" {:position [0 3]}])
                               find))

                      sync-fn (partial sync-indexed
                                       first
                                       second
                                       (fn [ctx id]
                                         (let [entity ((into {} ctx) id)]
                                           (disj ctx [id entity])))
                                       (fn [ctx id entity]
                                         (conj ctx [id entity]))
                                       (fn [ctx id entity]
                                         (let [old ((into {} ctx) id)]
                                           (if (= old entity)
                                             ctx
                                             (-> ctx
                                                 (disj [id old])
                                                 (conj [id entity]))))))

                      units {"a" {:position [0 1]}
                             "d" {:position [1 2]}}
                      indexed (sync-fn units indexed)
                      _ (is (= [["a" {:position [0 1]}] ["d" {:position [1 2]}]]
                               (into [] indexed)))

                      units {"a" {:position [2 5]}
                             "b" {:position [3 3]}
                             "c" {:position [2 1]}
                             "d" {:position [1 4]}}
                      indexed (sync-fn units indexed)
                      _ (is (= [["c" {:position [2 1]}] ["b" {:position [3 3]}] ["d" {:position [1 4]}] ["a" {:position [2 5]}]]
                               (into [] indexed)))]
                  (done)))))

(deftest test-2 []
  (testing "test-2"
    (async done (let [indexed {}
                      sync-fn (partial sync-indexed
                                       (fn [[_ v]]
                                         (:position v))
                                       second
                                       (fn [ctx id]
                                         (dissoc ctx id))
                                       (fn [ctx id entity]
                                         (assoc ctx id entity))
                                       (fn [ctx id entity]
                                         (assoc ctx id entity)))
                      units {"a" {:position [0 1]}
                             "b" {:position [0 3]}
                             "c" {:position [1 1]}
                             "d" {:position [1 2]}}
                      indexed (sync-fn units indexed)
                      _ (println indexed)]
                  (done)))))