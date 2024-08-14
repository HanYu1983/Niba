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
            [game.component.core]
            [game.component.effect]
            [game.component.table]
            [game.component.phase]
            [game.component.current-player]
            [game.component.selection]
            [game.component.card-table]
            [game.component.chip-table]
            [game.component.coin-table]
            [game.component.flags-player-status-component]
            [game.entity.model]
            [game.entity.model-flow]
            [game.data.core]
            [game.exp]))

(defn -main [args]
  (s/check-asserts true)
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
  (game.component.core/tests)
  (game.component.effect/tests)
  (game.component.table/tests)
  (game.component.phase/tests)
  (game.component.current-player/tests)
  (game.component.card-table/tests)
  (game.component.chip-table/tests)
  (game.component.coin-table/tests)
  (game.component.flags-player-status-component/tests)
  (game.entity.model-flow/tests))