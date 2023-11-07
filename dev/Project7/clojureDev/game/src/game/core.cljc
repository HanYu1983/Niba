(ns game.core
  (:require [clojure.core.match]
            [clojure.spec.alpha :as s]
            [app.dynamic]
            [app.text]
            [game.define.card-proto]
            [game.define.basyou]
            [game.define.card-text]
            [game.tool.return-let]
            [game.tool.waterfall]
            [game.tool.callback]
            [game.tool.either]))

(defn -main [args]
  (s/check-asserts true)
  (game.define.card-text/tests)
  ;; (game.define.basyou/tests)
  ;; (game.tool.return-let/test-all)
  ;; (game.tool.waterfall/test-all)
  ;; (game.tool.callback/test-all)
  ;; (game.tool.either/test-all)
  (game.define.card-proto/tests)
  ())