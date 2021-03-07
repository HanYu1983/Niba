(ns app.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [app.model :refer [model sell buy]]))


(deftest test-model
  (let [ctx model
        _ (testing "一開始stock must nil" (is (nil? (:stock ctx))))
        ctx (buy ctx 10)
        _ (is (= 10 (:stock ctx)))
        ctx (sell ctx 12)
        _ (is (nil? (:stock ctx)))
        _ (is (= 2 (:money ctx)))]))