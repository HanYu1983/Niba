(ns game.core
  (:require [game.basic :refer :all]
            [game.data :refer :all]
            [game.query-command :refer :all]
            [game.apply-command :refer :all]))

(defn -main [args]
  (test-text)
  (test-query-command)
  (test-table)
  (test-timing)
  (test-gsign)
  (test-battle-point)
  (test-get-card-data)
  (test-rules))