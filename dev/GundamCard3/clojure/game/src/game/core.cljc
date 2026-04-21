(ns game.core
  (:require [game.basic :refer :all]
            [game.command :refer :all]))

(defn -main [args]
  (test-text)
  (test-query-command)
  (test-table)
  (test-timing))