(ns app.test-runner
  (:require [cljs.test :refer-macros [run-tests]])
  (:require [module.v1.data-test]))


(defn- main []
  (enable-console-print!)
  (run-tests 'module.v1.data-test))

(main)