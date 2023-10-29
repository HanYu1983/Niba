(ns app.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [lib.logic-tree]))

(defn -main [args]
  (println "ver 1.0.0")
  (lib.logic-tree/test-all)
  ;(app.text/test)
  (.println System/out "結束"))