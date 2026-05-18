(ns game.core
  (:require [clojure.spec.alpha :as s]
            ;; [game.basic :refer :all] 
            [game.data :refer :all] 
            [game.query-command :refer :all]
            ;; [game.impl :refer :all]
            [game.component :refer :all]))

(defn -main [args]
  (s/check-asserts true)
  (test-card-table)
  (test-current-player-id)
  (test-flag-component)
  (test-timing-component)
  (test-battle-point)
  (test-gsign)
  (test-text)
  (test-query-command)
  ;(test-get-card-data)
  )