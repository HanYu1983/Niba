(ns game.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [game.define.card-proto]
            [game.define.basyou]
            [game.tool.return-let]
            [game.tool.waterfall]
            [game.tool.callback]
            [game.tool.either]))

(defn -main [args]
  (game.define.basyou/tests)
  ;; (game.tool.return-let/test-all)
  ;; (game.tool.waterfall/test-all)
  ;; (game.tool.callback/test-all)
  ;; (game.tool.either/test-all)
  (game.define.card-proto/test-all))