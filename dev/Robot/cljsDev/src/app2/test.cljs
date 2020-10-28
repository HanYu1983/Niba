(ns app2.test
  (:require [cljs.test :refer-macros [run-tests]]
            [clojure.spec.alpha :as s])
  (:require [app2.component.cursor-test]
            [app2.gameplay.phase-test]
            [tool.indexed-test]))

(defn main []
  (s/check-asserts true)
  (enable-console-print!)
  (run-tests 'app2.component.cursor-test
             'app2.gameplay.phase-test
             'tool.indexed-test))

(main)