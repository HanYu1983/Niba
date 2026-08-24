(ns gundam.card3.core-test
  (:require [clojure.test :refer [deftest is]]
            [gundam.card3.core :as core]))

(deftest hello-test
  (is (= "GundamCard3 Clojure 開發環境就緒。" (core/hello))))
