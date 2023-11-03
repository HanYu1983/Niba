(ns app.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [app.card-proto]
            [lib.logic-tree]
            [lib.util]))

(defn -main [args]
  (println "ver 1.0.0")
  ;(lib.util/test-all)
  (app.card-proto/test-all)
  ;(app.text/test)
  (.println System/out "結束"))