(ns game.core
  (:require [clojure.spec.alpha :as s]
            [game.basic :refer :all]
            [game.data :refer :all]
            [game.query-command :refer :all]
            [game.impl :refer :all]))

(defn -main [args]
  (s/check-asserts true)
  (test-text)
  (test-query-command)
  (test-table)
  (test-timing)
  (test-gsign)
  (test-battle-point)
  (test-get-card-data)
  (test-rules))