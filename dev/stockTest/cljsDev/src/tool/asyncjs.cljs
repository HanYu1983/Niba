(ns tool.asyncjs
  (:require [cljs.test :refer-macros [deftest is testing async]]
            ["async" :as a]))

(defn basic-loop [iteratee test ctx cb]
  (let [atom-ctx (atom ctx)]
    (a/doUntil (fn [cb]
                 (iteratee @atom-ctx (fn [err ctx]
                                       (when (not err)
                                         (reset! atom-ctx ctx))
                                       (cb err ctx))))
               test
               cb)))

(deftest test-basic-loop
  (async done
         (basic-loop (fn [ctx cb]
                       (js/setTimeout (fn []
                                        (cb nil (inc ctx)))
                                      1000))
                     (fn [ctx cb]
                       (cb nil (= ctx 3)))

                     0
                     (fn [err result]
                       (testing "result must be 3"
                         (is (= err nil))
                         (is (= result 3)))
                       (done)))))