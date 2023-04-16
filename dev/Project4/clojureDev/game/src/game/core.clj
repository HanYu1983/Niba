(ns game.core
  (:require [clojure.spec.alpha :as s]
            [tool.basic]
            [game.define.event]
            [game.define.basyou]
            [game.define.card-text]
            [game.define.game-effect]
            [game.define.card-proto]
            [game.define.require]
            [game.define.runtime]
            [game.define.effect]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.entity.model]
            [data.CardProto_179030_11E_U_VT186R_purple]))

(defn tests []
  (s/check-asserts true)
  ;(tool.basic/tests)
  (game.define.card-text/tests)
  (game.define.basyou/tests)
  (game.define.game-effect/tests)
  (game.define.card-proto/tests)
  (game.define.require/tests)
  (game.define.runtime/tests)
  (game.define.effect/tests)
  (game.component.cuts/tests)
  (game.component.effect/tests)
  (game.component.card-proto/tests)
  (game.entity.model/tests)
  (data.CardProto_179030_11E_U_VT186R_purple/tests))

(defn -main []
  (let [_ (tests)]))