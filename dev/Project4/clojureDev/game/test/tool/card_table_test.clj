(ns tool.card-table-test
  (:require [clojure.test :refer :all]
            [clojure.spec.alpha :as s]
            [tool.card-table :as card-table]))


(s/check-asserts true)

#_(deftest a-test
  (testing "spec"
    (s/assert ::card-table/table card-table/table)))
