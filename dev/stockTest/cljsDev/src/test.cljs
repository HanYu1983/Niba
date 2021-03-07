(ns test
  (:require [cljs.test :refer-macros [run-tests]]
            [tool.asyncjs]
            [app.core-test]))

(defn main []
  (enable-console-print!)
  (run-tests 'tool.asyncjs
             'app.core-test))

(main)