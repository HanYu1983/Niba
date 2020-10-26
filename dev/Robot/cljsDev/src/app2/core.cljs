(ns app2.core
  (:require [cljs.test :refer-macros [run-tests]]
            [clojure.spec.alpha :as s])
  (:require [app2.core-test]
            [app2.component.cursor-test]
            [app2.phase.core-test]
            [tool.indexed-test]))

(s/check-asserts true)

(defn main []
  (enable-console-print!)
  (run-tests 'app2.core-test
             'app2.component.cursor-test
             'app2.phase.core-test
             'tool.indexed-test))

(main)
