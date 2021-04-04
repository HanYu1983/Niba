(ns app2.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.spec.alpha :as s]
            [app2.alg :as alg]))


(deftest test-model
  (let [model (s/assert ::alg/model alg/model)
        model (alg/player-move model "player" 1)
        _ (s/assert ::alg/model model)
        _ (testing "移動後位置為1"
            (is (= 1 (get-in model [:players "player" :position]))))
        model (alg/step-earn model 0)
        _ (s/assert ::alg/model model)
        _ (testing "xxx"
            (is (= 1 (get-in model [:grids 0 :building :food]))))]))