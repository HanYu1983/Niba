(ns client.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [<! go timeout]]
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

(enable-console-print!)

(defn tests []
  (go (<! (timeout 1000))
      (js/console.log "wow")
      (println "how"))
  (s/check-asserts true)
  (game.define.basyou/tests)
  (game.define.game-effect/tests)
  (game.define.card-proto/tests)
  (game.define.runtime/tests)
  (game.define.effect/tests)
  (game.component.cuts/tests)
  (game.component.effect/tests)
  (game.component.card-proto/tests)
  (game.entity.model/tests))

(tests)