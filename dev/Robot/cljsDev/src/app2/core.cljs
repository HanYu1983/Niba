(ns app2.core
  (:require [cljs.test :refer-macros [run-tests]]
            [clojure.spec.alpha :as s])
  (:require [app2.core-test]
            [app2.cursor.core]))

(s/check-asserts true)

(defn main []
  (println "XXX")
  (enable-console-print!)
  (run-tests
   'app2.core-test))

(main)
