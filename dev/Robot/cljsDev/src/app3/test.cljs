(ns app3.test
  (:require [cljs.test :refer-macros [run-tests]]
            [clojure.spec.alpha :as s]
            [app3.gameplay.core-test]))

(defn main []
  (s/check-asserts true)
  (enable-console-print!)
  (run-tests 'app3.gameplay.core-test))

(main)