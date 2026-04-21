(ns game.core
  (:require [game.basic :refer :all]
            [game.command :refer :all]
            [game.data :refer :all]))

(defn -main [args]
  (test-text)
  (test-query-command)
  (test-table)
  (test-timing)
  (test-gsign)
  (test-battle-point)
  (test-get-card-data))