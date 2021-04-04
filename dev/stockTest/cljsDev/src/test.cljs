(ns test
  (:require [cljs.test :refer-macros [run-tests]]
            [clojure.spec.alpha :as s]
            [tool.asyncjs]
            [app2.core-test]
            [app2.ui-test]))

(defn main []
  (enable-console-print!)
  (s/check-asserts true)
  (run-tests 'app2.core-test
             'app2.ui-test))

(main)