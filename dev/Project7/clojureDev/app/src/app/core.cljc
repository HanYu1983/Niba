(ns app.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]))

(defn -main [args]
  (println "ver 1.0.0")
  (app.text/test)
  (.println System/out "結束"))