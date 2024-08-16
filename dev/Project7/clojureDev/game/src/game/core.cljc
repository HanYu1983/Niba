(ns game.core
  (:require [clojure.core.match]
            [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.define.basyou]
            [game.define.card-text]
            [game.define.effect]
            [game.define.gsign]
            [game.define.selection]
            [game.define.timing]
            [game.define.battle-point]
            [game.model.core]
            [game.model.effect]
            [game.model.table]
            [game.model.phase]
            [game.model.current-player]
            [game.model.selection]
            [game.model.card-table]
            [game.model.chip-table]
            [game.model.coin-table]
            [game.model.flags-player-status-component]
            [game.data.core]
            [game.exp]
            [game.model-flow.core]
            [game.binding-data-dynamic]))

(defn -main [args]
  (println "Running tests...")
  (s/check-asserts true)
  (try
    (game.exp/tests)
    (game.data.core/tests)
    (game.define.card-text/tests)
    (game.define.basyou/tests)
    (game.define.card-proto/tests)
    (game.define.effect/tests)
    (game.define.gsign/tests)
    (game.define.selection/tests)
    (game.define.timing/tests)
    (game.define.battle-point/tests)
    (game.model.core/tests)
    (game.model.effect/tests)
    (game.model.table/tests)
    (game.model.phase/tests)
    (game.model.current-player/tests)
    (game.model.card-table/tests)
    (game.model.chip-table/tests)
    (game.model.coin-table/tests)
    (game.model.flags-player-status-component/tests)
    (game.model-flow.core/tests)
    (println "All tests completed successfully.")
    (catch Exception e
      (.printStackTrace e)
      (println "An error occurred during testing:")
      (println (ex-message e) (ex-data e)))))