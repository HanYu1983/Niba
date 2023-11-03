(ns game.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [app.card-proto]))

(defn -main [args]
  (println "game.core")
  (app.card-proto/test-all))